import { BaseEntity } from './BaseEntity.js'
//@ts-ignore
export class Database extends BaseEntity {
	
	constructor() {
		super(process.cwd() + '/json/')
		if (this.users == undefined) {
			this.users = []
		}
		if (this.domains == undefined) {
			this.domains = []
		}
	}
}
let db = new Database()
export default db
