import { fork } from 'child_process'
import { randomUUID } from 'crypto'
import {readdir, stat, writeFile, rmSync, existsSync, mkdirSync, rm} from 'fs'
let abort = new AbortController()
const noOp = () => {}
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

const cleanupFiles = []
const cleanupFolders = []

function runTest (runFile, name, func, options = {partner: [], before: []}) {
	let finished = new AbortController()
	let end
	let timeout = setTimeout(() => {
		if(!finished.signal.aborted) {
			console.log( '\u001b[33m~ '+ name +': timed out\u001b[0m' )
			end()
		}
	}, 45000)
	const {partner, before} = options
	const port = (Math.floor(Math.random() * 45151) + 4000).toString()
	const evalFile = runFile.slice(0, runFile.lastIndexOf('\\')) + '\\' + randomUUID() + '.js'
	const tempFolder = process.cwd() + '/' + randomUUID() + '/'
	if (!existsSync(tempFolder)) {
		mkdirSync(tempFolder)
	}
	 end = () => {
		finished.abort()
		clearTimeout(timeout)
		if(existsSync(evalFile)) {
			rm(evalFile, noOp)
		}
		if(existsSync(tempFolder)) {
			rm(tempFolder, {recursive: true, force: true}, noOp)
		}
	}
	writeFile(evalFile , 'eval(process.env.func)()', () => {
		cleanupFiles.push(evalFile)
		cleanupFolders.push(tempFolder)
		if(partner.length > 0) {
			partner.forEach((fn) => {
				const partnerProcess = fork(
					'./src/bootstrap.js', 
					['--main', evalFile, "--tests"], {
						signal: finished.signal,
						env: {func: fn, tempFolder, port},
						silent: true
					}
				)
				partnerProcess.on('error', () => {})
				partnerProcess.stderr.on('data', e => {
					console.error(e.toString())
				})
				partnerProcess.stdout.on('data', data => {
					// console.log(data.toString())
				})
			})
		}
		if(before.length > 0) {
			func = 'async () => {\n' +
				before.map(fn => 'await (' + fn + ')()\n').join() + '\n' +
				`await (${func})()}`
		}

		const testCase = fork(
			'./src/bootstrap.js',
			 ['--main', evalFile, "--tests"], {
				signal: finished.signal,
				env: {func, tempFolder, port}, 
				silent: true
			}
		)

		testCase.stderr.on('data', e => {
			console.error(e.toString())
		})

		testCase.stdout.on('data', data => {
			// console.log(data.toString())
		})

		testCase.on('error', () => {})

		testCase.on('message', (/**@type {any}*/ message) => {
			if(message.result) {
				console.log( '\u001b[32m\u2714 '+ name +'\u001b[0m' )
			} else {
				console.log( '\x1b[31m\u2718 '+ name +'\u001b[0m' )
			}
			end()
		})
	})
}

function runTests(/**@type {string}*/ dir) {
	readdir(dir, (err, files) => {
		if (files) {
			files.forEach(val => {
				let file = dir + '\\' + val
				stat(file, (err, stats) => {
					if (stats.isDirectory()) {
						runTests(file)
					} else {
						if (file.endsWith('.test.js')) {
							const testProcess = fork(
								'./src/bootstrap.js',
								['--main', file, "--tests"]
							)
							const tests = []
							const partnerProcesses = []
							const befores = []
							testProcess.on('message', (/**@type {any}*/ helper) => {
								switch(helper.type) {
									case 0:
										tests.push({name: helper.name, func: helper.func})
										break
									case 1:
										partnerProcesses.push(helper.func)
										break
									case 2:
										befores.push(helper.func)
								}

							})
							testProcess.on('exit', () => {
								tests.forEach(test => {
									runTest(file, test.name, test.func, {partner: partnerProcesses, before: befores})
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
