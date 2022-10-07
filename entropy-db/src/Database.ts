import { BaseEntity } from 'lib/praxis/database/BaseEntity'
import { User, Domain } from '../../entropy-server/src/entities'

//@ts-ignore
export class Database extends BaseEntity {
    declare public users: User[]
    declare public domains: Domain[]
    constructor() {
        super()
        if(this.users == undefined) {
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
export const db = new Database()