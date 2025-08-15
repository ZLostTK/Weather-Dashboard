// Environment Configuration
interface EnvironmentConfig {
    API_KEY: string;
    API_BASE_URL: string;
    MAP_API_KEY: string;
    ENVIRONMENT: 'development' | 'production' | 'test';
    DEBUG: boolean;
    VERSION: string;
    BUILD_DATE: string;
}

// Get environment variables with fallbacks
const getEnvVar = (key: string, defaultValue = ''): string => {
    return import.meta.env[key] || defaultValue;
};

// Environment configuration
export const env: EnvironmentConfig = {
    API_KEY: getEnvVar('VITE_WEATHER_API_KEY', 'demo'),
    API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'https://api.weatherapi.com/v1'),
    MAP_API_KEY: getEnvVar('VITE_MAP_API_KEY', ''),
    ENVIRONMENT: (getEnvVar('NODE_ENV') as 'development' | 'production' | 'test') || 'development',
    DEBUG: getEnvVar('VITE_DEBUG') === 'true' || import.meta.env.DEV,
    VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    BUILD_DATE: getEnvVar('VITE_BUILD_DATE', new Date().toISOString()),
};

// Validation
const validateEnv = () => {
    const errors: string[] = [];

    // Check for required environment variables in production
    if (env.ENVIRONMENT === 'production') {
        if (!env.API_KEY || env.API_KEY === 'demo') {
            errors.push('VITE_WEATHER_API_KEY is required in production');
        }
    }

    if (errors.length > 0) {
        console.error('Environment validation errors:', errors);
        if (env.ENVIRONMENT === 'production') {
            throw new Error(`Environment validation failed: ${errors.join(', ')}`);
        }
    }
};

// Run validation
validateEnv();

// Environment utilities
export const isDevelopment = () => env.ENVIRONMENT === 'development';
export const isProduction = () => env.ENVIRONMENT === 'production';
export const isTest = () => env.ENVIRONMENT === 'test';
export const isDebug = () => env.DEBUG;

// Feature flags
export const FEATURE_FLAGS = {
    ENABLE_ANALYTICS: getEnvVar('VITE_ENABLE_ANALYTICS') === 'true',
    ENABLE_ERROR_REPORTING: getEnvVar('VITE_ENABLE_ERROR_REPORTING') === 'true',
    ENABLE_BETA_FEATURES: getEnvVar('VITE_ENABLE_BETA_FEATURES') === 'true',
    ENABLE_OFFLINE_MODE: getEnvVar('VITE_ENABLE_OFFLINE_MODE') === 'true',
} as const;

// API Configuration
export const API_CONFIG = {
    TIMEOUT: parseInt(getEnvVar('VITE_API_TIMEOUT', '10000')),
    RETRY_ATTEMPTS: parseInt(getEnvVar('VITE_API_RETRY_ATTEMPTS', '3')),
    RETRY_DELAY: parseInt(getEnvVar('VITE_API_RETRY_DELAY', '1000')),
    CACHE_DURATION: parseInt(getEnvVar('VITE_CACHE_DURATION', '300000')), // 5 minutes
} as const;

export default env;
