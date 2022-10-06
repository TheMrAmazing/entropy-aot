import { watch, readdir, stat } from 'fs'

export function hotReload(dir: string) {
  	readdir(dir, (err, files) => {
		files.forEach(val => {
			let file = dir + '\\' + val 
			stat(file, (err, stats) => {
				if(stats.isDirectory()) {
					hotReload(file)
					watch(file,{}, (eventType: string, dirname: string) => {
						hotReload(file)	
					})
				}
				if(file.endsWith('.ts')) {
					watch(file, {}, (eventType: string, filename: string) => {
						Object.keys(require.cache).forEach(function(id) {
							if(id == file) {
								console.log('Reloading: ' + filename)
								delete require.cache[id]
							}
						})
					})
				}
			})

		})
	})
}
// const watcher = chokidar.watch('./');
//     watcher.on("ready", function() {
//         console.log('ready')
//       TangleServer.bootstrap().catch(console.error)
//       watcher.on("all", function(file, path) {
//         console.log(path)
//         console.log("Reloading server...");
//         Object.keys(require.cache).forEach(function(id) {
//           const localId = id.substr(process.cwd().length)
//           if(id.endsWith(path)) {
//             delete require.cache[id]
//           }
//         })
//         console.log("Server reloaded.")
//       })
//     })
  