import * as Entities from "../entities"
const EntityList = Object.entries(Entities).map(e => e[1])
type Constructor = typeof EntityList[0]

function enhanceClass<T extends Constructor>(entity: T) {
    //@ts-ignore
    return class ProxyClass extends entity {
        constructor(...args: any[]) {
            super()
            let EnhancedClass = new Proxy(entity, {
                construct(target, args, newTarget) {
                    console.log("I was constructed")
                    //@ts-ignore
                    return new target(...args)
                },
            })
            return EnhancedClass
        }

    }
}

export const User = enhanceClass(Entities.User) as typeof Entities.User
type RemoteArgs<T> = 
    T extends [infer A, infer B, infer C, infer D, infer E]
    ? [Remote<A>, Remote<B>, Remote<C>, Remote<D>, Remote<E>]
    : T extends [infer A, infer B, infer C, infer D]
    ? [Remote<A>, Remote<B>, Remote<C>, Remote<D>]
    : T extends [infer A, infer B, infer C]
    ? [Remote<A>, Remote<B>, Remote<C>]
    : T extends [infer A, infer B]
    ? [Remote<A> | A, Remote<B>]
    : T extends [infer A]
    ? [Remote<A>]
    : never

type RemoteProperty<T> = T extends (...args: infer U) => infer Y 
    ? (...args: RemoteArgs<U>) => Promise<Awaited<Y>> 
    : Promise<Awaited<T>>

type Remote<T> = T extends Object 
    ? { [P in keyof T]: RemoteProperty<T[P]> }
    : T

class Beans {
    size: number
    
    merge(other: Beans, extra: number) {
        let merged = new Beans()
        merged.size = other.size + this.size + extra
        return merged
    }
}

function makeRemote<T>(value: T): Remote<T> {
    //...
    return value as Remote<T>
}

let remoteBeansA = makeRemote(new Beans())
let remoteBeansB = makeRemote(new Beans())
let remoteBeansC = remoteBeansA.merge(new Beans(), 10)

type Brand<T, U> = T & { __type: U }

type GroupID = Brand<number, 'GROUP_ID'>
type ObjectID = Brand<number, 'OBJECT_ID'>

function test(num: GroupID) {
    return num
}

test(1 as GroupID)