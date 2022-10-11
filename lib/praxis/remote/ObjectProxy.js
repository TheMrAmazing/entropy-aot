import { CommandType } from '../types'
import { Controller } from './Controller'
export function objectProxy(controller) {
	let ret = {
		get: (target, property, receiver) => {
			if (property === Controller.ObjectSymbol)
				return target._objectId
			return controller.MakeProperty(target._objectId, [property])
		},
		set: (target, property, value, receiver) => {
			controller.AddToQueue({
				type: CommandType.Set,
				objectId: target._objectId,
				path: [property],
				argsData: controller.WrapArg(value)
			})
			return true
		}
	}
	return ret
}
