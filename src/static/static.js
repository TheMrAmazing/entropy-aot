import * as http from 'http'
import {readdir, readFile} from 'fs/promises'
import { resolve } from 'path'
import mime from './mime.js'
import path from 'path'
import {FileUpdate, hotReload} from '../dev/reload.js'

/**@returns {Promise<string[]>}*/
async function getFiles(/**@type {string}*/ dir) {
	try{
		const dirents = await readdir(dir, { withFileTypes: true })
		const files = await Promise.all(dirents.map((dirent) => {
			const res = resolve(dir, dirent.name)
			return dirent.isDirectory() ? getFiles(res) : res
		}))
		return Array.prototype.concat(...files)
	} catch(e) {
		return [dir]

	}	
}

function fileToURL(/**@type {string}*/ filename) {
	return filename.replace(process.cwd() + '\\src', '').replaceAll('\\', '/')
}

export async function hostDir(/**@type {string[]}*/ ...dirs) {
	let res = (await Promise.all(
		dirs.map(dir => getFiles(process.cwd() + '\\src\\' + dir))
	)).flat()
    
	let files = await Promise.all(res.map(async (/**@type {string}*/ filename) => {
		return [fileToURL(filename), (await readFile(filename))]
	}))
	return Object.fromEntries(files)
}

export async function startFileServer() {
	const dirs = ['client', 'lib', 'remote', 'index.html']
	let urls = await hostDir(...dirs)
	dirs.forEach(dir => {
		hotReload(`${process.cwd()}\\src\\${dir}`)
	})
	fileUpdated.addEventListener('fileUpdate', async (/**@type {FileUpdate}*/ e) => {
		let val = dirs.find(dir => e.filename.search(`${process.cwd()}\\src\\${dir}`))
		if(val) {
			urls[fileToURL(e.filename)] = (await readFile(e.filename))
		}
	})
	const server = http.createServer((req, res) => {
		/**@type {string}*/ let url
		if(req.url == '/' || req.url == undefined) {
			url = '/index.html'
		} else {
			url = req.url
		}

		let ext = url.slice(url.lastIndexOf('.') + 1)
		if(ext == undefined) {
			url = url + '.js'
			ext = 'js'
		}
		let type = mime[ext]
		if(type == undefined) {
			type = mime['js']
			url = url + '.js'
		}
		res.setHeader('Content-Type', type)
		let file = urls[url]
		
	    if(file) {
		    res.end(file)
		} else {
			res.end('')
		}
	})
    
	server.listen(8080, () => {
		console.log('Server running at http://localhost:8080/')
	})
}