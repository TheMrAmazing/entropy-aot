import { EntropyEntity } from './Entity'
import { GlobalRole } from './GlobalRole'
import { DomainRole } from './DomainRole'
import { Domain } from './Domain'
import { Message } from './Message'
import { Owns, Unique } from './builtin/types'

export class User extends EntropyEntity {
    email: Unique<string>
    password: string
    name: string
    domainRoles: DomainRole[]
    globalRoles: Owns<GlobalRole[]>
    verified: boolean
    image: string
    domain?: Owns<Domain>
    domainId?: string
    messages?: Message[]

    // static async emailIsAvailable(email: string): Promise<boolean> {
    //     let exists = await this.findOne({
    //         where: {
    //             email: email.toLowerCase()
    //         }
    //     })
    //     return !exists
    // }

    // static findOneByEmail(email: string): Promise<User | null>
    // static findOneByEmail(email: string, verified: boolean): Promise<User | null>
    // static findOneByEmail(email: string, verified?: boolean): Promise<User | null> {
    //     if (verified === undefined) {
    //         return this.findOne({
    //             where: {
    //                 email: email.toLowerCase()
    //             }
    //         })
    //     } else {
    //         return this.findOne({
    //             where: {
    //                 email: email.toLowerCase(),
    //                 verified
    //             }
    //         })
    //     }
    // }

    // static findOneById(id: string): Promise<User | null>
    // static findOneById(id: string, verified: boolean): Promise<User | null>
    // static findOneById(id: string, verified?: boolean): Promise<User | null> {
    //     if (verified === undefined) {
    //         return this.findOne({
    //             where: {
    //                 id
    //             }
    //         })
    //     } else {
    //         return this.findOne({
    //             where: {
    //                 id,
    //                 verified
    //             }
    //         })
    //     }
    // }

    // static createAndSave(options: CreateUserOptions): Promise<User> {
    //     return User.create({
    //         email: options.email.toLowerCase(),
    //         password: options.password,
    //         name: options.name,
    //         verified: options.verified,
    //         image: options.image,
    //         globalRoles: [],
    //         domainRoles: []
    //     }).save()
    // }
}

interface CreateUserOptions {
    email: string
    password: string
    name: string
    verified: boolean
    image: string
}

