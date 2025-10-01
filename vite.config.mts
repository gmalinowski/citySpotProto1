import {defineConfig} from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import {svelte} from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    plugins: [
        RubyPlugin({
            resolve: {
                extensions: ['.js', '.ts', '.svelte'],
            },
            envVars: {
                RAILS_ENV: process.env.RAILS_ENV || 'development'
            },
            envOptions: {
                defineOn: 'import.meta.env'
            },
        }),
        svelte()
    ],
    build: {
        sourcemap: false,
    }
})
