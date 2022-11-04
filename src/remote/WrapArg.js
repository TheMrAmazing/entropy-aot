import { Remote } from './RemoteProxy.js'
import { Args, isObject, isPrimitive } from './TypeFuncs.js'
/**@typedef {import('./Controller.js').Controller} Controller*/
function toPointer(/**@type {string[]}*/ parts) {
	return '#' + parts.map(part => String(part).replace(/~/g, '~0').replace(/\//g, '~1')).join('/')
}

/**@returns {Promise<{root: Object, refs: Map<string, Object>}>}*/
async function decycle(obj) {
	if(isPrimitive(obj)) {
		return await obj
	}
	const refs = new Map()
	const paths = new WeakMap()

	const replacer = async (path, value) => {
		if(isPrimitive(value)) {
			return value
		} else if (typeof value == 'object' && !value.$ref) {
			if (value?.then) {
				value = await value
			}
			if(value[ProxySymbol]) {
				value = value[ProxySymbol]
			}
			if(value.$ref) {
				let pointer = toPointer(path)
				paths.set(value, pointer)
				refs.set(pointer, value)
			}
			let seen = paths.get(value)
			if (seen) {
				value = { $ref: seen }
			}
			else {
				let pointer = toPointer(path)
				paths.set(value, pointer)
				await Promise.all(Object.keys(value).map(async key => value[key] = await replacer([...path, key], value[key])))
				refs.set(pointer, value)
				value = { $ref: pointer }
			}
		}
		return value
	}

	return {
		root: await replacer([], obj),
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

export function recycle(/**@type {Object}*/ root, /**@type {Map<string, Object>}*/ refs, /**@type {Controller}*/ controller, objectId, basePath) {
	let seen = new Set()
	const cycle = (base) => {
		if(base && base.$ref) {
			if (refs.has(base.$ref)) {
				let next = refs.get(base.$ref)
				if(!seen.has(base.$ref)) {
					seen.add(base.$ref)
					if(typeof next == 'object') {
						Object.entries(next).forEach(prop => {
							next[prop[0]] = cycle(prop[1])
						})
					}
				}
				return next
			} else {
				if(basePath) {
					const path = base.$ref.split('#')[1].split('/').filter(str => str != '')
					const proxyPath = [...path]
					// return new Remote(controller, objectId, proxyPath)
					return base
				}
			}
		} else {
			return base
		}
	}
	return cycle(root)
}
