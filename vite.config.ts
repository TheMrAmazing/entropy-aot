import { defineConfig, ProxyOptions } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },
    root:'./entropy-client',
    server: {
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://localhost:1337',
                changeOrigin: true,
                ws: true
            },
            '/assets': {
                target: 'http://localhost:1337',
                changeOrigin: true,
                ws: true
            }
        }
    }
})
