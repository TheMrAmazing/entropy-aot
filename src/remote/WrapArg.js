import { Controller} from './Controller'
import { isPrimitive } from './types.js'
import { isProxy } from 'util/types'

function isObject(value) {
	return typeof value === 'object'
        && value != null
        && !(value instanceof Boolean)
        && !(value instanceof Date)
        && !(value instanceof Number)
        && !(value instanceof RegExp)
        && !(value instanceof String)
}

function isCloneable(obj) {
	try {
		postMessage(obj, '*')
	} catch (error) {
		if (error?.code === 25) return false // DATA_CLONE_ERR
	}
	return true
}

/**@returns {Promise<{root: Object, refs: Map<string, Object>}>}*/
async function decycle(obj) {
	if(!isObject(obj)) {
		return obj
	}

	const refs = new Map()
	const paths = new WeakMap()

	const replacer = async (path, value) => {
		if (isObject(value) && !value.$ref) {
			if (value?.then) {
				value = await value
			}
			if (value[proxySymbol]) {
				if (value?.then) {
					value = await value
				}
				if(value[proxySymbol].$ref) {
					let pointer = toPointer(path)
					value = value[proxySymbol]
					paths.set(value, pointer)
					refs.set(pointer, value)
				}
			}
			else {
				let seen = paths.get(value)
				if (seen) {
					value = { $ref: seen }
				}
				else {
					let pointer = toPointer(path)
					paths.set(value, pointer)
					await Promise.all(Object.keys(value).map(async (key) => {
						value[key] = await replacer([...path, key], value[key])
					}))
					Object.keys(value).forEach(key => value[key] = replacer([...path, key], value[key]))
					refs.set(pointer, value)
					value = { $ref: pointer }
				}
			}
		}
		return value
	}

	return {
		root: await replacer([], obj),
		refs
	}
}

/**@returns {Promise<import('./types').Arg>} */
export async  function WrapArg(arg) {
	if(arg && arg.getId) {
		if(!isObject(arg.obj)) {
			return {
				type: 6, //ReturnPrimitive
				value: arg.obj,
				getId: arg.getId
			}
		} else {
			const {root, refs} = await decycle(arg.obj)
			return {
				type: 7, //ReturnObject
				root,
				refs,
				getId: arg.getId
			}
		}
	}
	else if (typeof arg === 'function') {
		const objectId = arg[Controller.ObjectSymbol]
		if (typeof objectId === 'number') {
			return {
				type: 2, //RemoteObject
				value: objectId
			}
		}
		const propertyTarget = arg[Controller.TargetSymbol]
		if (propertyTarget) {
			return {
				type: 3, //RemoteProperty
				value: propertyTarget._objectId,
				path: propertyTarget._path
			}
		}
		const isFunction = arg[functionSymbol]
		if (isFunction) {
			let vals = arg()
			return {
				type: 5, //Function
				func: vals.func,
				scope: vals.scope
			}
		}
		return {
			type: 4, //Callback
			value: this.GetCallbackId(arg)
		}
	}
	else if (isCloneable(arg)) {
		return {
			type: 0, //Primitive
			value: arg
		}
	}
	else if (typeof arg == 'object') {
		const {root, refs} = await decycle(arg)
		return {
			type: 1, //Object
			root,
			refs
		}	
	}
	else
		throw new Error('invalid argument')
}

export function recycle(/**@type {Object}*/ root, /**@type {Map<string, Object>}*/ refs) {
	refs.forEach((val, key) => {
		const path = key.split('/')
		let base = {}	
		path.forEach(step => {
			if(step == '#') {
				base = root
			} else if (base[step]) {
				base = base[step]
			} else {
				base[step] = {}
				base = base[step]
			}
		})
		Object.assign(base, val)
		if (base.$ref) {
			delete base.$ref
		}
	})
	return root
}
