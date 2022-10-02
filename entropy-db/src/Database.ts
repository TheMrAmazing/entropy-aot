import { BaseEntity } from 'lib/praxis/database/BaseEntity'

//@ts-ignore
class Database extends BaseEntity {
    counter: number = 0
    constructor() {
        super()
    }
    add() {
        return ++this.counter
    }
}
export const db = new Database()