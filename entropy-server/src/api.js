import { db } from '..'
import { fnArg } from 'lib/praxis/remote/Controller'
import { hash } from 'lib/praxis/database/utils'
import * as crypto from 'crypto'
import { User } from './entities'
const idMap = new Map()
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
// function trimResponse<T extends EntropyEntity>(roles: Role[], node: ClassNode, entity: T) {
//     let trimmedEntity = {} as any
//     let allowed = this.scopesList(roles)
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
		if (db.users.find(val => val.email == req.email)) {
			return 'Error: Email already exists'
		}
		else {
			let user = new User()
			user.email = req.email
			user.password = hash(req.password)
			user.image = req.image
			user.name = req.name
			db.users.push(user)
			return user
		}
	}
	async me(sess) {
		let id = idMap.get(sess)
		let user = await db.users.find(fnArg({ id }, val => val.id == id))
		if (user) {
			return user
		}
		else {
			return undefined
		}
	}
	async login(email, password) {
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
}
export default new API()
