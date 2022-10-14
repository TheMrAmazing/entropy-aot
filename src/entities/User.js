import { EntropyEntity } from './Entity.js'
export class User extends EntropyEntity {
	email
	password
	name
	domainRoles
	globalRoles
	verified
	image
	domain
	domainId
	messages
}
