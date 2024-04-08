import { Component } from './Component.js'
import LoginDialog from './LoginDialog.js'
import { state } from '../js/globalState.js'
import DomainDialog from './DomainDialog.js'
import { post } from '../js/utils.js'
import { router } from './Router.js'
import { api } from '../js/globalState.js'

export default class Header extends Component {
	loginDialog
	domainDialog
	constructor() {
		super()
		this.loginDialog = new LoginDialog()
		this.domainDialog = new DomainDialog()
	}
	async createDeveloper(e) {
		//@ts-ignore
		state.domain.developer = await api.createDeveloper(state.sess, state.domain.handle)
		this.patch()
	}

	async logout() {
		await post('/api/logout')
		state.user = undefined
		state.domain = undefined
		this.patch()
	}

	async createChannel(e) {
		state.domain.channel = await api.createChannel(state.sess, state.domain.handle)
		this.patch()
	}

	render() {
		return header('.ascii-border-solid', [
			div('.logo', [
				span({ style: { backgroundColor: '#1d5862', color: '#90adb2' } }, '«'),
				span({ style: { backgroundColor: '#5e9262', color: '#b1c9b3' } }, '»')
			]),
			pre(`
█▀▀ █  █ ▀█▀ █▀▀▄ ▄▀▀▄ █▀▀▄ █   █
█▀▀ █▀▄█  █  █▄▄▀ █  █ █▄▄▀  ▀▄▀ 
█▄▄ █  █  █  █ ▀▄ ▀▄▄▀ █      █  `),
			state.user ?
				div('.hover-menu', [
					img({ attrs: { src: state.user.image } }),
					menu([
						li({ on: { click: e => router.push('account', 'settings') } }, 'Account Settings'),
						state.domain?.channel ? li({ on: { click: e => router.push('account', 'channel') } }, 'Channel Settings') :
							li({ on: { click: async e => {
								if(state.domain) {
									this.createChannel(e)
								} else {
									await this.domainDialog.open()
									this.createChannel(e)
								}	
							}  } }, 'Create Channel'),
						li({ on: { click: e => this.logout() } }, 'Log Out'),
						li('Admin') 
					])
				]) :
				button({ on: { click: async (e) => {
					let val = await this.loginDialog.open(e)
					this.patch()
				} } }, 'Login'),
			this.loginDialog.h(),
			this.domainDialog.h()
		])
	}
}
