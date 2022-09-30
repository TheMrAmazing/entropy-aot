import { defineConfig, ProxyOptions } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },
    server: {
        port: 3000,
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
            },
            // '/channel' : {
            //     target: 'http://localhost:3000',
            //     changeOrigin: true,
            //     ws: true
            // }
        }
    }
})
