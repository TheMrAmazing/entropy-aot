import {PathType, Primitive, ObjectID, CanStructuredClone, CallbackID, Command, GetID, FlushID, ControllerMessage, Arg, ArgType, ControllerMessageType, ReceiverMessage, ReceiverMessageType, ReceiverMessageDone, ReceiverMessageCallback, CommandType} from './types'

type Messenger = {
    postMessage(message: ControllerMessage): void
}

type ResolveFunc = (value: unknown) => void
type Resolve = {
    func: (value: unknown) => void,
    objectId: ObjectID,
    path: PathType,
}

class RemoteObject {
    _objectId: ObjectID

    constructor(objectId: ObjectID) {
        this._objectId = objectId
    }
}

class RemoteProperty extends RemoteObject{
    _path: PathType
    constructor(objectId: ObjectID, path: PathType) {
        super(objectId)
        this._path = path
    }
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
    refProxy(objectId: ObjectID, path:PathType) {

        return {
            get:(target:any, property: string | symbol, receiver: any) => {
                if(property == 'then') {
                    if (target.$ref != undefined) {
                        return (resolve, reject) => {
                            const getId = Math.random() * Number.MAX_SAFE_INTEGER
                            this.AddToQueue({
                                 type: CommandType.Get,
                                 objectId: objectId,
                                 path: path,
                                 getId: getId   
                            })
                            this.pendingGetResolves.set(getId, {objectId: objectId, path: path, func: resolve})
                        }
                    }
                    return undefined
                }
                path.push(property)
                const ret = new Proxy(target[property], this.refProxy(objectId, path))
                return ret
            }
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
                    val[key] = new Proxy(val[key], this.refProxy(resolve.objectId,[...resolve.path, key] ))
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
		const ret = new Proxy(func, this.objectHandler())
        if (this.finalizationRegistry)
            this.finalizationRegistry.register(ret, id);
        return ret
    }

    MakeProperty(objectId: ObjectID, path: PathType) {
        const func = function () {}
		func._objectId = objectId
		func._path = path
		func._nextCache = new Map()
		return new Proxy(func, this.propertyHandler())
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

    get(proxy: any) {
        if (typeof proxy === "function") {
            const objectId = proxy[this.ObjectSymbol]
            if(objectId === "number") {
                return this.AddGet(objectId, null)
            }
            const target = proxy[this.TargetSymbol]
            if (target) {
                return this.AddGet(target._objectId, target._path)
            }
        }
        return Promise.resolve(proxy)
    }
    
    propertyHandler<T extends RemoteProperty>() {
        let ret: ProxyHandler<T> = {
            get:(target:T, property: string | symbol, receiver: any) => {
                if (property === this.TargetSymbol)
                    return target
    
                const nextPath = target._path.slice(0)
                nextPath.push(property)
                const ret = this.MakeProperty(target._objectId, nextPath)
                return ret
            },
            set: (target: T, property: string | symbol, value: any, receiver: any) => {
                const nextPath = target._path.slice()
                nextPath.push(property)
                this.AddToQueue({
                    type: CommandType.Set,
                    objectId: target._objectId,
                    path: nextPath,
                    argsData: this.WrapArg(value)
                })
                return true
            },
            apply: (target: T, thisArg, argumentsList: any[]) => {
                if(target._path[target._path.length - 1] == 'then') {
                    if (target) {
                        target._path.pop()
                        const getId = Math.random() * Number.MAX_SAFE_INTEGER
            
                        this.AddToQueue({
                             type: CommandType.Get,
                             objectId: target._objectId,
                             path: target._path,
                             getId: getId   
                        })
                        this.pendingGetResolves.set(getId, {objectId: target._objectId, path: target._path, func: argumentsList[0]})
                        return undefined
                    }
                }
                const returnObjectId = Math.random() * Number.MAX_SAFE_INTEGER
                this.AddToQueue({
                    type: CommandType.Call,
                    objectId: target._objectId,
                    path: target._path,
                    argsData: argumentsList.map(arg => this.WrapArg(arg)),
                    returnId: returnObjectId
                })
                return this.MakeObject(returnObjectId)
            },
            construct: (target: T, argumentsList: any[], newTarget) => {
                const returnObjectId = Math.random() * Number.MAX_SAFE_INTEGER
                this.AddToQueue({
                    type: CommandType.Construct,
                    objectId: target._objectId,
                    path: target._path,
                    argsData: argumentsList.map(arg => this.WrapArg(arg)),
                    returnId: returnObjectId
                })
                return this.MakeObject(returnObjectId)
            }
        }
        return ret
    }
    
    objectHandler<T extends RemoteObject>() {
        let ret: ProxyHandler<T> = {
            get: (target: T, property: string | symbol, receiver) => {
                if (property === this.ObjectSymbol)
                    return target._objectId
                
                return this.MakeProperty(target._objectId, [property])
            },
            
            set: (target: T, property, value, receiver) => {
                this.AddToQueue({
                    type: CommandType.Set,
                    objectId: target._objectId,
                    path:[property],
                    argsData: this.WrapArg(value)
                })
                return true;
            }
        }
        return ret
    }
}

