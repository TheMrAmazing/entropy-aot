import { fork } from 'child_process'
import { randomUUID } from 'crypto'
import {readdir, stat, writeFile, rmSync, existsSync, rmdirSync, mkdirSync} from 'fs'
let abort = new AbortController()

const cleanupFiles = []
const cleanupFolders = []

function callback() {
	cleanupFiles.forEach(file => {
		if(existsSync(file)) {
			rmSync(file)
		}
	})
	cleanupFolders.forEach(folder => {
		if(existsSync(folder)) {
			rmSync(folder, {recursive: true, force: true})
		}
	})
	abort.abort()
}

process.on('exit', function () {
	callback()
})
process.on('SIGINT', function () {
	callback()
})

process.on('uncaughtException', function(e) {
	callback()
})


function runTests(/**@type {string}*/ dir) {
	readdir(dir, (err, files) => {
		if (files) {
			files.forEach(val => {
				let file = dir + '\\' + val
				stat(file, (err, stats) => {
					if (stats.isDirectory()) {
						runTests(file)
					} else {
						
						setTimeout(() => {
							abort.abort()
						}, 10000)
						if (file.endsWith('.test.js')) {
							const runFile = file[0].toUpperCase() + file.slice(1)
							const testProcess = fork('./src/bootstrap.js', ['--main', runFile], { signal: abort.signal})
							testProcess.on('message', (/**@type {any}*/ test) => {
								const {name, func} = test
								const evalFile = runFile.slice(0, runFile.lastIndexOf('\\')) + '\\' + randomUUID() + '.js'
								const dbfolder = process.cwd() + '/' + randomUUID() + '/'
								if (!existsSync(dbfolder)) {
									mkdirSync(dbfolder)
								}
								writeFile(evalFile , 'eval(process.env.func)()', () => {
									cleanupFiles.push(evalFile)
									cleanupFolders.push(dbfolder)
									console.log('Running: ' + name)
									const testCase = fork('./src/bootstrap.js', ['--main', evalFile], {signal: abort.signal, env: {func, folder: dbfolder}, silent: true})
									testCase.stdout.on('data', data => {
										console.log(data.toString())
									})
									testCase.stderr.on('data', e => {
										console.error(e.toString())
									})
								}) 
							})
						}
					}
				})
			})
		}
	})
}
runTests(process.cwd() + '\\src')