import { EntropyEntity } from './Entity'
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
