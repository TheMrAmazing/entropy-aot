import {Role} from './Role.js'
import {Domain} from './Domain.js'
import {User} from './User.js'
/**@template T @typedef {import('./builtin/types').Cascade<T>} Cascade*/
export class DomainRole extends Role {
	/**@type {string?}*/ domainId
	/**@type {Domain}*/ domain
	/**@type {Cascade<User[]>}*/ users
	/**@type {string[]?}*/ userIds
	/**@type {DomainRole[]}*/ canAssign
	/**@type {string[]}*/ domainRoleIds

}
