import { Component } from '../components/Component.js'
import Header from '../components/Header.js'
import NewProjectDialog from '../components/NewProjectDialog.js'
export default class Developer extends Component {
	header
	newProjectDialog
	constructor() {
		super()
		this.header = new Header()
		this.newProjectDialog = new NewProjectDialog()
	}
	render() {
		return body([
			this.header.h(),
			main([
				this.newProjectDialog.h()
			]),
			footer([button({ style: { marginRight: 'var(--w)' }, on: { click: async (e) => {
				let val = await this.newProjectDialog.open(e)
				console.log(val)
				this.patch()
			} } }, 'New')])
		])
	}
}
