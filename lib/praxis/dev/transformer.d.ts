import ts from 'typescript';
export default function (program: ts.Program): (context: ts.TransformationContext) => (sourceFile: ts.SourceFile) => ts.SourceFile;
