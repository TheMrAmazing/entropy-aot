import { defineConfig } from 'vite';
import { resolve } from 'path';
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidml0ZS5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2aXRlLmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFnQixNQUFNLE1BQU0sQ0FBQTtBQUNqRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBRTlCLGVBQWUsWUFBWSxDQUFDO0lBQ3hCLE9BQU8sRUFBRTtRQUNMLEtBQUssRUFBRTtZQUNILEdBQUcsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQztTQUNuQztLQUNKO0lBQ0QsTUFBTSxFQUFFO1FBQ0osSUFBSSxFQUFFLElBQUk7UUFDVixLQUFLLEVBQUU7WUFDSCxNQUFNLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLHVCQUF1QjtnQkFDL0IsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLEVBQUUsRUFBRSxJQUFJO2FBQ1g7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsTUFBTSxFQUFFLHVCQUF1QjtnQkFDL0IsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLEVBQUUsRUFBRSxJQUFJO2FBQ1g7WUFDRCxpQkFBaUI7WUFDakIsdUNBQXVDO1lBQ3ZDLDBCQUEwQjtZQUMxQixlQUFlO1lBQ2YsSUFBSTtTQUNQO0tBQ0o7Q0FDSixDQUFDLENBQUEifQ==