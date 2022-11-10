import { fnArg } from './remote/Controller.js'
import { hash } from './database/utils.js'
import * as crypto from 'crypto'
import { User } from './entities/User'
import { Domain } from './entities/Domain.js'
import {FileUpdate} from './dev/reload'
import { Channel } from './entities/Channel.js'
import { Developer } from './entities/Developer.js'
import { connection } from './server.js'
/**@typedef {import('./entities/Role').Role} Role*/
/**@typedef {import('./entities/builtin/types').ClassNode} ClassNode*/

const idMap = new Map()
const db = connection.db

function getUser(/**@type {string}*/ sess) {
	let id = idMap.get(sess)
	return db.users.find(fnArg({ id }, val => val.id == id))
}

function getDomain(/**@type {string}*/ handle) {
	return db.domains.find(fnArg({ handle }, val => val.handle == handle.toLowerCase()))
}

export class API {
	async postUser(req) {
		if (await db.users.find(val => val.email == req.email)) {
			return 'Error: Email already exists'
		}
		else {
			let user = new User()
			user.email = req.email
			user.password = hash(req.password)
			user.image = req.image
			user.name = req.name
			let test = db.users
			db.users.push(user)
			return user
		}
	}
	async me(/**@type {string}*/ sess) {
		let id = idMap.get(sess)
		let user = await db.users.find(fnArg({ id }, val => val.id == id))
		if (user) {
			return user
		}
		else {
			return undefined
		}
	}
	async login(/**@type {string}*/ email, /**@type {string}*/ password) {
		let user = await db.users.find(fnArg({ email }, val => val.email == email.toLowerCase()))
		if (user?.verified) {
			if (user.password == hash(password)) {
				let sess = crypto.randomUUID()
				idMap.set(sess, user.id)
				return { sess, user }
			}
		}
		return undefined
	}
	fileChangeEvent(/**@type {Function}*/ cb) {
		fileUpdated.addEventListener('fileUpdate', (/**@type {FileUpdate}*/ e) => {
			cb(e.filename)
		})
	}
	async createDomain(/**@type {string}*/ sess, /**@type {string}*/ handle) {
		if(await getDomain(handle)) {
			return 'handle already exists'
		} else {
			let user = getUser(sess)
			let domain = new db.Domain()
			domain.user = user
			user.domain = domain
			domain.handle = handle
			db.domains.push(domain)			
			return await domain
		}
	}
	async createChannel(/**@type {string}*/ sess, /**@type {string}*/ handle) {
		let domain = getDomain(handle)
		let user = getUser(sess)
		let channel = new db.Channel()
		domain.channel = channel
		channel.domain = domain
		return await channel
	}

	async createDeveloper(/**@type {string}*/ sess, /**@type {string}*/ handle) {
		let domain = getDomain(handle)
		let user = getUser(sess)
		let developer = new Developer()
		domain.developer = developer
		developer.domain = domain
		return developer
	}
}
let api = new API()
export default api
