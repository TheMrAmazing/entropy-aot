/**@typedef {import('./Scope.js').Scope} Scope */
/**@typedef {import('./Role.js').Role} Role*/

export class Domain {
	/**@type {Scope[]}*/ everyoneScopes = []
	/**@type {Scope[]}*/ anonScopes = []
	/**@type {Role[]}*/ roles = []
	context

	constructor(/**@type {any}*/ context) {
		this.context = context
	}
}