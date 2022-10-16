import { Controller } from './Controller.js'
export function objectProxy(controller) {
	let ret = {
		get: (target, property, receiver) => {
			if (property === Controller.ObjectSymbol)
				return target._objectId
			return controller.MakeProperty(target._objectId, [property])
		},
		set: (target, property, value, receiver) => {
			controller.AddToQueue({
				type: 1,
				objectId: target._objectId,
				path: [property],
				argsData: controller.WrapArg(value)
			})
			return true
		}
	}
	return ret
}
