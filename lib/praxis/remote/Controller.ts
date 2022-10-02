import {PathType, Primitive, ObjectID, CanStructuredClone, CallbackID, Command, GetID, FlushID, ControllerMessage, Arg, ArgType, ControllerMessageType, ReceiverMessage, ReceiverMessageType, ReceiverMessageDone, ReceiverMessageCallback, CommandType, RemoteProperty, RemoteObject} from '../types'
import { objectProxy } from './ObjectProxy'
import { propertyProxy } from './PropertyProxy'
import { refProxy } from './RefProxy'

type Messenger = {
    postMessage(message: ControllerMessage): void
}

type ResolveFunc = (value: unknown) => void
type Resolve = {
    func: (value: unknown) => void,
    objectId: ObjectID,
    path: PathType,
}

export class Controller {
    commandQueue: Command[] = []

    finalizationRegistry: FinalizationRegistry<ObjectID>
    finalizeIntervalMs: number = 10
    finalizeIdQueue: ObjectID[]
    finalizeTimerId: NodeJS.Timeout | undefined
    
    nextGetId: GetID = 0
    nextFlushId: FlushID = 0
    nextCallbackId: CallbackID = 0
    
    callbackToId: Map<Function, CallbackID> = new Map()
    idToCallback: Map<CallbackID, Function> = new Map()

    pendingGetResolves: Map<GetID, Resolve | ResolveFunc> = new Map()
	pendingFlushResolves: Map<FlushID, ResolveFunc> = new Map()
    isPendingFlush: boolean = false

    ObjectSymbol = Symbol()
    TargetSymbol = Symbol()

    Messenger: Messenger

    Remote: any = this.MakeObject(0)

    AddToQueue(command: Command){
		this.commandQueue.push(command)
		if (!this.isPendingFlush) {
			this.isPendingFlush = true;
			Promise.resolve().then(() => this.Flush())
		}
	}

    GetCallbackId(func: Function) {
		let id = this.callbackToId.get(func)
		if (typeof id === "undefined") {
			id = this.nextCallbackId++
			this.callbackToId.set(func, id);
			this.idToCallback.set(id, func);
		}
		
		return id;
	}

    WrapArg(arg: any): Arg {
		if (typeof arg === "function") {
			const objectId = arg[this.ObjectSymbol]
			if (typeof objectId === "number") {
				return {
                    type: ArgType.Object,
                    value: objectId
                }
			}
			const propertyTarget = arg[this.TargetSymbol]
			if (propertyTarget) {
				return {
                    type: ArgType.ObjectProperty,
                    value: propertyTarget._objectId,
                    path: propertyTarget._path
                }
			}
			return {
                type: ArgType.Callback,
                value: this.GetCallbackId(arg)
            }
		}
		else if (CanStructuredClone(arg)) {
			return {
                type: ArgType.Primitive,
                value: arg as Primitive
            }
		}
		else
			throw new Error("invalid argument")
	}
	
	UnwrapArg(arg: Arg) {
		switch (arg.type)	{
		case ArgType.Primitive:
			return arg.value
		case ArgType.Object:
			return this.MakeObject(arg.value)
		default:
			throw new Error("invalid arg type");
		}
	}

    Flush() {
		this.isPendingFlush = false
		
		if (!this.commandQueue.length)
			return Promise.resolve()
		
		const flushId = this.nextFlushId++
		
        this.Messenger.postMessage({
            type: ControllerMessageType.Commands,
            commands: this.commandQueue,
            flushId: flushId
        })
		
		this.commandQueue.length = 0;
		
		return new Promise(resolve => {
			this.pendingFlushResolves.set(flushId, resolve);
		})
	}

    OnMessage(data: ReceiverMessage) {
		switch (data.type) {
		    case ReceiverMessageType.Done:
			    this.OnDone(data)
			    break
		    case ReceiverMessageType.Callback:
			    this.OnCallback(data)
			    break
		    default:
			    throw new Error("invalid message type: " + data)
		}
	}
    
    OnDone(data: ReceiverMessageDone)	{
		for (const {getId, valueData} of data.results) {
			const resolve = this.pendingGetResolves.get(getId) as Resolve
			if (!resolve)
				throw new Error("invalid get id")
			
			this.pendingGetResolves.delete(getId)
            let val = this.UnwrapArg(valueData) as any
            Reflect.ownKeys(val).forEach(key => {
                if(val[key].$ref != undefined) {
                    val[key] = new Proxy(val[key], refProxy(this, resolve.objectId,[...resolve.path, key] ))
                }
            })
			resolve.func(val)
		}
		
		const flushId = data.flushId
		const flushResolve = this.pendingFlushResolves.get(flushId);
		if (!flushResolve)
			throw new Error("invalid flush id");
		
		this.pendingFlushResolves.delete(flushId)
		flushResolve(undefined)
	}
	
	OnCallback(data: ReceiverMessageCallback)	{
		const func = this.idToCallback.get(data.id)
		if (!func)
			throw new Error("invalid callback id")
		
		const args = data.args.map(arg => this.UnwrapArg(arg))
		func(...args)
	}

    MakeObject(id: ObjectID) {
		const func = function() {};
		func._objectId = id;
		const ret = new Proxy(func, objectProxy(this))
        if (this.finalizationRegistry)
            this.finalizationRegistry.register(ret, id);
        return ret
    }

    MakeProperty(objectId: ObjectID, path: PathType) {
        const func = function () {}
		func._objectId = objectId
		func._path = path
		func._nextCache = new Map()
		return new Proxy(func, propertyProxy(this))
    }

    AddGet(objectId, path) {
		const getId = this.nextGetId++
		
		this.AddToQueue({
             type: CommandType.Get,
             objectId: objectId,
             path: path,
             getId: getId   
        })
		
		return new Promise(resolve => {
			this.pendingGetResolves.set(getId, resolve)
		})
	}
}

