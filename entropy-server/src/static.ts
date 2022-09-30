import ts from 'typescript'
import {readdir, readFile} from 'fs/promises'
import { resolve } from 'path'

async function getFiles(dir: string) {
    const dirents = await readdir(dir, { withFileTypes: true })
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name)
        return dirent.isDirectory() ? getFiles(res) : res
    }))
    return Array.prototype.concat(...files)
}

function tsCompile(source: string, options: ts.TranspileOptions = null): string {
    if (null === options) {
        options = { compilerOptions: { module: ts.ModuleKind.CommonJS }};
    }
    return ts.transpileModule(source, options).outputText;
}

export async function hostDir() {
    let tsconfig = (await readFile('tsconfig.json')).toString('utf8')
    let res = (await Promise.all([
        getFiles('entropy-client'),
        getFiles('lib')
    ])).flat() as string[]
    let rawfiles = await Promise.all(res.map(async path => [
        path.indexOf('entropy-client') ? 
        path.slice(path.indexOf('entropy-client') + 'entropy-client'.length) :
        path.slice(path.indexOf('lib') + 'lib'.length),
        (await readFile(path)).toString('utf8')
    ]))
    let program = ts.createProgram(res, JSON.parse(tsconfig))
    let emitResult = program.emit()

    let allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics)

    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!)
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
        } else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))
        }
      })

    let files = rawfiles.map(file => {
        let path = file[0]
        let content = file[1]
        if (path.endsWith('.ts')) {
            path = path.slice(0, path.length - 3) + '.js'
            console.log(ts.transpile)
            content = tsCompile(content, JSON.parse(tsconfig)).replaceAll(`'@lib/`, `'./`)
            return [path, content]
        } else {
            return file
        }
    })
    return Object.fromEntries(files)
}