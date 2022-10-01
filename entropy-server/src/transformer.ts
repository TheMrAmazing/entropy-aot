import ts from 'typescript'

export function extract(code: string) {
    const filename = "test.ts"
    
    const sourceFile = ts.createSourceFile(
        filename, code, ts.ScriptTarget.Latest
    )
    
    const transformerFactory: ts.TransformerFactory<ts.Node> = (
        context: ts.TransformationContext
    ) => {
        return (rootNode) => {
            function visit(node: ts.Node): ts.Node {
                node = ts.visitEachChild(node, visit, context)
                if(ts.isImportDeclaration(node)) {
                    let filename: string = (node.moduleSpecifier as any).text
                    if(filename.charAt(0) == '@') {
                        filename = filename.replace('@lib/', '/')
                    }
                    let literal = ts.factory.createStringLiteral(filename + '.js')
                    //@ts-ignore
                    node.moduleSpecifier = literal
                    return node
        
                } else {
                    return node;
                }
            }
            return ts.visitNode(rootNode, visit);
        }
    }
    
    const transformationResult = ts.transform(
        sourceFile, [transformerFactory]
    )
    
    const transformedSourceFile = transformationResult.transformed[0]
    const printer = ts.createPrinter()
    
    const result = printer.printNode(
        ts.EmitHint.Unspecified,
        transformedSourceFile,
        undefined
    )
    return result
}

