import {EntropyEntity} from '../Entity.js'
import {DevItem} from './DevItem.js'
import {Domain} from './Domain.js'
import {StoreItem} from './StoreItem.js'
import * as crypto from 'crypto'
/**@template T @typedef {import('./builtin/types').Owns<T>} Owns*/
/**@template T @typedef {import('./builtin/types').Unique<T>} Unique*/
export class Developer extends EntropyEntity {
	/**@type {Unique<string>}*/ apiKey = crypto.randomUUID()
	/**@type {Domain?}*/ domain
	/**@type {Owns<DevItem[]>}*/ devItems
	/**@type {StoreItem[]}*/ storeItems
}
