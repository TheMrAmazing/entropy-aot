import {EntropyEntity} from './Entity.js'

/**@template T @typedef {import('./builtin/types').Owns<T>} Owns*/
/**@template T @typedef {import('./builtin/types').Unique<T>} Unique*/
export class User extends EntropyEntity {
	/**@type {string}*/ email
	/**@type {string}*/ password
	/**@type {string}*/ name
	/**@type {Role[]}*/ roles
	/**@type {boolean}*/ verified
	/**@type {string}*/ image
	/**@type {Domain}*/ domain
}
