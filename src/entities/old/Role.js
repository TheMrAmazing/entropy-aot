import {EntropyEntity} from '../Entity.js'
export class Role extends EntropyEntity {
	/**@type {string[]}*/ allows
	/**@type {string[]}*/ blocks
	/**@type {number}*/ rank
	/**@type {string}*/ name
	/**@type {string?}*/ graphic
}
