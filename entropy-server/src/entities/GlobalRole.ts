import { Role } from './Role'
import { User } from './User'

export class GlobalRole extends Role {
    users: User[]
}