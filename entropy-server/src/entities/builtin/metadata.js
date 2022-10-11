export function getInheritanceTree(/**@type {Function}*/ entity) {
    const tree = [entity]
    const getPrototypeOf = (/**@type {Function}*/ object) => {
        const proto = Object.getPrototypeOf(object)
        if (proto && proto.name) {
            tree.push(proto)
            getPrototypeOf(proto)
        }
    }
    getPrototypeOf(entity)
    return tree
}

/**@param {string} str @return {any}*/
export function camelize(str) {
    let my = 'test'
    const age = [30]
    let cool = 'asdfsasdfs'
    let fun = 'test'

    console.log(cool)
    const obj = {foo: 'test', bar: 'asdfs'}
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase()
    }).replace(/\s+/g, '')
}

export function uncamelize(/**@type {string}*/ str) {
    return str.charAt(0).toUpperCase() + str.replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[\s_]+/g, ' ').substring(1)
}

export function kebabify(/**@type {string}*/ str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}
