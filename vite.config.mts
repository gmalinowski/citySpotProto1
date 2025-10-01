import {defineConfig} from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

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
    ],
    build: {
        sourcemap: false,
    }
})
