import { Remote } from './RemoteProxy.js'
import { Args, isObject, isPrimitive } from './TypeFuncs.js'
/**@typedef {import('./Controller.js').Controller} Controller*/
function toPointer(/**@type {string[]}*/ parts) {
	return '#' + parts.map(part => String(part).replace(/~/g, '~0').replace(/\//g, '~1')).join('/')
}

/**@returns {Promise<{root: Object, refs: Object}>}*/
async function decycle(obj) {
	if(isPrimitive(obj)) {
		return await obj
	}
	const refs = {}
	const paths = new WeakMap()

	const replacer = async (path, value) => {
		let ret = value
		if(isPrimitive(ret)) {
			return ret
		}
		if(ret[ProxySymbol]) {
			ret = ret[ProxySymbol]
		}
		if (ret?.then) {
			ret = await ret
			if(ret[ProxySymbol]) {
				ret = ret[ProxySymbol]
			}
		}
		if(ret.$ref) {
			let pointer = toPointer(path)
			return {$ref: pointer} 
		}
		let seen = paths.get(ret)
		if (seen) {
			return { $ref: seen }
		}
		else {
			let pointer = toPointer(path)
			paths.set(ret, pointer)
			let res
			if(ret instanceof Array) {
				res = []
				await Promise.all(ret.map(async (val, i) => res.push(await replacer([...path, i.toString()], val))))
			} else {
				res = {}
				await Promise.all(Object.keys(ret).map(async key => res[key] = await replacer([...path, key], ret[key])))
			}
			refs[pointer] = res
			return { $ref: pointer }
		}
	}
	let root = await replacer([], obj) 
	return {
		root,
		refs
	}
}

/**@returns {Promise<import('./types').Arg>}*/
export async function WrapArg(arg) {
	if (isPrimitive(arg)) {
		if(arg && arg[ProxySymbol]) {
			return {
				type: Args.Primitive,
				value: arg[ProxySymbol]
			}
		}
		return {
			type: Args.Primitive,
			value: arg
		}
	} else if (typeof arg == 'object') {
		const {root, refs} = await decycle(arg)
		return {
			type: Args.Object,
			root,
			refs
		}	
	} else if (typeof arg === 'function') {
		const remoteTarget = arg[ProxySymbol]
		if (remoteTarget) {
			return {
				type: Args.Remote,
				value: remoteTarget.objectId,
				path: remoteTarget.path
			}
		}
		const isFunction = arg[functionSymbol]
		if (isFunction) {
			let vals = arg()
			return {
				type: Args.Function,
				func: vals.func,
				scope: vals.scope
			}
		}
		return {
			type: Args.Callback, //Callback
			value: arg
		}
	}
	else
		throw new Error('invalid argument')
}

export function recycle(/**@type {Object}*/ root, /**@type {Object}*/ refs, /**@type {Controller}*/ controller, objectId, basePath) {
	let seen = new Set()
	const cycle = (base) => {
		if(base && base.$ref) {
			if (refs[base.$ref]) {
				let next = refs[base.$ref]
				if(!seen.has(base.$ref)) {
					seen.add(base.$ref)
					if(typeof next == 'object' && next.$ref == undefined) {
						Object.entries(next).forEach(prop => {
							next[prop[0]] = cycle(prop[1])
						})
					}
				}
				if(next.$ref) {
					const path = base.$ref.split('#')[1].split('/').filter(str => str != '')
					const proxyPath = [...path]
					return new Remote(controller, objectId, proxyPath)
				}
				return next
			}
			else {
				const path = base.$ref.split('#')[1].split('/').filter(str => str != '')
				const proxyPath = [...path]
				return new Remote(controller, objectId, proxyPath)
			}
		}
		return base
	}
	return cycle(root)
}
