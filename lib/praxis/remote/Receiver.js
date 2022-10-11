import { CanStructuredClone, ArgType, ControllerMessageType, ReceiverMessageType, CommandType } from '../types'
import { Controller } from './Controller'
export class Receiver {
	messenger = undefined
	idMap
	nextObjectId = -1
	remoteFile
	constructor(remoteFile, Shim, ...args) {
		this.remoteFile = remoteFile
		new Shim(this, ...args)
		this.idMap = new Map()
	}
	IdToObject(id) {
		if (id == 0) {
			return require(this.remoteFile).default
		}
		const ret = this.idMap.get(id)
		return ret
	}
	ObjectToId(object) {
		const id = this.nextObjectId--
		this.idMap.set(id, object)
		return id
	}
	IdToObjectProperty(id, path) {
		const ret = this.idMap.get(id)
		if (typeof ret === 'undefined')
			throw new Error('missing object id: ' + id)
		if (ret.then) {
			console.log('is promise')
		}
		let base = ret
		for (let i = 0, len = path.length; i < len; ++i)
			base = base[path[i]]
		return base
	}
	async sanitize(obj) {
		if (CanStructuredClone(obj)) {
			return true
		}
		if (obj?.then) {
			obj = await obj
		}
		if (CanStructuredClone(obj)) {
			return true
		}
		let success = await Promise.all(Object.keys(obj).map(async (key) => {
			if (obj[key][Controller.TargetSymbol]) {
				obj[key] = obj[key][Controller.TargetSymbol]
				return true
			}
			else {
				let val = await this.sanitize(obj[key])
				return val
			}
		}))
		if (success.includes(false)) {
			return false
		}
		else {
			return true
		}
	}
	async WrapArg(arg) {
		if (CanStructuredClone(arg)) {
			return {
				type: ArgType.Primitive,
				value: arg
			}
		}
		if (arg.getId) {
			await this.sanitize(arg.obj)
			return {
				type: ArgType.Return,
				value: arg.obj,
				getId: arg.getId
			}
		}
		else {
			return {
				type: ArgType.Object,
				value: this.ObjectToId(arg)
			}
		}
	}
	GetCallbackShim(id) {
		return ((...args) => this.messenger.postMessage({
			type: ReceiverMessageType.Callback,
			id: id,
			args: args.map(arg => this.WrapArg(arg))
		}))
	}
	makeFunction(scope, func) {
		let keys = Object.keys(scope)
		let values = Object.values(scope)
		return new Function(...keys, 'return ' + func.toString())(...values)
	}
	UnwrapArg(arg) {
		switch (arg.type) {
		case ArgType.Primitive:
			return arg.value
		case ArgType.Object:
			return this.IdToObject(arg.value)
		case ArgType.Callback:
			return this.GetCallbackShim(arg.value)
		case ArgType.ObjectProperty:
			return this.IdToObjectProperty(arg.value, arg.path)
		case ArgType.Function:
			return this.makeFunction(arg.scope, arg.func)
		default:
			throw new Error('invalid arg type')
		}
	}
	async OnMessage(data) {
		switch (data.type) {
		case ControllerMessageType.Commands:
			await this.OnCommandsMessage(data)
			break
		case ControllerMessageType.Cleanup:
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
			type: ReceiverMessageType.Done,
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
		case CommandType.Call:
			this.Call(command)
			break
		case CommandType.Set:
			this.Set(command)
			break
		case CommandType.Get:
			await this.Get(command, getResults)
			break
		case CommandType.Construct:
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
		if (ret?._raw) {
			this.idMap.set(returnId, ret._raw)
		}
		else {
			this.idMap.set(returnId, ret)
		}
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
			let val = await this.WrapArg({ getId, obj })
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
		if (base[propertyName]._raw) {
			obj = base[propertyName]._raw
		}
		else {
			obj = base[propertyName]
		}
		let val = await this.WrapArg({ getId, obj })
		getResults.push({
			getId,
			valueData: val
		})
	}
}
