const fs = require('fs')
const babel = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generate = require('@babel/generator').default

function transform(/**@type {string}*/ source, /**@type {string}*/ filename) {
	let ast = babel.parse(source, {sourceType: 'module', sourceFilename: filename.slice(filename.lastIndexOf('\\') + 1)})
	/**@type {Map<string, {path: string, type: "ImportSpecifier" | "ImportDefaultSpecifier" | "ImportNamespaceSpecifier", imported: string}>}*/ const imports = new Map()
	traverse(ast, {
		enter(path) {
			if(path.isImportDeclaration()) {
				path.node.specifiers.forEach(spec => {
					imports.set(spec.local.name, {
						path: path.node.source.value,
						type: spec.type,
						//@ts-ignore
						imported: spec.imported ? spec.imported.name : undefined
					})
				})
				//@ts-ignore
				path.parent.body.unshift(t.callExpression(t.identifier('require'), [t.stringLiteral(path.node.source.value)]))
				path.remove()
			}
			if (path.isExportNamedDeclaration()) {
				//@ts-ignore
				if(path.node.declaration.type == 'VariableDeclaration') {
					//@ts-ignore
					path.node.declaration.declarations.forEach(dec => {
						path.insertAfter(
							t.expressionStatement(
								t.assignmentExpression('=', 
									t.memberExpression(
										t.identifier('exports'),	
										t.identifier(dec.id.name)
									),
									t.identifier(dec.id.name)
								)
							)
						)
					})
				} else {
					path.insertAfter(
						t.expressionStatement(
							t.assignmentExpression('=', 
								t.memberExpression(
									t.identifier('exports'),
									//@ts-ignore	
									t.identifier(path.node.declaration.id.name)
								),
								//@ts-ignore
								t.identifier(path.node.declaration.id.name)
							)
						)
					)
				}
				//@ts-ignore
				path.replaceWith(path.node.declaration)
			}
			if (path.isExportDefaultDeclaration()) {
				if(path.node.declaration.type == 'ClassDeclaration' || path.node.declaration.type == 'FunctionDeclaration') {
					path.insertAfter(
						t.expressionStatement(
							t.assignmentExpression('=', 
								t.memberExpression(
									t.identifier('exports'),
									//@ts-ignore	
									t.identifier('default')
								),
								//@ts-ignore
								t.identifier(path.node.declaration.id.name)
							)
						)
					)
					path.replaceWith(path.node.declaration)
				} else {
					path.replaceWith(
						t.expressionStatement(
							t.assignmentExpression('=', 
								t.memberExpression(
									t.identifier('exports'),
									//@ts-ignore	
									t.identifier('default')
								),
								//@ts-ignore
								path.node.declaration
							)
						)
					)
				}
			}
			if (path.isIdentifier()) {
				let ref = imports.get(path.node.name)
				if (ref) {
					if (path.scope.bindings[path.node.name] == undefined) {
						let pt = path.parent.type
						if(	pt != 'ImportNamespaceSpecifier' &&
								pt != 'ImportDefaultSpecifier' &&
								pt != 'ImportSpecifier' &&
								pt != 'ClassProperty' &&
								pt != 'ArrowFunctionExpression' &&
								pt != 'ClassMethod' &&
								pt != 'FunctionDeclaration') {
							if(pt == 'MemberExpression') {
								//@ts-ignore
								if(path.parent.object != path.node) {
									return
								}
							}
							if(pt == 'VariableDeclarator') {
								//@ts-ignore
								if(path.parent.id == path.node) {
									return
								}
							}
							let code
							if(ref.type == 'ImportDefaultSpecifier') {
								code = t.memberExpression(t.callExpression(t.identifier('require'), [t.stringLiteral(ref.path)]), t.identifier('default'))
							} else if(ref.type == 'ImportNamespaceSpecifier') {
								code = t.callExpression(t.identifier('require'), [t.stringLiteral(ref.path)])
							} else {
								code = t.memberExpression(t.callExpression(t.identifier('require'), [t.stringLiteral(ref.path)]), t.identifier(ref.imported))
							}
							path.replaceWith(code)
						}
					}
				}
			}
		}
	})
	return generate(ast, {sourceMaps: true, sourceFileName: filename.slice(filename.lastIndexOf('\\') + 1)}, source)
}
let code = fs.readFileSync(process.cwd() + '\\src\\testing\\transformerTest.js').toString('utf8')
let testTransform = transform(code, process.cwd() + '\\src\\testing\\transformerTest.js')
const dir = process.cwd() + '\\src\\'
const oldHook = require.extensions['.js']
require.extensions['.js'] = (module, /**@type {string}*/ file) => {
	// console.log(file)
	if(file.startsWith(dir)) {
		const oldCompile = module._compile
		module._compile = (/**@type {string}*/ oldCode, /**@type {string}*/ filename) => {
			const {code, map} = transform(oldCode, filename)
			let sourceMap = '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,' + Buffer.from(JSON.stringify(map), 'utf8').toString('base64')
			module._compile = oldCompile
			module._compile(code + sourceMap, filename)
		}
		oldHook(module, file)
	} else {
		oldHook(module, file)
	}
}


const tests = process.argv.indexOf('--tests')
if (tests == -1) {
	process.on('uncaughtException', function (err) {
		console.error(err)
	})
	require('./dev/reload.js').hotReload(process.cwd() + '\\src')
}
globalThis.ProxySymbol = Symbol()
const oldConstructor = Proxy.constructor
Proxy.constructor = (target, handler) => {
	let ret = oldConstructor(target, handler)
	Object.defineProperty(ret, ProxySymbol, {enumerable: false, value: target})
	return ret
}
const index = process.argv.indexOf('--main') + 1
require(process.argv[index])