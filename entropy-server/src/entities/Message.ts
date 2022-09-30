import { Room } from './Room'
import { EntropyEntity } from './Entity'
import { User } from './User'

export class Message extends EntropyEntity {
    room: Room
    user: User
    userId: string
    roomId: string
    data: Object
}