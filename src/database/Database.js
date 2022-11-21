import { Channel } from '../entities/Channel.js'
import { Developer } from '../entities/Developer.js'
import { Domain } from '../entities/Domain.js'
import { User } from '../entities/User.js'
import { BaseEntity } from './BaseEntity.js'

const userCons = User
const domainCons = Domain
const channelCons = Channel
const developerCons = Developer

export class Database extends BaseEntity {
	User = userCons
	Domain = domainCons
	Channel = channelCons
	Developer = developerCons
	
	constructor() {
		super(process.cwd() + '/json/')
		if (this.users == undefined) {
			/**@type {User[]}*/ this.users = []
		}
		if (this.domains == undefined) {
			/**@type {Domain[]}*/ this.domains = []
		}
	}
}
let db = new Database()
export default db
