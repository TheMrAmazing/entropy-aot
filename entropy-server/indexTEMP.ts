import * as http from 'http'
import {hostDir} from './src/static'
// import './src/transformer'

async function start() {
    let urls = await hostDir()
    const server = http.createServer((req, res) => {
    

		if(req.url.endsWith('.html')) {
			res.setHeader('Content-Type', 'text/html')
		} else if (req.url.endsWith('.js')) {
			res.setHeader('Content-Type', 'text/javascript')
		} else if(req.url.endsWith('.css')) {
			res.setHeader('Content-Type', 'text/css')
		} else if (req.url.endsWith('.ttf')) {
			res.setHeader('Content-Type', 'application/x-font-ttf')
		} else {
			res.setHeader('Content-Type', 'text/html')
		}
    
//     //     if (req.method !== 'POST' || req.url !== '/user') {
//     //         res.statusCode = 405;
//     //         res.end('{"error":"METHOD_NOT_ALLOWED"}');
//     //     return;
//     //   }
    
//     //   let body = ''
    
//     //   req.on('data', (data) => {
//     //     // This function is called as chunks of body are received
//     //     body += data;
//     //   });
    
//     //   req.on('end', () => {
//     //     // This function is called once the body has been fully received
//     //     let parsed;
    
//     //     try {
//     //       parsed = JSON.parse(body);
//     //     } catch (e) {
//     //       res.statusCode = 400;
//     //       res.end('{"error":"CANNOT_PARSE"}')
//     //     }
let url
if(req.url == '/') {
	url = '/index.html'
} else {
	url = req.url
}
console.log(url)
let file = urls[url]
	if(file) {
		res.end(file)
	} else {
		res.end('')
	}
    //   })
    })
    
    server.listen(1337, () => {
      console.log('Server running at http://localhost:1337/');
    })

}
start()