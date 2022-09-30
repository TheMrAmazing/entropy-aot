import { CreateDate, UpdateDate, UUID } from './builtin/types'
import * as crypto from 'crypto'
//@ts-ignore
export class EntropyEntity {
    id: UUID = crypto.randomUUID()
    createdAt: CreateDate = new Date()
    updatedAt: UpdateDate = new Date()

    // static async initialize<T extends EntropyEntity>(this: (new () => T) & typeof EntropyEntity, entityLike: DeepPartial<T>): Promise<T> {
    //     let tree = getInheritanceTree(this)
    //     let metaStorage = getMetadataArgsStorage()
    //     let cols = metaStorage.columns.filter((col) => {
    //         return (tree.includes(col.target as Function) && col.mode == 'regular')
    //     })
    //     for (let col of cols) {
    //         let input = entityLike[col.propertyName as keyof DeepPartial<T>]
    //         if(col.options.unique && input !== undefined) {
    //             let exists = !!(await this.findOne({
    //                 where: {
    //                     [col.propertyName]: input
    //                 }
    //             }))
    //             if (exists){
    //                 //TODO: errors in errors
    //                 throw EntropyErrors.Forbidden
    //             }
    //         } 
    //         if(col.options.hasOwnProperty('default') && input == undefined) {
    //             let defaultValue = typeof col.options.default == 'function'? col.options.default() : col.options.default
    //             entityLike[col.propertyName as keyof DeepPartial<T>] = defaultValue
    //         }  
    //     }
    //     let ret = new this() as T
    //     let setFunctions: [string, any][] = []
    //     Object.entries(entityLike).forEach((prop) => {
    //         let setFunction = ret[('set' + prop[0]) as keyof T]
    //         if(setFunction) {
    //             setFunctions.push(prop)
    //         } else {
    //             ret[prop[0] as keyof EntropyEntity] = prop[1]
    //         }
    //     })
    //     ret = await ret.save()
    //     if(setFunctions.length > 0) {
    //         for (let i = 0; i < setFunctions.length; i++) {
    //             let prop = setFunctions[i]
    //             ret[prop[0] as keyof EntropyEntity] = await (ret[('set' + prop[0]) as keyof T] as unknown as Function)(prop[1]) as any
    //             ret = await ret.save()
    //         }
    //     }
    //     return ret
    // }

    // static paramHandler<T extends EntropyEntity>(this: (new () => T) & typeof EntropyEntity) {
    //     return async (req: Request, res: Response, next: NextFunction) => {
    //         try {
    //             let id = req.params[camelize(this.name) + 'Id']
    //             if (isUUID(id)) {
    //                 let entity  = await this.findOneAndCache(id) as any
    //                 if (entity) {
    //                     if(!req.target) {
    //                         req.target = {}
    //                     }
    //                     req.target[camelize(this.name) as keyof (typeof req.target)] = entity
    //                     next()
    //                 } else {
    //                     next(EntropyErrors.NotFound)
    //                 }
    //             } else {
    //                 next(EntropyErrors.InvalidParameter)
    //             }
    //         } catch (error) {
    //             next(error)
    //         }
    //     }
    // }

    // static getScopes<T extends EntropyEntity>(this: (new () => T) & typeof EntropyEntity, requestType: string) {
    //     let tree = getInheritanceTree(this)
    //     let metaStorage = getMetadataArgsStorage()
    //     let cols = metaStorage.columns.filter((col) => {
    //         return (tree.includes(col.target as Function) && col.mode == 'regular')
    //     })
    //     type scopeType = {
    //         [Property in keyof T]: string[]
    //     }
    //     let scopes: scopeType = Object.fromEntries(cols.map(col => [col.propertyName, new Array<string>()])) as scopeType
    //     for (let col of cols) {
    //         if(col.permissions) {
    //             if(col.permissions[requestType as keyof PermissionArgs]) {
    //                 scopes[col.propertyName as keyof typeof scopes] = col.permissions[requestType as keyof PermissionArgs]!
    //             }
    //         }
    //     }
    //     return scopes
    // }

    // static async findOneAndCache<T extends EntropyEntity>(this: ObjectType<T>, optionsOrId: string | FindOneOptions<T>, saveOnEvict: boolean = true): Promise<T | undefined> {
    //     let isString = typeof optionsOrId === 'string'
    //     let optionsHash = crypto.createHash('md5').update(JSON.stringify(optionsOrId)).digest('hex')
    //     let cacheKey = isString ? optionsOrId as string : optionsHash
    //     let item = cache.get<T>(cacheKey)
    //     if (item) {
    //         return item
    //     } else {
    //         item = await (isString 
    //             ? super.findOneBy({ id: optionsOrId } as any)
    //             : super.findOne(optionsOrId as FindOneOptions))
    //         if (item) {
    //             if (isString) {
    //                 cache.set({
    //                     key: cacheKey,
    //                     saveOnEvict,
    //                     value: item
    //                 })
    //                 return item
    //             } else {
    //                 let itemId = item.id
    //                 let previouslyCached = cache.get<T>(itemId)
    //                 if (previouslyCached) {
    //                     cache.set({
    //                         key: optionsHash,
    //                         saveOnEvict,
    //                         value: previouslyCached
    //                     })
    //                     return previouslyCached
    //                 } else {
    //                     cache.set({
    //                         key: itemId,
    //                         saveOnEvict,
    //                         value: item
    //                     })
    //                     cache.set({
    //                         key: optionsHash,
    //                         saveOnEvict,
    //                         value: item
    //                     })
    //                     return item
    //                 }
    //             }
    //         }
    //     }
    // }
}