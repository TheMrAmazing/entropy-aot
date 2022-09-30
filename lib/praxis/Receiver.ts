import {PathType, MessageShim, Messenger, Primitive, ObjectID, CanStructuredClone, Result, CallbackID, Command, GetID, FlushID, ControllerMessage, Arg, ArgType, ControllerMessageType, ReceiverMessage, ReceiverMessageType, ReceiverMessageDone, ReceiverMessageCallback, CommandType, ControllerMessageCommands, ControllerMessageCleanup, CommandCall, CommandConstruct, CommandSet, CommandGet} from './types'

export class Receiver {

    Messenger: Messenger = undefined
    idMap: Map<ObjectID, any>
    nextObjectId: ObjectID = -1
    
    constructor (remote: any, Shim: MessageShim, ...args: any[]) {
        new Shim(this, ...args)
        this.idMap = new Map([[0, remote]])
    }

    IdToObject(id: ObjectID) {
        const ret = this.idMap.get(id)
        if (typeof ret === "undefined")
            throw new Error("missing object id: " + id)
        return ret
    }

    ObjectToId(object: any) {
        const id = this.nextObjectId--
        this.idMap.set(id, object)
        return id
    }

    IdToObjectProperty(id: ObjectID, path: PathType) {
        const ret = this.idMap.get(id);
        if (typeof ret === 'undefined')
            throw new Error("missing object id: " + id)
        
        let base = ret
        for (let i = 0, len = path.length; i < len; ++i)
            base = base[path[i]]

        return base
    }

    WrapArg(arg: any): Arg {
        if (CanStructuredClone(arg)) {
            return {
                type: ArgType.Primitive,
                value: arg    
            }
        }
        else {
            return {
                type: ArgType.Object,
                value: this.ObjectToId(arg)
            }
        }
    }

    GetCallbackShim(id: CallbackID) {
        return ((...args) => this.Messenger!.postMessage({
            type: ReceiverMessageType.Callback,
            id: id,
            args: args.map(arg => this.WrapArg(arg))
        }))
    }

    UnwrapArg(arg: Arg) {
        switch (arg.type)	{
        case ArgType.Primitive:
            return arg.value;
        case ArgType.Object:
            return this.IdToObject(arg.value)
        case ArgType.Callback:
            return this.GetCallbackShim(arg.value)
        case ArgType.ObjectProperty:
            return this.IdToObjectProperty(arg.value, arg.path)
        default:
            throw new Error("invalid arg type")
        }
    }

    OnMessage(data: ControllerMessage) {
        switch (data.type) {
        case ControllerMessageType.Commands:
            this.OnCommandsMessage(data)
            break
        case ControllerMessageType.Cleanup:
            this.OnCleanupMessage(data)
            break
        default:
            console.error("Unknown message type: " + data)
            break
        }
    }

    OnCommandsMessage(data: ControllerMessageCommands) {
        const getResults: any[] = []
        for (const cmd of data.commands) {
            this.RunCommand(cmd, getResults)
        }

        this.Messenger!.postMessage({
            type: ReceiverMessageType.Done,
            flushId: data.flushId,
            results: getResults
        })
    }
    
    OnCleanupMessage(data: ControllerMessageCleanup) {
        for (const id of data.ids)
            this.idMap.delete(id);
    }

    RunCommand(command: Command, getResults: Result[]) {
        switch (command.type) {
            case CommandType.Call:
                this.Call(command)
                break
            case CommandType.Set:
                this.Set(command)
                break
            case CommandType.Get:
                this.Get(command, getResults)
                break
            case CommandType.Construct:
                this.Construct(command)
                break
            default:
                throw new Error("invalid cmd type: " + command)
        }
    }

    Call(command: CommandCall) {
        const { type, objectId, path, argsData, returnId} = command
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

    Construct(command: CommandConstruct) {
        const { type, objectId, path, argsData, returnId} = command
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

    Set(command: CommandSet) {
        const { type, objectId, path, argsData} = command
        const obj = this.IdToObject(objectId)
        const value = this.UnwrapArg(argsData)
        const propertyName = path[path.length - 1]
        
        let base = obj
        
        for (let i = 0, len = path.length - 1; i < len; ++i) {
            base = base[path[i]]
        }
        
        base[propertyName] = value
    }

    Get(command: CommandGet, getResults: Result[]) {
        const { type, objectId, path, getId } = command
        const obj = this.IdToObject(objectId)

        if (path == undefined || path.length < 1) {
            getResults.push({
                getId,
                valueData: this.WrapArg(obj)
            })
            return
        }
        
        const propertyName = path[path.length - 1]
        
        let base = obj
        
        for (let i = 0, len = path.length - 1; i < len; ++i) {
            base = base[path[i]]
        }
        let value
        if(base[propertyName]._raw) {
            value = base[propertyName]._raw
        } else {
            value = base[propertyName]
        }
        getResults.push({
            getId,
            valueData: this.WrapArg(value)
        })
    }
}