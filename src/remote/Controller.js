/**@typedef {import('./types').Arg} Arg*/
/**@typedef {import('./types').Command} Command*/
/**@typedef {import('./types').ReceiverMessageDone} ReceiverMessageDone*/
/**@typedef {import('./types').ReceiverMessageCallback} ReceiverMessageCallback*/
/**@typedef {import('./types').ReceiverMessage} ReceiverMessage*/
/**@typedef {import('./types').Resolve} Resolve*/
/**@typedef {import('./shims/Shim.js').Shim} Shim*/
import { Remote } from './RemoteProxy.js'
import { UnwrapArg} from './WrapArg.js'

export class Controller {
	constructor(/**@type {Shim}*/ shim) {
		this.messenger = shim
		shim.remoter = this
	}

	/**@type {Command[]}*/ commandQueue = []
	/**@type {Map<Function, number>}*/ callbackToId = new Map()
	/**@type {Map<number, Function>}*/ idToCallback = new Map()
	/**@type {Map<number, Resolve>}*/ pendingGetResolves = new Map()
	/**@type {Map<number, Function>}*/ pendingFlushResolves = new Map()
	/**@type {'Controller'}*/ remoterType = 'Controller'
	isPendingFlush = false
	/**@type {Shim}*/ messenger
	finalizeTimerId = -1
	finalizeIntervalMs = 10
	/**@type {number[]}*/ finalizeIdQueue = []

	finalizationRegistry = new FinalizationRegistry((/**@type {number}*/ id) => {
		this.finalizeIdQueue.push(id)
		if (this.finalizeTimerId === -1) {
			this.finalizeTimerId = 1
			//@ts-ignore
			setTimeout(() => {
				this.finalizeTimerId = -1
				this.messenger.postMessage({
					type: 0,
					ids: this.finalizeIdQueue	
				})
				this.finalizeIdQueue = []
			}, this.finalizeIntervalMs)
		}
	})

	/**@type {import('./types').RemoteRoot<any>}*/ remote = new Remote(this, 0)

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

	async Flush() {
		let currentCommands = this.commandQueue
		this.commandQueue = []
		this.isPendingFlush = false
		if (!currentCommands.length)
			return Promise.resolve()
		const flushId = Math.random() * Number.MAX_SAFE_INTEGER
		currentCommands = await Promise.all(currentCommands.map(async (/**@type {Command}*/ command) => {
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
			commands: currentCommands,
			flushId: flushId
		})
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
			let val = UnwrapArg(valueData.root, valueData.refs, this)
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
		let args = data.args.map((/**@type {Arg}*/ arg) => UnwrapArg(arg.root, arg.refs, this))
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
