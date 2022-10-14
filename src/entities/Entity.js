import * as crypto from 'crypto'
//@ts-ignore
export class EntropyEntity {
	id = crypto.randomUUID()
	createdAt = new Date()
	updatedAt = new Date()
	constructor() {
	}
}
