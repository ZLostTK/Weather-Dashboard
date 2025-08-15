import { vi } from 'vitest';

// Mock localStorage for tests
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock sessionStorage for tests
const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
});

// Mock fetch for tests
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
};

// Set up environment variables for tests
process.env.VITE_WEATHER_API_KEY = 'test-api-key';
process.env.VITE_API_BASE_URL = 'https://api.weatherapi.com/v1';
process.env.NODE_ENV = 'test';

// Mock import.meta.env for tests
Object.defineProperty(import.meta, 'env', {
    value: {
        VITE_WEATHER_API_KEY: 'test-api-key',
        VITE_API_BASE_URL: 'https://api.weatherapi.com/v1',
        NODE_ENV: 'test',
        DEV: false,
        VITE_DEBUG: 'false',
        VITE_APP_VERSION: '1.0.0',
        VITE_BUILD_DATE: '2024-01-01T00:00:00.000Z',
        VITE_API_TIMEOUT: '5000',
        VITE_API_RETRY_ATTEMPTS: '1',
        VITE_API_RETRY_DELAY: '100',
        VITE_CACHE_DURATION: '60000',
        VITE_ENABLE_ANALYTICS: 'false',
        VITE_ENABLE_ERROR_REPORTING: 'false',
        VITE_ENABLE_BETA_FEATURES: 'false',
        VITE_ENABLE_OFFLINE_MODE: 'true',
    },
    writable: true,
});
