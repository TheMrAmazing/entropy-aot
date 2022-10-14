import { Component } from './Component.js'
import RegisterDialog from './RegisterDialog.js'
export default class LoginDialog extends Component {
	registerDialog
	constructor() {
		super()
		this.registerDialog = new RegisterDialog()
	}
	submit(e) {
		e.preventDefault()
		// console.log(Object.entries(e.target)
		//     .filter(tar => tar[1].constructor.name == 'HTMLInputElement')
		//     .map(tar => tar[1].value))
		channelDialog.close()
	}
	open(e) {
		window.prompt()
		channelDialog.showModal()
	}
	render() {
		return dialog('#channelDialog', [
			h1('Create Channel'),
			form('#channelForm', { on: { submit: this.submit } }, [
				label('handle'), input(),
				button({ attrs: { formaction: true } }, 'create channel')
			])
		])
	}
}
