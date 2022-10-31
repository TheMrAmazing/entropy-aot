import { Domain } from '../../entities/Domain.js'
import { User } from '../../entities/User.js'
import { BaseEntity } from '../../database/BaseEntity.js'
//@ts-ignore
export class tdb extends BaseEntity {
	/**@type {User[]}*/ users
	/**@type {Domain[]}*/ domains
	constructor() {
		super(process.env.folder)
		if (this.users == undefined) {
			this.users = []
		}
		if (this.domains == undefined) {
			this.domains = []
		}
	}
}
let db = new tdb()
export default db
