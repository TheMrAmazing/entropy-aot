import { Remote } from './RemoteProxy.js'
import { Args, isObject, isPrimitive } from './TypeFuncs.js'
import {Controller} from './Controller.js'
import {Receiver} from './Receiver.js'

function toPointer(/**@type {string[]}*/ parts) {
	return '#' + parts.map(part => String(part).replace(/~/g, '~0').replace(/\//g, '~1')).join('/')
}

 async function DeProxyAndDePromise(val) {
	if(val[ProxySymbol]) {
		val = val[ProxySymbol]
	}
	val = await val
	if(val[ProxySymbol]) {
		val = val[ProxySymbol]
	}
	return val
}

function makeFunction(scope, func) {
	let keys = Object.keys(scope)
	let values = Object.values(scope)
	return new Function(...keys, 'return ' + func.toString())(...values)
}

/**@returns {Promise<{root: Object, refs: Object}>}*/
export async function WrapArg(arg, /**@type {Controller | Receiver}*/ remoter) {
	const refs = {}
	const paths = new WeakMap()
	
	async function register(path, ret, wrap) {
		let pointer = toPointer(path)
		paths.set(ret, pointer)
		let res = await wrap(path, ret)
		refs[pointer] = res
		return {
			$type: 0, 
			$ref: pointer 
		}
	}

	async function wrapRemote(path, ret) {
		return await register(path, ret, async ()=> {
			const {$objectId, $path} = ret
			return {
				$type: 1,
				$objectId,
				$path
			}
		})
	}
	
	async function wrapBaseEntity(path, ret) {
		return await register(path, ret, async ()=> {
			const refpath = ret.$ref.split('#')[1].split('/').filter(str => str != '')
			const proxyPath = [...refpath]
			return {
				$type: 1,
				$objectId: 0,
				$path: proxyPath
			}
		})
	}
	
	async function wrapFunctionArg(path, ret) {
		return await register(path, ret, async ()=> {
			let args = ret()
			return {
				$type: 2,
				func: args.func,
				scope: args.scope
			}
		})
	}
	
	async function wrapCallback(path, ret) {
		return await register(path, ret, async ()=> {
			if (remoter.remoterType == 'Controller') {
				return {
					$type: 3,
					id: remoter.GetCallbackId(ret)
				}
			}
			return {$type: 4}
		})
	}

	async function wrapArray(path, ret) {
		return await register(path, ret, async ()=> {
			let val = []
			await Promise.all(ret.map(async (el, i) => val.push(await replacer([...path, i.toString()], el))))
			return {
				$type: 5,
				val
			}
		})
	}
	
	async function wrapObject(path, ret) {
		return await register(path, ret, async ()=> {
			let val = {}
			await Promise.all(Object.keys(ret).map(async key => val[key] = await replacer([...path, key], ret[key])))
			return {
				$type: 6,
				val
			}
		})
	}

	const replacer = async (path, value) => {
		let ret = value

		if(isPrimitive(ret)) {
			return ret
		}

		ret = await DeProxyAndDePromise(ret)

		if(ret.$objectId != undefined) {
			return await wrapRemote(path, ret)
		}

		if (ret.$ref != undefined) {
			return await wrapBaseEntity(path, ret)
		}

		if(ret[functionSymbol] != undefined) {
			return await wrapFunctionArg(path, ret)
		}

		if (typeof ret == 'function') {
			return await wrapCallback(path, ret)
		}

		let seen = paths.get(ret)
		if (seen) {
			return {
				$type: 0, 
				$ref: seen 
			}
		}

		if(ret instanceof Array) {
			return await wrapArray(path, ret)
		}
			
		return await wrapObject(path, ret)
	}

	let root = await replacer([], arg) 
	return {
		root,
		refs
	}
}

export function UnwrapArg(/**@type {Object}*/ root, /**@type {Object}*/ refs, /**@type {Controller | Receiver}*/ remoter) {
	let arr = Object.keys(refs)
	let seen = new Set()
	if(isPrimitive(root)) {
		return root
	}

	const peel = (key) => {
		let base = refs[key]
		if (!seen.has(key)) {
			seen.add(key)
			if (typeof base == 'object' && base.$type) {
				switch(base.$type) {
					case 0:
						refs[key] = peel(base.$ref)
						break
					case 1:
						if (remoter.remoterType == 'Controller') {
							refs[key] = new Remote(remoter, base.$objectId, base.$path)
						} else {
							refs[key] = remoter.IdToObject(base.$objectId, base.$path)
						}
						break
					case 2: 
						refs[key] = makeFunction(base.scope, base.func)
						break
					case 3:
						//@ts-ignore
						refs[key] = remoter.GetCallbackShim(base.id)
						break
					case 4:
						console.error('unknown function')
						refs[key] = undefined
						break
					case 5:
						let res = []
						refs[key] = res
						base.val.forEach(el => {
							if(el != undefined && el.$type != undefined && el.$type == 0) {
								res.push(peel(el.$ref))
							} else {
								res.push(el)
							}
						})
						break
					case 6:
						let obj = {}
						refs[key] = obj
						Object.entries(base.val).forEach(prop => {
							if(prop[1] != undefined && prop[1].$type != undefined && prop[1].$type == 0) {
								obj[prop[0]] = peel(prop[1].$ref)
							} else {
								obj[prop[0]] = prop[1]
							}
						})
						break
				}
			}
		}
		return refs[key]
	}

	for (let x = 0; x < arr.length; x++) {
		let key = arr[x]
		peel(key)
	}
	return peel(root.$ref)
}
