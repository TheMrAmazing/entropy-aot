import { Component } from '../../components/Component.js'

const DEBUG_STREAM_ID = '53f7da083ab7746c01460aa08f8601a2'

export default class Live extends Component {
	constructor() {
		super()
	}
	render(slots) {
		return main([
			div('.iframe-container', [
				iframe('.iframe-instance', {attrs:{src: 'http://localhost:3000?streamId=' + DEBUG_STREAM_ID}})
			]),
		])
	}
}
