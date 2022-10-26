// import './test/transformerTest'
// import { Receiver } from './remote/Receiver.js'
// import { WSReceiver } from './remote/shims/WSReceiver.js'
// import { hotReload } from './dev/reload'

// hotReload(__dirname)
// const receiver = new Receiver('../database/Database.js', WSReceiver, 3000)
globalThis.functionSymbol = Symbol()
const oldConstructor = Proxy.constructor

Proxy.constructor = (target, handler) => {
	let ret = oldConstructor(target, handler)
	Object.defineProperty(this, proxySymbol, {enumerable: false, value: target})
	return ret
}
console.log(oldConstructor)
//