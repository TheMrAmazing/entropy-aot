import { Component } from './Component.js'
import { h } from '../../lib/snabbdom/package/h.js'
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
		// .filter(tar => tar[1].constructor.name == 'HTMLInputElement')
		// .map(tar => tar[1].value)
		// state.user = await post('/api/login', { email: vals[0], password: vals[1]})
		// state.domain = state.user.domain
		newProjectDialog.close()
	}
	async open(e) {
		newProjectDialog.showModal()
		// document.addEventListener('click', e => this.clickOutside(e))
		return new Promise((resolve, reject) => {
			newProjectDialog.addEventListener('close', () => {
				resolve(newProjectDialog.returnValue)
			})
		})
	}
	render() {
		return dialog('#newProjectDialog', [
			h('b-stepper', [
				h('b-step', [
					span({attrs: {slot: 'title'}}, ['I am step 2']),
					div({attrs: {slot: 'content'}}, [
						label('Name'), input(),
						label('Description'), input(),
					])
				]),
				h('b-step', [
					span({attrs: {slot: 'title'}}, ['I am step 1']), 
					div({attrs: {slot: 'content'}}, [
						div([
							h('file-input')
						])
					])
				])
			])
		])
	}
}
