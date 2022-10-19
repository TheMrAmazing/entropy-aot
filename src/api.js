import { db } from './server.js'
import { fnArg } from './remote/Controller.js'
import { hash } from './database/utils.js'
import * as crypto from 'crypto'
import { User } from './entities/User'
/**@typedef {import('./entities/Role').Role} Role*/
/**@typedef {import('./entities/builtin/types').ClassNode} ClassNode*/

const idMap = new Map()
import {FileUpdate} from './dev/reload'

export function getRoles(user, domain) {
	let roles = []
	if (domain.roles) {
		roles = domain.roles.filter(role => {
			return role.userIds?.find(tmp => tmp === user.id)
		})
	}
	roles.push(...user.globalRoles)
	return roles
}

function flattenInheritance(/**@type {ClassNode}*/ node) {
	let properties = [] 
	let relations = [] 
	let relationIds = []
	properties.push(...node.properties)
	relations.push(...node.relations)
	relationIds.push(...node.relationIds)
	if(node.inherets) {
		/**@type {ClassNode}*/ let inherets = node.inherets
		while(inherets) {
			properties.push(...inherets.properties)
			relations.push(...inherets.relations)
			relationIds.push(...inherets.relationIds)
			inherets = inherets.inherets
		}
		properties.concat(node.inherets.properties)
	}
	return {properties, relations, relationIds}
}

function scopesList(/**@type {Role[]}*/ roles) {
	let allowed = new Set(roles.flatMap(role => role.allows))
	roles.flatMap(role => role.blocks).forEach(scope => allowed.delete(scope))
	return allowed
}

// function trimResponse(/**@type {Role[]}*/ roles, /**@type {ClassNode}*/ node, entity) {
//     let trimmedEntity = {}
//     let allowed = scopesList(roles)
//     let {properties, relations, relationIds} = flattenInheritance(node)
//     properties.forEach(property => {
//         let val = (GET[node.name as keyof typeof GET] as any)[property.propName as any]
//         if(allowed.has(val)) {
//             trimmedEntity[property.propName as any] = entity[property.propName as keyof T]
//         }
//     })
//     node.children.forEach(child => {
//         let relation = node.relations.find(relation => relation[0].typeName == child.name)
//         if(relation?.[0].isArray) {
//             trimmedEntity[relation![0].propName] = []
//             if(entity[relation![0].propName as keyof T])
//             (entity[relation![0].propName as keyof T] as any).forEach((entityItem: any) => {
//                 trimmedEntity[relation![0].propName].push(this.trimResponse(roles, child, entityItem))
//             })
//         } else {
//             if(entity[relation![0].propName as keyof T]) {
//                 trimmedEntity[relation![0].propName] = this.trimResponse(roles, child, entity[relation![0].propName as keyof T] as any)
//             }
//         }
//     })
//     relationIds.forEach(relationId => {
//         trimmedEntity[relationId[0].propName] = entity[relationId[0].propName as keyof T]
//     })
//     return trimmedEntity
// }

export class API {
	async postUser(req) {
		if (db().users.find(val => val.email == req.email)) {
			return 'Error: Email already exists'
		}
		else {
			let user = new User()
			user.email = req.email
			user.password = hash(req.password)
			user.image = req.image
			user.name = req.name
			db().users.push(user)
			return user
		}
	}
	async me(sess) {
		let id = idMap.get(sess)
		let user = await db().users.find(fnArg({ id }, val => val.id == id))
		if (user) {
			return user
		}
		else {
			return undefined
		}
	}
	async login(email, password) {
		let user = await db().users.find(fnArg({ email }, val => val.email == email.toLowerCase()))
		if (user?.verified) {
			if (user.password == hash(password)) {
				let sess = crypto.randomUUID()
				idMap.set(sess, user.id)
				return { sess, user }
			}
		}
		return undefined
	}
	fileChangeEvent(cb) {
		fileUpdated.addEventListener('fileUpdate', (/**@type {FileUpdate}*/ e) => {
			cb(e.filename)
		})
	}
	createDomain(/**@type {string}*/ sess, /**@type {string}*/ handle) {

	}
}
let api = new API()
export default api
