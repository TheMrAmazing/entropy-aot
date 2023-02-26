import { ControllerMessage } from "../types.js"
import { Scope } from "./entities/Scope.js"

export interface SecuredControllerMessageCommands {
	user: string
	msg: ControllerMessage
}

type ScopeObject<T, K> = {
	[key in keyof Exclude<T, undefined> as T[key] extends Array<P>
		? key
		: T[key] extends Function
			? T[key] extends new(...args: any[]) => any
				? K extends 'constructor'
					? key
					: never
				: K extends 'function'
					? key
					: never
			: T[key] extends object
				? key
				: K extends 'primitive'
					? key
					: never
	]: ScopeObject<T[key], K>
} & {(): Scope}

export type ScopeBuilder<T> = {
	call: ScopeObject<T, 'function'>,
	set: ScopeObject<T, 'primitive'>,
	get: ScopeObject<T, 'primitive'>,
	construct: ScopeObject<T, 'constructor'>
}