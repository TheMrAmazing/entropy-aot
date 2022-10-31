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
		if (isObject(value) && !value.$ref) {
			if (value?.then) {
				value = await value
			}
			if(value[ProxySymbol]) {
				value = value[ProxySymbol]
			}
			if(value.$ref) {
				let pointer = toPointer(path)
				value = value[ProxySymbol]
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

export function recycle(/**@type {Object}*/ root, /**@type {Map<string, Object>}*/ refs, /**@type {Controller}*/ controller, objectId, basePath, ) {
	refs. forEach((val, key) => {
		const path = key.split('#')[1].split('/')
		let base = root
		let step
		path.forEach((i) => {
			step = i
			if (i) {
				if (base[step]) {
					base = base[step]
				} else {
					base[step] = {}
					base = base[step]
				}
			}
		})
		if (isObject(val)) {
			Object.entries(val).forEach(prop => {
				if(prop[1] && prop[1].$ref) {
					base[prop[0]] = new Remote(controller, objectId, [...basePath, ...path.filter(str => (str == '') ? false : true), prop[0]])
				} else {
					base[prop[0]] = prop[1]
				}
			})
		} else if (step) {
			base[step] = val
		}
		if (base.$ref) {
			delete base.$ref
		}
	})
	return root
}
