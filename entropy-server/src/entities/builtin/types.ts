export type UUID = string
export type CreateDate = Date
export type UpdateDate = Date

export type Unique<T> = T
export type Owns<T> = T
export type Cascade<T> = T

export type TypeDef = {
    propName: string
    typeName: string,
    isArray: boolean
    options: Array<string>,
    nullable: boolean
}

export class ClassNode {
    name: string
    children: ClassNode[] = []
    inherets?: ClassNode
    relations: [TypeDef, TypeDef][] = []
    properties: TypeDef[] = []
    constructor(name:string) {
        this.name = name
    }
    relationIds: [TypeDef, TypeDef][] = []
}
