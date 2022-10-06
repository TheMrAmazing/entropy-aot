import { CommandType, RemoteObject } from "../types";
import { Controller } from "./Controller";

export function objectProxy<T extends RemoteObject>(controller: Controller) {
    let ret: ProxyHandler<T> = {
        get: (target: T, property: string | symbol, receiver) => {
            if (property === Controller.ObjectSymbol)
                return target._objectId
            
            return controller.MakeProperty(target._objectId, [property])
        },
        
        set: (target: T, property, value, receiver) => {
            controller.AddToQueue({
                type: CommandType.Set,
                objectId: target._objectId,
                path:[property],
                argsData: controller.WrapArg(value)
            })
            return true;
        }
    }
    return ret
}