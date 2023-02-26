/**@typedef {import('./User.js').User} User*/
/**@typedef {import('./Scope.js').Scope} Scope */

export class Role {
	/**@type {Scope[]}*/ allows
	/**@type {Scope[]}*/ blocks
	/**@type {number}*/ rank
	/**@type {string}*/ name
	/**@type {User[]}*/ users
	/**@type {Role[]}*/ canAssign
}