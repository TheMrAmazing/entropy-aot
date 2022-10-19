import {Developer} from './Developer.js'
import {DevItem} from './DevItem.js'
import {EntropyEntity} from '../Entity.js'
import {Widget} from './Widget.js'
/**@template T @typedef {import('./builtin/types').Owns<T>} Owns*/
/**@template T @typedef {import('./builtin/types').Unique<T>} Unique*/
export class StoreItem extends EntropyEntity {
	/**@type {string}*/ location
	/**@type {string}*/ name
	/**@type {string}*/ description
	/**@type {Object?}*/ config
	/**@type {Developer}*/ developer
	/**@type {string}*/ developerId
	/**@type {DevItem}*/ devItem
	/**@type {Widget[]}*/ widgets

}
