import ts from 'typescript'
export default function (program) {
	const checker = program.getTypeChecker()
	return (context) => {
		return (sourceFile) => {
			const namedImports = new Map()
			const asNamedImports = new Map()
			const namespaceImports = new Map()
			const defaultImports = new Map()
			let blockScopeCancels = []
			const keys = () => [...namedImports.keys(), ...defaultImports.keys(), ...namespaceImports.keys(), ...asNamedImports.keys()]
			const visitor = (node) => {
				if (ts.isImportDeclaration(node)) {
					let filename = node.moduleSpecifier.text
					if (node.importClause) {
						if (ts.isNamedImports(node.importClause.getChildAt(0))) {
							node.importClause.namedBindings.forEachChild((element) => {
								//@ts-ignore
								if (element.propertyName) {
									//@ts-ignore
									asNamedImports.set(element.name.escapedText, [element.propertyName.escapedText, filename])
								}
								else {
									//@ts-ignore
									namedImports.set(element.name.escapedText, filename)
								}
							})
						}
						else if (ts.isNamespaceImport(node.importClause.getChildAt(0))) {
							//@ts-ignore
							namespaceImports.set(node.importClause.getChildAt(0).name.escapedText, filename)
						}
						else if (ts.isIdentifier(node.importClause.getChildAt(0))) {
							//@ts-ignore
							defaultImports.set(node.importClause.name.escapedText, filename)
						}
					}
					return node
				}
				if (ts.isTypeReferenceNode(node)) {
					return node
				}
				if (node.parent && ts.isPropertyAccessExpression(node.parent)) {
					if (node.parent.getChildAt(0) != node) {
						return node
					}
				}
				if (node.parent && ts.isVariableDeclaration(node.parent)) {
					if (node.parent.getChildAt(0) == node) {
						if (keys().includes(node.escapedText)) {
							blockScopeCancels[blockScopeCancels.length - 1].push(node.escapedText)
						}
					}
				}
				if (node.parent && ts.isPropertyDeclaration(node.parent)) {
					if (node.parent.getChildAt(0) == node) {
						if (keys().includes(node.escapedText)) {
							blockScopeCancels[blockScopeCancels.length - 1].push(node.escapedText)
						}
					}
				}
				if (ts.isClassDeclaration(node)) {
					blockScopeCancels.push([])
					let blockNode = ts.visitEachChild(node, visitor, context)
					blockScopeCancels.pop()
					return blockNode
				}
				if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
					blockScopeCancels.push([])
					node.parameters.forEach((parameter => {
						//@ts-ignore
						if (keys().includes(parameter.name.escapedText)) {
							//@ts-ignore
							blockScopeCancels[blockScopeCancels.length - 1].push(parameter.name.escapedText)
						}
					}))
					let funNode = ts.visitEachChild(node, visitor, context)
					blockScopeCancels.pop()
					return funNode
				}
				if (ts.isBlock(node)) {
					blockScopeCancels.push([])
					let blockNode = ts.visitEachChild(node, visitor, context)
					blockScopeCancels.pop()
					return blockNode
				}
				if (node.parent && ts.isParameter(node.parent)) {
					return node
				}
				if (ts.isIdentifier(node)) {
					let identifier = node.escapedText
					if (blockScopeCancels.flat().includes(identifier)) {
						return node
					}
					else {
						let res
						if (defaultImports.get(identifier)) {
							res = ts.factory.createCallExpression(ts.factory.createIdentifier('require'), undefined, [ts.factory.createStringLiteral(defaultImports.get(identifier))])
							return res
						}
						if (namespaceImports.get(identifier)) {
							res = ts.factory.createCallExpression(ts.factory.createIdentifier('require'), undefined, [ts.factory.createStringLiteral(namespaceImports.get(identifier))])
							return res
						}
						if (namedImports.get(identifier)) {
							res = ts.factory.createPropertyAccessExpression(ts.factory.createCallExpression(ts.factory.createIdentifier('require'), undefined, [ts.factory.createStringLiteral(namedImports.get(identifier))]), node)
							return res
						}
						if (asNamedImports.get(identifier)) {
							res = ts.factory.createPropertyAccessExpression(ts.factory.createCallExpression(ts.factory.createIdentifier('require'), undefined, [ts.factory.createStringLiteral(asNamedImports.get(identifier)[1])]), ts.factory.createIdentifier(asNamedImports.get(identifier)[0]))
							return res
						}
					}
					return node
				}
				return ts.visitEachChild(node, visitor, context)
			}
			return ts.visitNode(sourceFile, visitor)
		}
	}
}
