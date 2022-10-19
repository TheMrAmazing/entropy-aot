import * as crypto from 'crypto'
export class EntropyEntity {
	id = crypto.randomUUID()
	createdAt = new Date()
	updatedAt = new Date()
}
