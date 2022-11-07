import { Component } from './Component.js'
import { state, api } from '../js/globalState.js'
export default class DomainDialog extends Component {
	constructor() {
		super()
	}
	async submit(e) {
		e.preventDefault()
		let vals = Object.entries(e.target)
			.filter(tar => tar[1].constructor.name == 'HTMLInputElement')
			.map(tar => tar[1].value)
		let domain = await api().createDomain(state.sess, vals[0])
		if(domain == undefined || typeof domain == 'string') {
			console.error(domain)
		} else {
			state.domain = domain
			state.user.domain = state.domain
			domainDialog.close()
		}
	}
	open() {
		domainDialog.showModal()
		return new Promise((resolve, reject) => {
			domainDialog.addEventListener('close', () => {
				resolve(domainDialog.returnValue)
			})
		})
	}
	render() {
		return dialog('#domainDialog', [
			h1('Set Handle'),
			form('#handlForm', { on: { submit: this.submit } }, [
				label('handle'), input(),
				button({ attrs: { formaction: true } }, 'submit')
			])
		])
	}
}
