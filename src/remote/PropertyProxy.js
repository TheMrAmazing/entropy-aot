import { Controller } from './Controller.js'
export function propertyProxy(controller) {
	let ret = {
		get: (target, key, receiver) => {
			if (key === Controller.TargetSymbol)
				return target
			const nextPath = target._path.slice(0)
			nextPath.push(key)
			const ret = controller.MakeProperty(target._objectId, nextPath)
			return ret
		},
		set: (target, property, value, receiver) => {
			const nextPath = target._path.slice()
			nextPath.push(property)
			if (value[Controller.TargetSymbol]) {
				// value = value[controller.TargetSymbol]
			}
			else {
				Reflect.ownKeys(value).forEach(key => {
					if (value[key][Controller.TargetSymbol]) {
						value[key] = value[key][Controller.TargetSymbol]
					}
				})
			}
			if (value)
				controller.AddToQueue({
					type: 1,
					objectId: target._objectId,
					path: nextPath,
					argsData: controller.WrapArg(value)
				})
			return true
		},
		apply: (target, thisArg, argumentsList) => {
			if (target._path[target._path.length - 1] == 'then') {
				if (target) {
					target._path.pop()
					const getId = Math.random() * Number.MAX_SAFE_INTEGER
					controller.AddToQueue({
						type: 2,
						objectId: target._objectId,
						path: target._path,
						getId: getId
					})
					controller.pendingGetResolves.set(getId, { objectId: target._objectId, path: target._path, func: argumentsList[0] })
					return undefined
				}
			}
			const returnObjectId = Math.random() * Number.MAX_SAFE_INTEGER
			controller.AddToQueue({
				type: 0,
				objectId: target._objectId,
				path: target._path,
				argsData: argumentsList.map(arg => controller.WrapArg(arg)),
				returnId: returnObjectId
			})
			return controller.MakeObject(returnObjectId)
		},
		construct: (target, argumentsList, newTarget) => {
			const returnObjectId = Math.random() * Number.MAX_SAFE_INTEGER
			controller.AddToQueue({
				type: 3,
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
