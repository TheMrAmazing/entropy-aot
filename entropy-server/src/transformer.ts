import ts from 'typescript'

const formatHost: ts.FormatDiagnosticsHost = {
        getCanonicalFileName: path => path,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine
    }
    
function watchMain() {
    const configPath = ts.findConfigFile(
        /*searchPath*/ "./",
        ts.sys.fileExists,
        "tsconfig.json"
    )
    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.")
    }

    const createProgram = ts.createSemanticDiagnosticsBuilderProgram
    const host = ts.createWatchCompilerHost(
        configPath,
        {},
        ts.sys,
        createProgram,
        reportDiagnostic,
        reportWatchStatusChanged
    )

    const origCreateProgram = host.createProgram
        host.createProgram = (rootNames: ReadonlyArray<string>, options, host, oldProgram) => {
        console.log("** We're about to create the program! **")
        return origCreateProgram(rootNames, options, host, oldProgram)
    }
    const origPostProgramCreate = host.afterProgramCreate

    host.afterProgramCreate = program => {
        console.log("** We finished making the program! **")
        origPostProgramCreate!(program)
    }
    ts.createWatchProgram(host)
}
    
function reportDiagnostic(diagnostic: ts.Diagnostic) {
    console.error("Error", diagnostic.code, ":", ts.flattenDiagnosticMessageText( diagnostic.messageText, formatHost.getNewLine()))
}

function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
    console.info(ts.formatDiagnostic(diagnostic, formatHost))
}
    
watchMain()