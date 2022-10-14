const fs = require('fs')
const babel = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generate = require('@babel/generator').default

function transform(source) {
	let ast = babel.parse(source, {sourceType: 'module'})
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
	return generate(ast)
}
let code = fs.readFileSync(process.cwd() + '\\src\\test\\transformerTest.js').toString('utf8')
let testTransform = transform(code)

const oldHook = require.extensions['.js']
require.extensions['.js'] = (module, /**@type {string}*/ file) => {
	if(!file.startsWith(process.cwd + '\\src\\')) {
		module._compile(module, file)
	} else {
		const oldCompile = module._compile
		module._compile = (/**@type {string}*/ oldCode, /**@type {string}*/ file) => {
			const {code, map} = transform(oldCode)
			console.log(file)
			module.SourceMap = map
			module._compile = oldCompile
			module._compile(code, file)
		}
		oldHook(module, file)
	}
}
const index = process.argv.indexOf('--main')
require(process.argv[index + 1])
// const test = require('./test/transformerTest.js')