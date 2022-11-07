import { Channel } from '../entities/Channel.js'
import { Developer } from '../entities/Developer.js'
import { Domain } from '../entities/Domain.js'
import { User } from '../entities/User.js'
import { BaseEntity } from './BaseEntity.js'

const userCons = User
const domainCons = Domain
const channelCons = Channel
const developerCons = Developer
//@ts-ignore
export class Database extends BaseEntity {
	User = userCons
	Domain = domainCons
	Channel = channelCons
	Developer = developerCons
	
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
export default db
