import { Component } from 'lib/Component'
import { h } from 'lib/snabbdom'
export default class NewProjectDialog extends Component {
	constructor() {
		super()
	}
	clickOutside(e) {
		if (newProjectDialog && !newProjectDialog.contains(e.target)) {
			newProjectDialog.close()
			document.removeEventListener('click', this.clickOutside)
		}
	}
	async submit(e) {
		e.preventDefault()
		let vals = Object.entries(e.target)
		// .filter(tar => tar[1].constructor.name == 'HTMLInputElement')
		// .map(tar => tar[1].value)
		// state.user = await post('/api/login', { email: vals[0], password: vals[1]})
		// state.domain = state.user.domain
		newProjectDialog.close()
	}
	async open(e) {
		e.stopPropagation()
		newProjectDialog.showModal()
		document.addEventListener('click', this.clickOutside)
		return new Promise((resolve, reject) => {
			newProjectDialog.addEventListener('close', () => {
				resolve(newProjectDialog.returnValue)
			})
		})
	}
	render() {
		return dialog('#newProjectDialog', [
			form({ attrs: { method: 'dialog' }, on: { submit: e => this.submit(e) } }, [
				h1('Create New Project'),
				label('username'), input({ attrs: { value: 'david.bell@chthonicsoftware.com' } }),
				label('password'), input({ attrs: { value: 'test' } }),
				h('text-input'),
				div([
					button({ attrs: { type: 'submit' } }, 'submit'),
				])
			])
		])
	}
}
