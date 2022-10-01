import { BaseEntity } from 'lib/praxis/BaseEntity'

//@ts-ignore
class Database extends BaseEntity {
    constructor() {
        super()
    }
}
export const db = new Database()