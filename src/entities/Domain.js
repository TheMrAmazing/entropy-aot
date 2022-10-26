import { EntropyEntity } from './Entity.js'
import { DomainRole } from './DomainRole.js'
import { User } from './User.js'
import { Developer } from './Developer.js'
import { Channel } from './Channel.js'
/**@template T @typedef {import('./builtin/types').Owns<T>} Owns*/
/**@template T @typedef {import('./builtin/types').Unique<T>} Unique*/
export class Domain extends EntropyEntity {
	/**@type {Unique<string>}*/ handle
	/**@type {string?}*/ developerId
	/**@type {Developer?}*/ developer
	/**@type {string?}*/ channelId
	/**@type {Owns<Channel>?}*/ channel
	/**@type {string[]?}*/ everyoneScopes
	/**@type {string[]?}*/ anonScopes
	/**@type {Owns<DomainRole[]>}*/ roles
	/**@type {User}*/ user
}
