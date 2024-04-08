import { Component } from '../../components/Component.js'
export default class Channel extends Component {
	constructor() {
		super()
	}
	render(slots) {
		return main([
			div('I am in Channel')
		])
	}
}
