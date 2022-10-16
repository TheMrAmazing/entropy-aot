import { Component } from './Component.js'
import LoginDialog from './LoginDialog.js'
import { state } from '../js/globalState.js'
import DomainDialog from './DomainDialog.js'
import { post } from '../js/utils.js'
import { router } from './Router.js'
export default class Header extends Component {
	loginDialog
	domainDialog
	constructor() {
		super()
		this.loginDialog = new LoginDialog()
		this.domainDialog = new DomainDialog()
	}
	async createDeveloper(e) {
		state.domain.developer = await post(`/api/${state.user.domain.handle}/developer`)
		this.patch()
	}
	// admin() {
	//     if (state.user.roles) {
	//         let roles = state.user.roles
	//         let adminRole = roles.filter((role) => role.name == 'Admin')
	//         if (adminRole) {
	//             this.$router.push('/admin')
	//         }
	//     }
	// }
	async logout() {
		await post('/api/logout')
		state.user = undefined
		state.domain = undefined
		this.patch()
	}
	async createChannel(e) {
		state.domain.channel = await post(`/api/${state.user.domain.handle}/channel`)
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
						li({ on: { click: e => router.push('') } }, 'Account Settings'),
						state.domain.channel ? li({ on: { click: e => router.push('channel') } }, 'Channel Settings') :
							li({ on: { click: state.domain ? this.createChannel : this.domainDialog.open } }, 'Create Channel'),
						state.domain.developer ? li({ on: { click: e => router.push('developer') } }, 'Developer Account') :
							li({ on: { click: state.domain ? this.createDeveloper : this.domainDialog.open } }, 'Create Developer Account'),
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
