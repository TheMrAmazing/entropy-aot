import { BaseEntity } from 'lib/praxis/database/BaseEntity'
//@ts-ignore
export class Database extends BaseEntity {
	constructor() {
		super()
		if (this.users == undefined) {
			this.users = []
		}
		if (this.domains == undefined) {
			this.domains = []
		}
	}
	log() {
		console.log('This is so cool! 2')
	}
}
export default new Database()
export const db = { log: () => console.log('test') }
