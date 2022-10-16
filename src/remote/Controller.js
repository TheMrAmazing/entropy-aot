import { CanStructuredClone } from './types.js'

/**@typedef {import('./types').Command} Command*/import { objectProxy } from './ObjectProxy.js'
import { propertyProxy } from './PropertyProxy.js'
import { refProxy } from './RefProxy.js'
const functionSymbol = Symbol()
export class Controller {
	commandQueue = []
	finalizationRegistry
	finalizeIntervalMs = 10
	finalizeIdQueue
	finalizeTimerId
	nextGetId = 0
	nextFlushId = 0
	nextCallbackId = 0
	callbackToId = new Map()
	idToCallback = new Map()
	pendingGetResolves = new Map()
	pendingFlushResolves = new Map()
	isPendingFlush = false
	static ObjectSymbol = Symbol()
	static TargetSymbol = Symbol()
	messenger
	Remote = this.MakeObject(0)
	AddToQueue(command) {
		this.commandQueue.push(command)
		if (!this.isPendingFlush) {
			this.isPendingFlush = true
			Promise.resolve().then(() => this.Flush())
		}
	}
	GetCallbackId(func) {
		let id = this.callbackToId.get(func)
		if (typeof id === 'undefined') {
			id = this.nextCallbackId++
			this.callbackToId.set(func, id)
			this.idToCallback.set(id, func)
		}
		return id
	}
	WrapArg(arg) {
		if (typeof arg === 'function') {
			const objectId = arg[Controller.ObjectSymbol]
			if (typeof objectId === 'number') {
				return {
					type: 1, //Object
					value: objectId
				}
			}
			const propertyTarget = arg[Controller.TargetSymbol]
			if (propertyTarget) {
				return {
					type: 3, //ObjectProperty
					value: propertyTarget._objectId,
					path: propertyTarget._path
				}
			}
			const isFunction = arg[functionSymbol]
			if (isFunction) {
				let vals = arg()
				return {
					type: 4, //Function
					func: vals.func,
					scope: vals.scope
				}
			}
			return {
				type: 2, //Callback
				value: this.GetCallbackId(arg)
			}
		}
		else if (CanStructuredClone(arg)) {
			return {
				type: 0, //Primitive
				value: arg
			}
		}
		else if (typeof arg == 'object') {
			return {
				type: 0, //Primitive
				value: arg
			}
		}
		else
			throw new Error('invalid argument')
	}
	MakeReturn(getId, val) {
		const resolve = this.pendingGetResolves.get(getId)
		if (val?.$ref != undefined) {
			val = new Proxy(val, refProxy(this, resolve.objectId, [...resolve.path]))
		}
		else if (val != undefined) {
			Reflect.ownKeys(val).forEach(key => {
				if (val[key].$ref != undefined) {
					val[key] = new Proxy(val[key], refProxy(this, resolve.objectId, [...resolve.path, key]))
				}
			})
		}
		return val
	}
	UnwrapArg(arg) {
		switch (arg.type) {
		case 0: //Primitive
			return arg.value
		case 1: //Object
			return this.MakeObject(arg.value)
		case 5: //Return
			return this.MakeReturn(arg.getId, arg.value)
		default:
			throw new Error('invalid arg type')
		}
	}
	Flush() {
		this.isPendingFlush = false
		if (!this.commandQueue.length)
			return Promise.resolve()
		const flushId = this.nextFlushId++
		this.messenger.postMessage({
			type: 1,
			commands: this.commandQueue,
			flushId: flushId
		})
		this.commandQueue.length = 0
		return new Promise(resolve => {
			this.pendingFlushResolves.set(flushId, resolve)
		})
	}
	OnMessage(data) {
		switch (data.type) {
		case 0:
			this.OnDone(data)
			break
		case 1:
			this.OnCallback(data)
			break
		default:
			throw new Error('invalid message type: ' + data)
		}
	}
	OnDone(data) {
		for (const { getId, valueData } of data.results) {
			const resolve = this.pendingGetResolves.get(getId)
			if (!resolve)
				throw new Error('invalid get id')
			let val = this.UnwrapArg(valueData)
			this.pendingGetResolves.delete(getId)
			resolve.func(val)
		}
		const flushId = data.flushId
		const flushResolve = this.pendingFlushResolves.get(flushId)
		if (!flushResolve)
			throw new Error('invalid flush id')
		this.pendingFlushResolves.delete(flushId)
		flushResolve(undefined)
	}
	OnCallback(data) {
		const func = this.idToCallback.get(data.id)
		if (!func)
			throw new Error('invalid callback id')
		const args = data.args.map(arg => this.UnwrapArg(arg))
		func(...args)
	}
	MakeObject(id) {
		const func = function () { }
		func._objectId = id
		const ret = new Proxy(func, objectProxy(this))
		if (this.finalizationRegistry)
			this.finalizationRegistry.register(ret, id)
		return ret
	}
	MakeProperty(objectId, path) {
		const func = function () { }
		func._objectId = objectId
		func._path = path
		func._nextCache = new Map()
		return new Proxy(func, propertyProxy(this))
	}
	AddGet(objectId, path) {
		const getId = this.nextGetId++
		this.AddToQueue({
			type: 2,
			objectId: objectId,
			path: path,
			getId: getId
		})
		return new Promise(resolve => {
			this.pendingGetResolves.set(getId, resolve)
		})
	}
}
export function fnArg(scope, fn) {
	let ret = () => {
		return {
			func: fn.toString(),
			scope
		}
	}
	Object.defineProperty(ret, functionSymbol, { value: true, enumerable: false })
	return ret
}
