import * as recast from 'recast'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import * as acorn from 'acorn'
import * as walk from 'acorn-walk'
import { Module } from 'node:module'

const dirs = ['/src']

// export async function resolve(specifier, context, nextResolve) {
// 	  return {
// 		shortCircuit: true,
// 		// format: 'commonjs',
// 		url: new URL(specifier).href
// 	  }
// }

/**@param {string} url @param {*} context @param {Function} nextLoad */
export async function load(url, context, nextLoad) {
	let filepath = path.normalize(url.charAt('file:///'.length).toLowerCase() + url.slice('file:///'.length + 1))
	let processDir = process.cwd()
	if (dirs.find(dir => filepath.startsWith(path.normalize(processDir + dir)))) {
		// console.log(filepath)
		const source = readFileSync(filepath).toString('utf8')
		// console.log(source)
		let ast = recast.parse(source, {
			parser: {
				parse (source) {
					return acorn.parse(source, {ecmaVersion: 'latest', sourceType: 'module'})
				}
			}})
		
		/**@type {Map<string, {path: string, type: "ImportSpecifier" | "ImportDefaultSpecifier" | "ImportNamespaceSpecifier", imported: string}>}*/ const imports = new Map()


		let blockScopeCancels = []
		walk.ancestor(ast.program, {
			ImportDeclaration: (/**@type {import('estree').ImportDeclaration & import('acorn').Node}*/ node, ancestors) => {
				// console.log(node)
				node.specifiers.forEach(spec => {
					//@ts-ignore
					imports.set(spec.local.name, {path: node.source.value, type: spec.type, imported: spec.imported})
				})
				// ancestors[ancestors.length - 2].body = ancestors[ancestors.length - 2].body.filter(stat => stat != node)
			},
			Identifier: (/**@type {import('estree').Identifier & import('acorn').Node}*/ node) => {
				if (blockScopeCancels.flat().includes(node.name)) {
					return
				}
				else {
					let ref = imports.get(node.name)
					if (ref) {
						let code
						if(ref.type == 'ImportDefaultSpecifier') {
							code = /* js */`require('${ref.path}').default`
						} else if(ref.type == 'ImportNamespaceSpecifier') {
							code = /* js */`require('${ref.path}')`
						} else {
							//@ts-ignore
							code = /* js */`require('${ref.path}').${ref.imported.name}`
						}
						//@ts-ignore
						let val = acorn.parse(code, {ecmaVersion: 'latest'}).body[0].expression
						Object.assign(node, val)
					}
				}
			}
		})
		let newCode = recast.print(ast).code
		console.log(newCode)
		return {
			source: newCode,
			format: 'module',
		}
	} else {
		return nextLoad(url, context)
	}
}