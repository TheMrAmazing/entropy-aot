import { Component } from '../../components/Component.js'
export default class Live extends Component {
	constructor() {
		super()
	}
	render(slots) {
		return main([
			div('I am in Live')
		])
	}
}
