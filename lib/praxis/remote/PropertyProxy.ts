import { CommandType, RemoteProperty } from "../types"
import { Controller } from "./Controller"

export function propertyProxy<T extends RemoteProperty>(controller: Controller) {
    let ret: ProxyHandler<T> = {
        get:(target:T, property: string | symbol, receiver: any) => {
            if (property === controller.TargetSymbol)
                return target

            const nextPath = target._path.slice(0)
            nextPath.push(property)
            const ret = controller.MakeProperty(target._objectId, nextPath)
            return ret
        },
        set: (target: T, property: string | symbol, value: any, receiver: any) => {
            const nextPath = target._path.slice()
            nextPath.push(property)
            controller.AddToQueue({
                type: CommandType.Set,
                objectId: target._objectId,
                path: nextPath,
                argsData: controller.WrapArg(value)
            })
            return true
        },
        apply: (target: T, thisArg, argumentsList: any[]) => {
            if(target._path[target._path.length - 1] == 'then') {
                if (target) {
                    target._path.pop()
                    const getId = Math.random() * Number.MAX_SAFE_INTEGER
        
                    controller.AddToQueue({
                         type: CommandType.Get,
                         objectId: target._objectId,
                         path: target._path,
                         getId: getId   
                    })
                    controller.pendingGetResolves.set(getId, {objectId: target._objectId, path: target._path, func: argumentsList[0]})
                    return undefined
                }
            }
            const returnObjectId = Math.random() * Number.MAX_SAFE_INTEGER
            controller.AddToQueue({
                type: CommandType.Call,
                objectId: target._objectId,
                path: target._path,
                argsData: argumentsList.map(arg => controller.WrapArg(arg)),
                returnId: returnObjectId
            })
            return controller.MakeObject(returnObjectId)
        },
        construct: (target: T, argumentsList: any[], newTarget) => {
            const returnObjectId = Math.random() * Number.MAX_SAFE_INTEGER
            controller.AddToQueue({
                type: CommandType.Construct,
                objectId: target._objectId,
                path: target._path,
                argsData: argumentsList.map(arg => controller.WrapArg(arg)),
                returnId: returnObjectId
            })
            return controller.MakeObject(returnObjectId)
        }
    }
    return ret
}