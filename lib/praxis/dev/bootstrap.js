import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { readFileSync } from 'fs'
import { createServer as createHttpServer } from 'http'
import { createServer as createHttpsServer } from 'https'
import { join, normalize } from 'path'
import { connect } from './sockets'
import { attachWebhook } from './cloudflare'
export let tangleServer
export class TangleServer {
	server
	app
	io
	constructor(app, server, io) {
		this.app = app
		this.server = server
		this.io = io
	}
	static async bootstrap() {
		await attachWebhook()
		return new Promise((res, rej) => {
			try {
				if (!tangleServer) {
					let app = express()
					app.use(cors({ origin: '*' }))
					app.use(cookieParser(process.env.JWT_SECRET))
					app.use('/', express.static(join(__dirname, 'site')))
					app.use((req, res, next) => {
						require('./router')(req, res, next)
					})
					let server
					if (process.env.SSL_CERT_PATH && process.env.SSL_KEY_PATH) {
						server = createHttpsServer({
							cert: readFileSync(normalize(process.env.SSL_CERT_PATH)),
							key: readFileSync(normalize(process.env.SSL_KEY_PATH))
						}, app)
					}
					else {
						server = createHttpServer(app)
					}
					let io = connect(server)
					let _tangleServer = new TangleServer(app, server, io)
					let port = process.env.PORT ? parseInt(process.env.PORT) : 3000
					server.listen(port, () => {
						console.log(`server started on port ${port}`)
						tangleServer = _tangleServer
						res(tangleServer)
					})
				}
				else {
					res(tangleServer)
				}
			}
			catch (error) {
				rej(error)
			}
		})
	}
}
ts.factory.createPropertyAccessChain(ts.factory.create(ts.factory.createToken(ts.SyntaxKind.ImportKeyword), undefined, [ts.createStringLiteral(map.get(identifier))]), ts.createIdentifier(identifier))
