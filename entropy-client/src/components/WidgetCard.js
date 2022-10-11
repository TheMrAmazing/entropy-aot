import { Component } from 'lib/Component'
export default class WidgetCard extends Component {
	widget
	constructor(widget) {
		super()
		this.widget = widget
	}
	render(slots) {
		return div('.ascii-border-solid', [
			h1(this.widget.name),
			div([
				button('Edit'),
				button('View'),
				button('Config')
			])
		])
	}
}
