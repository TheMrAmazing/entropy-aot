import { h } from '../../lib/snabbdom/package/h'
import Header from '../components/Header.js'
import show from '../js/CanvasCycle/ShowScene.js'
import { get } from '../js/utils.js'
import { Component } from '../components/Component.js'
const zeroPad = (num, places) => String(num).padStart(places, '0')
export default class Browse extends Component {
	show
	header
	image
	constructor() {
		super()
		this.show = false
		this.header = new Header()
		requestAnimationFrame(async () => {
			let num = (Date.now() % 35) + 1
			let paddedNum = zeroPad(num, 3)
			let data = await get('client/assets/backgrounds/image_' + paddedNum + '.json')
			// let url = '/assets/background/image_'  + paddedNum + '.json'
			this.image = data
			this.show = true
			show(bmap, this.image)
		})
	}
	render() {
		this.show ? requestAnimationFrame(() => {
			show(bmap, this.image)
		}) : undefined
		return body([
			div('.overlay.glow'),
			div('.overlay.scanlines'),
			this.header.h(),
			main([
				canvas('#bmap')
			]),
			footer([h('terminal-input')])
		])
	}
}
