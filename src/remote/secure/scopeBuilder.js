import { Scope } from './entities/Scope.js'

const fun = () => {}
/**@function @template T @param {T} context @returns {import('./securedMessageTypes').ScopeBuilder<T>}*/
export function scopeBuilder(context) {
	//@ts-ignore
	return new Proxy(fun, {
		get: (target, key, receiver) => {
			let scope = new Scope()
			switch(key) {
				case 'call':
					scope.type = 0
					break
				case 'set':
					scope.type = 1
					break
				case 'get':
					scope.type = 2
					break
				case 'construct':
					scope.type = 3
					break
			}
			const nestedProxy = {
				get: (target, key, receiver) => {
					scope.path.push(key)
					return new Proxy(fun, nestedProxy)
				},
				apply: (target, thisArg, args) => {
					return scope
				}
			}
			return new Proxy(fun, nestedProxy)
		}
	})
}