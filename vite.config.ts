import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
    server: {
        proxy: {
            // 设置你需要跨域的请求地址
            '/api': {
                target: 'http://192.168.126.1:4000/', // 替换成你的API地址
                changeOrigin: true
            },
        },
    }
})
