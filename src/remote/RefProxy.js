/**@typedef {import('./types').Command} Command*/
import { Controller } from './Controller.js'
/**@param {Controller} controller @param {number} objectId @param {string[]} path*/
export function refProxy(controller, objectId, path) {
	return {
		get: (target, key, receiver) => {
			if (key === Controller.TargetSymbol)
				return target
			if (key == 'then') {
				if (target.$ref != undefined) {
					return (resolve, reject) => {
						const getId = Math.random() * Number.MAX_SAFE_INTEGER
						controller.AddToQueue({
							type: 2,
							objectId: objectId,
							path: path,
							getId: getId
						})
						controller.pendingGetResolves.set(getId, { objectId: objectId, path: path, func: resolve })
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
