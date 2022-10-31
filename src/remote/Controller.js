/**@typedef {import('./types').Arg} Arg*/
/**@typedef {import('./types').Command} Command*/
/**@typedef {import('./types').ReceiverMessageDone} ReceiverMessageDone*/
/**@typedef {import('./types').ReceiverMessageCallback} ReceiverMessageCallback*/
/**@typedef {import('./types').ReceiverMessage} ReceiverMessage*/
/**@typedef {import('./types').Resolve} Resolve*/
import { Remote } from './RemoteProxy.js'
import { Args } from './TypeFuncs.js'
import { recycle } from './WrapArg.js'

export class Controller {
	/**@type {Command[]}*/ commandQueue = []
	/**@type {Map<Function, number>}*/ callbackToId = new Map()
	/**@type {Map<number, Function>}*/ idToCallback = new Map()
	/**@type {Map<number, Resolve>}*/ pendingGetResolves = new Map()
	/**@type {Map<number, Function>}*/ pendingFlushResolves = new Map()
	isPendingFlush = false
	messenger
	finalizeTimerId
	finalizeIntervalMs = 10
	/**@type {number[]}*/ finalizeIdQueue = []

	finalizationRegistry = new FinalizationRegistry((/**@type {number}*/ id) => {
		this.finalizeIdQueue.push(id)
		if (this.finalizeTimerId === -1) {
			this.finalizeTimerId = setTimeout(() => {
				this.finalizeTimerId = -1
				this.messenger.postMessage({
					type: 0,
					ids: this.finalizeIdQueue	
				})
				this.finalizeIdQueue.length = 0
			}, this.finalizeIntervalMs)
		}
	})

	remote = new Remote(this, 0)

	AddToQueue(/**@type {Command}*/ command) {
		this.commandQueue.push(command)
		if (!this.isPendingFlush) {
			this.isPendingFlush = true
			Promise.resolve().then(() => this.Flush())
		}
	}

	GetCallbackId(/**@type {Function}*/ func) {
		let id = this.callbackToId.get(func)
		if (typeof id === 'undefined') {
			id = Math.random() * Number.MAX_SAFE_INTEGER
			this.callbackToId.set(func, id)
			this.idToCallback.set(id, func)
		}
		return id
	}

	UnwrapArg(/**@type {Arg}*/ arg, objectId, path) {
		switch (arg.type) {
		case Args.Primitive:
			return arg.value
		case Args.Object:
			return recycle(arg.root, arg.refs, this, objectId, path)
		default:
			throw new Error('invalid arg type')
		}
	}

	async Flush() {
		this.isPendingFlush = false
		if (!this.commandQueue.length)
			return Promise.resolve()
		const flushId = Math.random() * Number.MAX_SAFE_INTEGER
		this.commandQueue = await Promise.all(this.commandQueue.map(async (/**@type {Command}*/ command) => {
			switch (command.type) {
			case 1:
				command.argsData = await command.argsData
			case 2:
				break
			default:
				command.argsData = await Promise.all(command.argsData)
			}
			return command
		}))
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

	OnMessage(/**@type {ReceiverMessage}*/ data) {
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

	OnDone(/**@type {ReceiverMessageDone}*/ data) {
		for (const { getId, valueData } of data.results) {
			const {objectId, path, resolve} = this.pendingGetResolves.get(getId)
			if (!resolve)
				throw new Error('invalid get id')
			let val = this.UnwrapArg(valueData, objectId, path)
			this.pendingGetResolves.delete(getId)
			resolve(val)
		}
		const flushId = data.flushId
		const flushResolve = this.pendingFlushResolves.get(flushId)
		if (!flushResolve) 
			throw new Error('invalid flush id')
		this.pendingFlushResolves.delete(flushId)
		flushResolve(undefined)
	}

	OnCallback(/**@type {ReceiverMessageCallback}*/ data) {
		const resolve = this.idToCallback.get(data.id)
		if (!resolve)
			throw new Error('invalid callback id')
		let args = data.args.map(arg => this.UnwrapArg(arg))
		resolve(...args)
	}
}

globalThis.functionSymbol = Symbol()

export function fnArg(/**@type {any}*/ scope, /**@type {Function}*/ fn) {
	let ret = () => {
		return {
			func: fn.toString(),
			scope
		}
	}
	Object.defineProperty(ret, functionSymbol, { value: true, enumerable: false })
	return ret
}
