import * as Entities from "../entities";
const EntityList = Object.entries(Entities).map(e => e[1]);
function enhanceClass(entity) {
    //@ts-ignore
    return class ProxyClass extends entity {
        constructor(...args) {
            super();
            let EnhancedClass = new Proxy(entity, {
                construct(target, args, newTarget) {
                    console.log("I was constructed");
                    //@ts-ignore
                    return new target(...args);
                },
            });
            return EnhancedClass;
        }
    };
}
export const User = enhanceClass(Entities.User);
class Beans {
    size;
    merge(other, extra) {
        let merged = new Beans();
        merged.size = other.size + this.size + extra;
        return merged;
    }
}
function makeRemote(value) {
    //...
    return value;
}
let remoteBeansA = makeRemote(new Beans());
let remoteBeansB = makeRemote(new Beans());
let remoteBeansC = remoteBeansA.merge(new Beans(), 10);
function test(num) {
    return num;
}
test(1);
