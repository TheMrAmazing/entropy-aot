import { CommandType, ObjectID, PathType } from "../types"
import { Controller } from "./Controller"

/**@param {Controller} controller @param {ObjectID} objectId @param {PathType} path*/
export function refProxy(controller, objectId, path) {
    return {
        get:(target:any, key: string | symbol, receiver: any) => {
            if (key === Controller.TargetSymbol)
                return target
            if(key == 'then') {
                if (target.$ref != undefined) {
                    return (resolve, reject) => {
                        const getId = Math.random() * Number.MAX_SAFE_INTEGER
                        controller.AddToQueue({
                             type: CommandType.Get,
                             objectId: objectId,
                             path: path,
                             getId: getId   
                        })
                        controller.pendingGetResolves.set(getId, {objectId: objectId, path: path, func: resolve})
                    }
                }
                return undefined
            }
            path.push(key)
            const ret = new Proxy(target[key], refProxy(controller, objectId, path))
            return ret
        }
    }
}