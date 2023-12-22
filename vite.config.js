import {defineConfig} from 'vite'
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import {glslify} from 'vite-plugin-glslify'

export default defineConfig({
    server:{
        host:'0.0.0.0',
        port:1614
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@static': fileURLToPath(new URL('public', import.meta.url))
        },
    },
    base: './',
    plugins: [vue(),glslify()],
    assetsInclude:['**/*.glb']
});
