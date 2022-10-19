import {EntropyEntity} from '../Entity.js'
import {Room} from './Room.js'
import {Channel} from './Channel.js'
import {StoreItem} from './StoreItem.js'
/**@template T @typedef {import('./builtin/types').Owns<T>} Owns*/
/**@template T @typedef {import('./builtin/types').Unique<T>} Unique*/
export class Widget extends EntropyEntity {
	/**@type {Object}*/ config
	/**@type {string}*/ storeItemId
	/**@type {StoreItem}*/ storeItem
	/**@type {Owns<Room[]>}*/ rooms
	/**@type {Channel}*/ channel
	/**@type {string}*/ channelId
}
