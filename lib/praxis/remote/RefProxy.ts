import { CommandType, ObjectID, PathType } from "../types"
import { Controller } from "./Controller"

export function refProxy(controller: Controller, objectId: ObjectID, path:PathType) {
    return {
        get:(target:any, property: string | symbol, receiver: any) => {
            if(property == 'then') {
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
            path.push(property)
            const ret = new Proxy(target[property], refProxy(controller, objectId, path))
            return ret
        }
    }
}