/**@typedef {import('./types').Command} Command*/import { objectProxy } from './RemoteObject.js'
import { propertyProxy } from './RemoteProperty.js'
import { refProxy } from './RefProxy.js'

export class Controller {
	commandQueue = []
	finalizationRegistry
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
			id = Math.random() * Number.MAX_SAFE_INTEGER
			this.callbackToId.set(func, id)
			this.idToCallback.set(id, func)
		}
		return id
	}

	MakeReturn(getId, val) {
		const resolve = this.pendingGetResolves.get(getId)
		if (val?.$ref != undefined) {
			val = new Proxy(val, refProxy(this, resolve.objectId, [...resolve.path]))
		}
		else if (!CanStructuredClone(val)) {
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
		const flushId = Math.random() * Number.MAX_SAFE_INTEGER
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
	AddGet(objectId, path) {
		const getId = Math.random() * Number.MAX_SAFE_INTEGER
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
