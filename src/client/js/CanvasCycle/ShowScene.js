import { Bitmap } from './Bitmap.js'
let startTime = Date.now()
function GetTickCount() {
	// milliseconds since page load
	return Math.floor((new Date()).getTime() - startTime)
}
export default function show(canvas, image) {
	let bmap = new Bitmap(image)
	canvas.width = image.width
	canvas.height = image.height
	let context = canvas.getContext('2d')
	let imgData = context.createImageData(image.width, image.height)
	bmap.render(imgData, false)
	context.putImageData(imgData, 0, 0)
	bmap.optimize()
	let animate = function () {
		bmap.palette.cycle(bmap.palette.baseColors, GetTickCount(), 1, true)
		bmap.render(imgData, true)
		context.putImageData(imgData, 0, 0)
		window.requestAnimationFrame(animate)
	}
	window.requestAnimationFrame(animate)
	return canvas
}
