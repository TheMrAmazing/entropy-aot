// 8-bit Bitmap for use in HTML5 Canvas
// Copyright (c) 2010 Joseph Huckaby.
// Released under the LGPL v3.0: http://www.opensource.org/licenses/lgpl-3.0.html
import { Palette, Color, Cycle } from './Palette'
export class Bitmap {
	width = 0
	height = 0
	pixels
	palette
	drawCount = 0
	optPixels
	optColors
	constructor(img) {
		// class constructor
		this.optColors = []
		this.optPixels = []
		this.width = img.width
		this.height = img.height
		this.palette = new Palette(img.colors.map(color => {
			return new Color(color[0], color[1], color[2])
		}), img.cycles.map(cycle => {
			return new Cycle(cycle.rate, cycle.reverse, cycle.low, cycle.high)
		}))
		this.pixels = img.pixels
	}
	optimize() {
		// prepare bitmap for optimized rendering (only refresh pixels that changed)
		var optColors = []
		for (var idx = 0; idx < 256; idx++)
			optColors[idx] = 0
		// mark animated colors in palette
		var cycles = this.palette.cycles
		for (var idx = 0, len = cycles.length; idx < len; idx++) {
			var cycle = cycles[idx]
			if (cycle.rate) {
				// cycle is animated
				for (let idy = cycle.low; idy <= cycle.high; idy++) {
					optColors[idy] = 1
				}
			}
		}
		this.optColors = optColors
		// create array of pixel offsets which are animated
		var optPixels = this.optPixels = new Array()
		var pixels = this.pixels
		var j = 0
		var i = 0
		var x, y
		var xmax = this.width, ymax = this.height
		for (y = 0; y < ymax; y++) {
			for (x = 0; x < xmax; x++) {
				if (optColors[pixels[j]])
					optPixels[i++] = j
				j++
			} // x loop
		} // y loop
	}
	render(imageData, optimize) {
		// render pixels into canvas imageData object
		var colors = this.palette.getRawTransformedColors()
		var data = imageData.data
		var pixels = this.pixels
		var i = 0
		var j = 0
		var x, y, clr
		if (optimize && this.drawCount && this.optPixels) {
			// only redraw pixels that are part of animated cycles
			var optPixels = this.optPixels
			for (var idx = 0, len = optPixels.length; idx < len; idx++) {
				j = optPixels[idx]
				clr = colors[pixels[j]]
				i = j * 4
				data[i + 0] = clr[0] // red
				data[i + 1] = clr[1] // green
				data[i + 2] = clr[2] // blue
				// data[i] = (clr & 0xff0000) >> 16;
				// data[i+1] = (clr & 0x00ff00) >> 8;
				// data[i+2] = (clr & 0x0000ff);
				// data[i + 3] = 255; // alpha
			}
		}
		else {
			// draw every single pixel
			var xmax = this.width, ymax = this.height
			for (y = 0; y < ymax; y++) {
				for (x = 0; x < xmax; x++) {
					clr = colors[pixels[j]]
					data[i + 0] = clr[0] // red
					data[i + 1] = clr[1] // green
					data[i + 2] = clr[2] // blue
					// data[i] = (clr & 0xff0000) >> 16;
					// data[i+1] = (clr & 0x00ff00) >> 8;
					// data[i+2] = (clr & 0x0000ff);
					data[i + 3] = 255 // alpha
					i += 4
					j++
				}
			}
		}
		this.drawCount++
	}
}
