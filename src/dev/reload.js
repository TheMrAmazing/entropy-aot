import { watch, readdir, stat } from 'fs'

export class FileUpdate extends Event {
	constructor(/**@type {string}*/ filename) {
		super('fileUpdate')
		this.filename = filename
	}
}

globalThis.fileUpdated = new EventTarget()
globalThis.watchedFiles = []

const debounce = new Map()

function setWatcher(/**@type {string}*/ file) {
	if (file.endsWith('.js')) {
		if(!watchedFiles.includes(file)) {
			watchedFiles.push(file)
			debounce.set(file, true)
			watch(file, {}, (eventType, filename) => {
				// Object.keys(require.cache).forEach(function (id) {
				// 	if (id == file) {
				// 		console.log('Reloading: ' + filename)
				// 		delete require.cache[id]
				// 	}
				// })
				if(debounce.get(file)) {
					fileUpdated.dispatchEvent(new FileUpdate(file))
					debounce.set(file, false)
					setTimeout(() => {debounce.set(file, true)}, 100)
				}
			})
		}
	}
}
export function hotReload(/**@type {string}*/ dir) {
	readdir(dir, (err, files) => {
		if(files) {
			files.forEach(val => {
				let file = dir + '\\' + val
				stat(file, (err, stats) => {
					if (stats.isDirectory()) {
						hotReload(file)
						if(!watchedFiles.includes(file)) {
							watchedFiles.push(file)
							watch(file, {}, (eventType, dirname) => {
								hotReload(file)
							})
						}
					} else {
						setWatcher(file)
					}
				})
			})
		} else {
			setWatcher(dir)
		}
	})
}
