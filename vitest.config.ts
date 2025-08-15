import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        coverage: {
            reporter: ['text', 'html', 'lcov'],
            exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.config.*', 'dist/'],
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    define: {
        'import.meta.env.VITE_WEATHER_API_KEY': JSON.stringify('test-api-key'),
        'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://api.weatherapi.com/v1'),
        'import.meta.env.NODE_ENV': JSON.stringify('test'),
        'import.meta.env.VITE_DEBUG': JSON.stringify('false'),
        'import.meta.env.VITE_APP_VERSION': JSON.stringify('1.0.0'),
        'import.meta.env.VITE_BUILD_DATE': JSON.stringify('2024-01-01T00:00:00.000Z'),
        'import.meta.env.VITE_API_TIMEOUT': JSON.stringify('5000'),
        'import.meta.env.VITE_API_RETRY_ATTEMPTS': JSON.stringify('1'),
        'import.meta.env.VITE_API_RETRY_DELAY': JSON.stringify('100'),
        'import.meta.env.VITE_CACHE_DURATION': JSON.stringify('60000'),
        'import.meta.env.VITE_ENABLE_ANALYTICS': JSON.stringify('false'),
        'import.meta.env.VITE_ENABLE_ERROR_REPORTING': JSON.stringify('false'),
        'import.meta.env.VITE_ENABLE_BETA_FEATURES': JSON.stringify('false'),
        'import.meta.env.VITE_ENABLE_OFFLINE_MODE': JSON.stringify('true'),
    },
});
