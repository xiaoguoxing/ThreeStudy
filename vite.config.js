import {defineConfig} from 'vite'
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue'
export default defineConfig({
    server:{
        host:'0.0.0.0',
        port:1614
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    base: './',
    plugins: [vue()],
});
