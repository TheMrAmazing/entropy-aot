import { Component } from '../../components/Component.js'
import Header from '../../components/Header.js'
import { router } from '../../components/Router.js'
export default class Account extends Component {
	header
	constructor() {
		super()
		this.header = new Header()
	}
	render(slots) {
		let selected = router.route[1]
		return body([
			div('.overlay.glow'),
			div('.overlay.scanlines'),
			this.header.h(),
			aside('.ascii-border-solid', [
				nav([
					li({ class: { selected: (selected == undefined) }, on: { click: e => router.push('account') } }, '«» Live'),
					li({ class: { selected: (selected == 'settings') }, on: { click: e => router.push('account', 'settings') } }, ' º Account'),
					li({ class: { selected: (selected == 'channel') }, on: { click: e => router.push('account', 'channel') } }, ' * Channel'),
					li({ class: { selected: (selected == 'revenue') }, on: { click: e => router.push('account', 'revenue') } }, '$$ Revenue'),
				])
			]),
			slots.router.h()
		])
	}
}
