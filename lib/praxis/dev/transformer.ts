import ts from 'typescript'

const namedImports:Map<string, string> = new Map()
const defaultImports:Map<string, string> = new Map()

export default function (program: ts.Program) {
    const checker = program.getTypeChecker()
    return (context: ts.TransformationContext) => {
      return (sourceFile: ts.SourceFile) => {
        const visitor = (node) => {
			if(ts.isImportDeclaration(node)) {
            	let filename: string = (node.moduleSpecifier as any).text
				let importName = node.importClause?.name?.escapedText
              	if(importName) {
                	defaultImports.set(importName, filename)
                }
              	node.importClause.namedBindings?.forEachChild(element => {
					namedImports.set(element.getText(), filename)
              	})
                return node
            }
			if(ts.isTypeReferenceNode) {
				return node
			}
            if(ts.isIdentifier(node)) {
               	if(namedImports.get(node.getText()) || defaultImports.get(node.getText())) {
              		let identifier = node.getText()
                    let res
                    if (defaultImports.get(identifier)) {
                    	res = ts.factory.createPropertyAccessExpression(
							ts.factory.createCallExpression(
								ts.factory.createIdentifier('require'),
								// //@ts-ignore
								// ts.factory.createToken(ts.SyntaxKind.ImportKeyword),
								undefined,
								[ts.factory.createStringLiteral(defaultImports.get(identifier))]
							), 
							ts.factory.createIdentifier('default')
						)
						console.log(node.getText())
                      	return res
                    }
                    if (namedImports.get(identifier)) {
                    	res = ts.factory.createPropertyAccessExpression(
								ts.factory.createCallExpression(
									ts.factory.createIdentifier('require'),
									//@ts-ignore
							  		// ts.factory.createToken(ts.SyntaxKind.ImportKeyword),
                        			undefined,
                            	[ts.factory.createStringLiteral(namedImports.get(identifier))]
                        	), 
                        	node
              			)
						console.log(node.getText())
                      	return res
                    }
              		
            	}
            }
            return ts.visitEachChild(node, visitor, context)
        }
        return ts.visitNode(sourceFile, visitor)
      }
    }
  }
  