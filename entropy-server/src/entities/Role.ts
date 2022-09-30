import { EntropyEntity } from './Entity'

export class Role extends EntropyEntity {
    allows: string[]
    blocks: string[]
    rank: number
    name: string
    graphic?: string

    // static evaluatePermissions(roles: Role[], scopes: string[]): boolean {
    //     let allowed = this.scopesList(roles)
    //     return scopes.every(value => allowed.has(value))
    // }

    // static getHighestRank(roles: Role[]): number {
    //     let rank = 0
    //     for(let role of roles) {
    //         if(role.rank > rank) {
    //             rank = role.rank
    //         }
    //     }
    //     return rank
    // }
    // static scopesList(roles: Role[]) {
    //     let allowed = new Set(roles.flatMap(role => role.allows))
    //     roles.flatMap(role => role.blocks).forEach(scope => allowed.delete(scope))
    //     return allowed
    // }

    // static trimResponse<T extends EntropyEntity>(roles: Role[], node: ClassNode, entity: T) {
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
}