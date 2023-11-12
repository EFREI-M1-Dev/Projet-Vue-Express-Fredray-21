import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            buffer: 'buffer/',
            util: "util/",
            stream: "stream-browserify",
            events: "events/",
            crypto: "crypto-browserify",
        }
    },
    define: {
        process: {
            env: {},
        },
        global: {},
    },
})
