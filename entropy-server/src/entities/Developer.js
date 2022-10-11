import { EntropyEntity } from './Entity'
import * as crypto from 'crypto'
export class Developer extends EntropyEntity {
	apiKey = crypto.randomUUID()
	domain
	devItems
	storeItems
	constructor() {
		super()
	}
}
