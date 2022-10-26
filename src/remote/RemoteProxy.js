import { Controller } from './Controller.js'
import { WrapArg } from './WrapArg.js'

globalThis.ProxySymbol = Symbol()

Proxy.constructor = (target, handler) => {
	let ret = oldConstructor(target, handler)
	Object.defineProperty(ret, ProxySymbol, {enumerable: false, value: target})
	return ret
}


globalThis.ObjectMap = new Map()

export function Remote(/**@type {Controller}*/ controller, /**@type {number}*/ objectId, /**@type {string[]}*/ path) {
	this.objectId = objectId
	this.path = path

	/**@type {ProxyHandler}*/ const remote = {
		get: (/**@type {Remote}*/ target, key, receiver) => {
			if (key === ProxySymbol) {
				return target
			} else if (key == 'then'){
				return (resolve, reject) => {
					const getId = Math.random() * Number.MAX_SAFE_INTEGER
					controller.AddToQueue({
						type: 2,
						objectId: this.objectId,
						path: this.path,
						getId: getId
					})
					controller.pendingGetResolves.set(getId, { objectId: this.objectId, path: this.path, func: resolve})
				}
			} else {
				return new Remote(controller, this.objectId, [...this.path, key.toString()])
			}
		},
		set: (/**@type {Remote}*/ target, key, value) => {
			const nextPath = target.path.slice()
			if (value) {
				controller.AddToQueue({
					type: 1,
					objectId: this.objectId,
					path: nextPath,
					argsData: WrapArg(value)
				})
			}
			return true
		},
		apply: (/**@type {Remote}*/ target, thisArg, args) => {
			if (this.path[this.path.length - 1] == 'then') {
				this.path.pop()
				const getId = Math.random() * Number.MAX_SAFE_INTEGER
				controller.AddToQueue({
					type: 2,
					objectId: this.objectId,
					path: this.path,
					getId: getId
				})
				controller.pendingGetResolves.set(getId, { objectId: this.objectId, path: this.path, func: args[0] })
				return undefined
			}
			const returnId = Math.random() * Number.MAX_SAFE_INTEGER
			controller.AddToQueue({
				type: 0,
				objectId: this.objectId,
				path: this.path,
				argsData: args.map(arg => WrapArg(arg)),
				returnId
			})
		},
		construct: (/**@type {Remote}*/ target, args, newTarget) => {
			const returnId = Math.random() * Number.MAX_SAFE_INTEGER
			controller.AddToQueue({
				type: 3,
				objectId: this.objectId,
				path: this.path,
				argsData: args.map(arg => WrapArg(arg)),
				returnId
			})
			return new Remote(controller, returnId, [])
		}
	}
	let ret = new Proxy(this, remote)
	controller.finalizationRegistry.register(ret, this.objectId)
	return ret
}