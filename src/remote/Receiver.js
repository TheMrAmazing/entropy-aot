/**@typedef {import('./types').Arg} Arg*/
import { Remote } from './RemoteProxy.js'
import { recycle, WrapArg } from './WrapArg.js'
import { Args } from './TypeFuncs.js'

export class Receiver {
	messenger
	idMap
	/**@type {string}*/ remoteFile

	constructor(remoteFile, Shim, ...args) {
		this.remoteFile = remoteFile
		new Shim(this, ...args)
		this.idMap = new Map()
	}

	IdToObject(id, path = []) {
		let obj
		if (id == 0) {
			obj = require(this.remoteFile).default
		} else {
			obj = this.idMap.get(id)
		}
		path.forEach(prop => {
			obj = obj[prop]
		})
		return obj
	}

	GetCallbackShim(id) {
		return async (...args) => {
			let wrappedArgs = await Promise.all(args.map(async arg => await WrapArg(arg)))
			this.messenger.postMessage({
				type: 1, //ReceiverMessageCallback
				id: id,
				args: wrappedArgs
			})}
	}

	makeFunction(scope, func) {
		let keys = Object.keys(scope)
		let values = Object.values(scope)
		return new Function(...keys, 'return ' + func.toString())(...values)
	}

	UnwrapArg(/**@type {Arg}*/ arg) {
		switch (arg.type) {
		case Args.Primitive:
			return arg.value
		case Args.Object:
			return recycle(arg.root, arg.refs)
		case Args.Remote:
			return this.IdToObject(arg.value, arg.path)
		case Args.Function:
			return this.makeFunction(arg.scope, arg.func)
		case Args.Callback:
			return this.GetCallbackShim(arg.value)
		default:
			throw new Error('invalid arg type')
		}
	}

	async OnMessage(data) {
		switch (data.type) {
		case 1: //ControllerMessageCommands
			await this.OnCommandsMessage(data)
			break
		case 0: //ControllerMessageCleanup
			this.OnCleanupMessage(data)
			break
		default:
			console.error('Unknown message type: ' + data)
			break
		}
	}

	async OnCommandsMessage(data) {
		const getResults = []
		for (const cmd of data.commands) {
			await this.RunCommand(cmd, getResults)
		}
		this.messenger.postMessage({
			type: 0, //Done
			flushId: data.flushId,
			results: getResults
		})
	}

	OnCleanupMessage(data) {
		for (const id of data.ids)
			this.idMap.delete(id)
	}

	async RunCommand(command, getResults) {
		switch (command.type) {
		case 0: //Call
			this.Call(command)
			break
		case 1: //Set
			this.Set(command)
			break
		case 2: //Get
			await this.Get(command, getResults)
			break
		case 3: //Construct
			this.Construct(command)
			break
		default:
			throw new Error('invalid cmd type: ' + command)
		}
	}

	Call(command) {
		const { type, objectId, path, argsData, returnId } = command
		const obj = this.IdToObject(objectId)
		const args = argsData.map(arg => this.UnwrapArg(arg))
		const methodName = path[path.length - 1]
		let base = obj
		for (let i = 0, len = path.length - 1; i < len; ++i) {
			base = base[path[i]]
		}
		const ret = base[methodName](...args)
		this.idMap.set(returnId, ret)
	}

	Construct(command) {
		const { type, objectId, path, argsData, returnId } = command
		const obj = this.IdToObject(objectId)
		const args = argsData.map(arg => this.UnwrapArg(arg))
		const methodName = path[path.length - 1]
		let base = obj
		for (let i = 0, len = path.length - 1; i < len; ++i) {
			base = base[path[i]]
		}
		const ret = new base[methodName](...args)
		this.idMap.set(returnId, ret)
	}

	Set(command) {
		const { type, objectId, path, argsData } = command
		const obj = this.IdToObject(objectId)
		const value = this.UnwrapArg(argsData)
		const propertyName = path[path.length - 1]
		let base = obj
		for (let i = 0, len = path.length - 1; i < len; ++i) {
			base = base[path[i]]
		}
		base[propertyName] = value
	}
	
	async Get(command, getResults) {
		const { type, objectId, path, getId } = command
		let obj = this.IdToObject(objectId)
		if (obj?.then) {
			obj = await obj
		}
		if (path == undefined || path.length < 1) {
			let val = await WrapArg(obj)
			getResults.push({
				getId,
				valueData: val
			})
			return
		}
		const propertyName = path[path.length - 1]
		let base = obj
		for (let i = 0, len = path.length - 1; i < len; ++i) {
			base = base[path[i]]
		}
		obj = base[propertyName]
		let val = await WrapArg(obj)
		getResults.push({
			getId,
			valueData: val
		})
	}
}
