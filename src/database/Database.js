import { Domain } from '../entities/Domain.js'
import { User } from '../entities/User.js'
import { BaseEntity } from './BaseEntity.js'
//@ts-ignore
export class Database extends BaseEntity {
	/**@type {User[]}*/ users
	/**@type {Domain[]}*/ domains
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
let admin = {
	email: 'test1',
	myNum: 23,
	password: 'test2',
	roles: [{
		name: 'role1',
		innerNum: 25,
		lastname: 'lastRole',
		innerArray: [1, 2, 3, 4],
		innerObject: {
			prop1: 'inside prop1',
			prop2: 'inside prop2'
		},
		innerBool: false
	 }, {
		name: 'role2',
		innerStringArray: ['fee', 'fi', 'fo', 'fum', 'I', 'smell', 'the', 'blood', 'of', 'an', 'Englishman']
	}, {
		name: 'role3',
		innerBoolArray: [true, false, true, true, false, true, false, false, false, false],
		innerUndefinedArray: [undefined, undefined, undefined, undefined, undefined],
		innerUndefinedProp: undefined
	}],
	verified: true
}
//@ts-ignore
db.users.push(admin)
export default db
