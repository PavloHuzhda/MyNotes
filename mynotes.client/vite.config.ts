import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Продакшен + Docker-ready конфіг
export default defineConfig(({ mode }) => {
    // Підтягування env змінних
    const env = loadEnv(mode, process.cwd(), '');

    // API URL (можеш підлаштувати)
    const apiBaseUrl = env.VITE_API_BASE_URL ?? 'http://localhost:8083';

    return {
        plugins: [react()],

        resolve: {
            alias: {
                '@': '/src'
            }
        },

        server: {
            port: 8082,
            proxy: {
                '/api': {
                    target: apiBaseUrl,
                    changeOrigin: true,
                }
            }
        },

        preview: {
            port: 8082
        },

        build: {
            outDir: 'dist',
        },
    };
});
