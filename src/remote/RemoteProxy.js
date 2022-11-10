import { Controller } from './Controller.js'
import { Args } from './TypeFuncs.js'
import { WrapArg } from './WrapArg.js'

function toPointer(/**@type {string[]}*/ parts) {
	return '#' + parts.map(part => String(part).replace(/~/g, '~0').replace(/\//g, '~1')).join('/')
}

globalThis.ProxySymbol = Symbol()
const oldConstructor = Proxy.constructor
Proxy.constructor = (target, handler) => {
	let ret = oldConstructor(target, handler)
	Object.defineProperty(ret, ProxySymbol, {enumerable: false, value: target})
	return ret
}

globalThis.ObjectMap = new Map()
function base() {}

export function Remote(/**@type {Controller}*/ controller, /**@type {number}*/ objectId, /**@type {string[]}*/ path = []) {
	this.$objectId = objectId
	this.$path = path
	/**@type {ProxyHandler}*/ const remote = {
		get: (/**@type {Remote}*/ target, key, receiver) => {
			if (key === ProxySymbol) {
				return target
			} else if (key == 'then'){
				const getId = Math.random() * Number.MAX_SAFE_INTEGER
				controller.AddToQueue({
					type: 2,
					objectId: this.$objectId,
					path: this.$path,
					getId: getId
				})
				return async (resolve, reject) => {
					controller.pendingGetResolves.set(getId, {
						objectId: this.$objectId,
						path: this.$path,
						resolve
					})
				}
			} else {
				return new Remote(controller, this.$objectId, [...this.$path, key.toString()])
			}
		},
		set: (/**@type {Remote}*/ target, key, value) => {
			const nextPath = target.$path.slice()
			controller.AddToQueue({
				type: 1,
				objectId: this.$objectId,
				path: [...nextPath, key],
				argsData: WrapArg(value, controller)
			})
			return true
		},
		apply: (/**@type {Remote}*/ target, thisArg, args) => {
			if (this.$path[this.$path.length - 1] == 'then') {
				this.$path.pop()
				const getId = Math.random() * Number.MAX_SAFE_INTEGER
				controller.AddToQueue({
					type: 2,
					objectId: this.$objectId,
					path: this.$path,
					getId: getId
				})
				controller.pendingGetResolves.set(getId, {
					objectId: this.$objectId,
					path: this.$path,
					resolve: args[0]
				}) 
				return undefined
			}
			const returnId = Math.random() * Number.MAX_SAFE_INTEGER
			controller.AddToQueue({
				type: 0,
				objectId: this.$objectId,
				path: this.$path,
				argsData: args.map(arg => WrapArg(arg, controller)),
				returnId
			})
			return new Remote(controller, returnId, [])
		},
		construct: (/**@type {Remote}*/ target, args, newTarget) => {
			const returnId = Math.random() * Number.MAX_SAFE_INTEGER
			controller.AddToQueue({
				type: 3,
				objectId: this.$objectId,
				path: this.$path,
				argsData: args.map(arg => WrapArg(arg, controller)),
				returnId
			})
			return new Remote(controller, returnId)
		}
	}
	/**@type {any}*/ const func = function () {}
	func.$objectId = objectId
	func.$path = path
	let ret = new Proxy(func, remote)
	//so that objectId 0 does not get registered for cleanup
	if(objectId) {
		controller.finalizationRegistry.register(ret, objectId)
	}
	return ret
}