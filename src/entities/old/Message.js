import {EntropyEntity} from '../Entity.js'
import {Room} from './Room.js'
import {User} from './User.js'
export class Message extends EntropyEntity {
	/**@type {Room}*/ room
	/**@type {User}*/ user
	/**@type {string}*/ userId
	/**@type {string}*/ roomId
	/**@type {Object}*/ data
}
