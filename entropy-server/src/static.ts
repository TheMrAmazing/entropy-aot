import ts from 'typescript'
import {readdir, readFile} from 'fs/promises'
import { resolve } from 'path'
import {extract} from './transformer'

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
    return ts.transpileModule(extract(source), options).outputText;
}

export async function hostDir() {
    let tsconfig = (await readFile('tsconfig.json')).toString('utf8')
    let res = (await Promise.all([
        getFiles('entropy-client'),
        getFiles('lib')
    ])).flat() as string[]
    let rawfiles = await Promise.all(res.map(async path => [
        path.indexOf('entropy-client') > 0 ? 
        path.slice(path.indexOf('entropy-client') + 'entropy-client'.length) :
        path.slice(path.indexOf('entropy-aot/lib') + 'entropy-aot/lib'.length),
        (await readFile(path)).toString('utf8')
    ]))

    let files = rawfiles.map(file => {
        let path = file[0]
        let content = file[1]
        console.log(file[0])
        if (path.endsWith('.ts')) {
            path = path.slice(0, path.length - 3) + '.js'
            content = tsCompile(content, JSON.parse(tsconfig))
            return [path, content]
        } else {
            return file
        }
    })
    return Object.fromEntries(files)
}