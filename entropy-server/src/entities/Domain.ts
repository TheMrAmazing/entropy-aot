import { EntropyEntity } from './Entity'
import { DomainRole } from './DomainRole'
import { User } from './User'
import { Developer } from './Developer'
import { Channel } from './Channel'
import { Unique, Owns } from './builtin/types'

export class Domain extends EntropyEntity {

    handle: Unique<string>
    developerId?: string
    developer?: Owns<Developer>
    channelId?: string
    channel?: Owns<Channel>
    everyoneScopes?: string[]
    anonScopes?: string[]
    roles: Owns<DomainRole[]>
    user: User

    constructor() {
        super()
    }

    // static async default(options: Domain): Promise<Domain> {
    //     let domain = options
    //     let roles = await Promise.all([
    //         DomainRole.create({
    //             domain: domain,
    //             name: 'Streamer',
    //             allows: Scopes.OWNER_SCOPES,
    //             blocks: [],
    //             users: [domain.user],
    //             rank: 999
    //         }),
    //         DomainRole.create({
    //             domain: domain,
    //             name: 'Moderator',
    //             allows: Scopes.MODERATOR_SCOPES,
    //             blocks: [],
    //             users: [],
    //             rank: 1
    //         }),
    //         DomainRole.create({
    //             domain: domain,
    //             name: 'Banned',
    //             allows: [],
    //             blocks: Scopes.BANNED_BLOCKED_SCOPES,
    //             users: [],
    //             rank: 0
    //         })
    //     ].map(role => role.save()))
    //     domain.roles = roles
    //     domain.anonScopes = Scopes.ANON_SCOPES
    //     domain.everyoneScopes = Scopes.EVERYONE_SCOPES
    //     domain.save()
    //     // let streamerRole = domain.roles.find(role => role.name == 'Streamer')
    //     // streamerRole?.users.push()
    //     // streamerRole?.save()
    //     return domain
    // }

    // static handleHandler<T extends EntropyEntity>(this: (new () => T) & typeof EntropyEntity) {
    //     return async (req: Request, res: Response, next: NextFunction) => {
    //         try {
    //             let handle = req.params.handle
    //             let domain = await Domain.findOneAndCache({
    //                 where: {
    //                     handle
    //                 }
    //             })
    //             if (domain) {
    //                 if(!req.target) {
    //                     req.target = {}
    //                 }
    //                 req.target.domain = domain
    //                 next()
    //             } else {
    //                 next(EntropyErrors.NotFound)
    //             }

    //         } catch (error) {
    //             next(error)
    //         }
    //     }
    // }
}
