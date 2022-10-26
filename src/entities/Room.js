import {EntropyEntity} from './Entity.js'
import {Message} from './Message.js'
import {Widget} from './Widget.js'
/**@template T @typedef {import('./builtin/types').Owns<T>} Owns*/
export class Room extends EntropyEntity {
	/**@type {string}*/ name
	/**@type {Owns<Message[]>}*/ messages
	/**@type {string[]}*/ readScopes
	/**@type {string[]}*/ writeScopes
	/**@type {string[]}*/ deleteScopes
	/**@type {Widget}*/ widget
}
