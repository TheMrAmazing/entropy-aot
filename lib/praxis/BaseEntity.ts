import {writeFile} from 'fs/promises'
import {existsSync, readFileSync, writeFileSync} from 'fs'

function isObject(value: any) {
    return typeof value === 'object'
        && value != null
        && !(value instanceof Boolean)
        && !(value instanceof Date)
        && !(value instanceof Number)
        && !(value instanceof RegExp)
        && !(value instanceof String)
}

function toPointer(parts: string[]) {
    return '#' + parts.map(part => String(part).replace(/~/g, '~0').replace(/\//g, '~1')).join('/')
}

export function BaseEntity() {
    this.parents = new WeakMap()
    this.keys = new WeakMap()
    this.refs = new Map()
    this.paths = new WeakMap()

    this.ObjectSymbol = Symbol()

   const getRef = (ref: string) => {
        let val = this.refs.get(ref)
        if (val) {
            return val
        } else {
            const filename = './json/' + ref.replaceAll('/', '_') + '.json'
            if (existsSync(filename)) {
                let json = readFileSync(filename).toString('utf8')
                if (json != '') {
                    return JSON.parse(json)
                }
            }
            return {}
        }
    }
    let base = getRef('#')
    let keys = Reflect.ownKeys(base).filter(key => !Reflect.ownKeys(this).includes(key))
    keys.forEach(key => this[key] = base[key])
    
    
    const replacer = (path: string[], value: any) => {
        if(isObject(value) && !value.$ref) {
            if(value[this.ObjectSymbol]) {
                let pointer = toPointer(path)
                value = { $ref: value[this.ObjectSymbol] }
                this.paths.set(value, pointer)
                this.refs.set(pointer, value)
            } else {
                let seen =  this.paths.get(value) 
                if(seen) {
                    value = { $ref: seen }    
                } else {
                    let pointer = toPointer(path)
                    this.paths.set(value, pointer)
                    Object.keys(value).forEach(key => value[key] = replacer([...path, key], value[key]))   
                    this.refs.set(pointer, value)
                    writeFileSync('./json/' + pointer.replaceAll('/', '_') + '.json', JSON.stringify(this.refs.get(pointer)))
                    value = { $ref: pointer }
                }
            }
        }
        return value
    }

    const nestedProxy = (path: string[]) => {
        return {
            get: (target, key, receiver) => {
                if(key == '_raw') {
                    return target
                }
                if(isObject(target[key])) {
                    if (target[key].$ref) {
                        let proxy = new Proxy(getRef(target[key].$ref), nestedProxy([...path, key]))
                        Reflect.defineProperty(proxy, this.ObjectSymbol, {enumerable: false, value: target[key].$ref})
                        return proxy
                    }
                }
                return target[key]
            },
            set: (target, key, value) => {
                target[key] = replacer([...path, key], value)
                if(isObject(target)) {
                    let pointer = toPointer([...path])
                    this.refs.set(pointer, target)
                    writeFile('./json/' + pointer.replaceAll('/', '_') + '.json', JSON.stringify(this.refs.get(pointer)))
                }
                return true
            }
        }
    }

    return new Proxy(this, nestedProxy([]))
}