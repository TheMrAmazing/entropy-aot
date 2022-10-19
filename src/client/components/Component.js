import { patch } from '../../lib/snabbdom/patch.js'

/**@type {Map<string, Component[]>}*/ globalThis.componentRegistry = new Map()
export class Component {
	sel
	data
	children
	elm
	text
	key
	initialRender = true
	slots
	h(slots) {
		this.slots = slots
		const me = this.render(slots)
		if (this.initialRender) {
			this.children = me.children
			this.sel = me.sel
			this.data = me.data
			this.text = me.text
			this.elm = me.elm
			this.key = me.key
			this.initialRender = false
			return this
		}
		else {
			return me
		}
	}
	/**@returns {any} */
	render(...args) {
		throw Error('abstract method')
	}
	constructor() {
		let key = Object.getPrototypeOf(this).constructor.name
		if (componentRegistry.get(key)) {
			componentRegistry.get(key).push(this)	
		} else {
			componentRegistry.set(key, [this])
		}
	}
	patch() {
		let newRender = this.render(this.slots)
		let me = patch(this, newRender)
		this.children = me.children
		this.sel = me.sel
		this.data = me.data
		this.text = me.text
		this.elm = me.elm
		this.key = me.key
	}
}
