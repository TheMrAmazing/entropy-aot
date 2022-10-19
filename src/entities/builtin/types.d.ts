export declare type UUID = string
export declare type CreateDate = Date
export declare type UpdateDate = Date
export declare type Unique<T> = T
export declare type Owns<T> = T
export declare type Cascade<T> = T

export declare type TypeDef = {
    propName: string
    typeName: string
    isArray: boolean
    options: Array<string>
    nullable: boolean
}

export declare class ClassNode {
    name: string
    children: ClassNode[]
    inherets?: ClassNode
    relations: [TypeDef, TypeDef][]
    properties: TypeDef[]
    constructor(name: string)
    relationIds: [TypeDef, TypeDef][]
}
