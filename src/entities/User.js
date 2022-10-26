import {EntropyEntity} from './Entity.js'
import {GlobalRole} from './GlobalRole.js'
import {DomainRole} from './DomainRole.js'
import {Domain} from './Domain.js'
import {Message} from './Message.js'
/**@template T @typedef {import('./builtin/types').Owns<T>} Owns*/
/**@template T @typedef {import('./builtin/types').Unique<T>} Unique*/
export class User extends EntropyEntity {
	/**@type {Unique<string>}*/ email
	/**@type {string}*/ password
	/**@type {string}*/ name
	/**@type {DomainRole[]}*/ domainRoles
	/**@type {Owns<GlobalRole[]>}*/ globalRoles
	/**@type {boolean}*/ verified
	/**@type {string}*/ image
	/**@type {Owns<Domain>}*/ domain
	/**@type {string}*/ domainId
	/**@type {Message[]}*/ messages
}
