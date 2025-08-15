// API Constants
export const API_CONFIG = {
    WEATHER_API: {
        BASE_URL: 'https://api.weatherapi.com/v1',
        ENDPOINTS: {
            CURRENT: '/current.json',
            FORECAST: '/forecast.json',
            SEARCH: '/search.json',
            HISTORY: '/history.json',
            ALERTS: '/alerts.json',
            MARINE: '/marine.json',
            IP: '/ip.json',
        },
        DEFAULT_PARAMS: {
            aqi: 'yes',
            alerts: 'yes',
        },
    },
    MAPS: {
        TILE_URL: 'https://maps.weatherapi.com/v1/statics',
        LAYERS: {
            TEMPERATURE: 'temp_new',
            PRECIPITATION: 'precipitation_new',
            CLOUDS: 'clouds_new',
            PRESSURE: 'pressure_new',
            WIND: 'wind_new',
        },
    },
} as const;

// UI Constants
export const UI_CONFIG = {
    BREAKPOINTS: {
        SM: 640,
        MD: 768,
        LG: 1024,
        XL: 1280,
        '2XL': 1536,
    },
    ANIMATIONS: {
        DURATION: {
            FAST: 150,
            NORMAL: 300,
            SLOW: 500,
        },
        EASING: {
            DEFAULT: 'ease-in-out',
            BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        },
    },
    CHART: {
        COLORS: {
            PRIMARY: '#3b82f6',
            SUCCESS: '#10b981',
            WARNING: '#f59e0b',
            DANGER: '#ef4444',
            INFO: '#06b6d4',
        },
        DEFAULT_HEIGHT: 300,
        RESPONSIVE_HEIGHT: {
            SM: 200,
            MD: 250,
            LG: 300,
            XL: 350,
        },
    },
} as const;

// Weather Constants
export const WEATHER_CONFIG = {
    UNITS: {
        TEMPERATURE: {
            CELSIUS: '°C',
            FAHRENHEIT: '°F',
        },
        SPEED: {
            KMH: 'km/h',
            MPH: 'mph',
        },
        PRESSURE: {
            MB: 'mb',
            INCH: 'in',
        },
        DISTANCE: {
            KM: 'km',
            MILES: 'miles',
        },
        PRECIPITATION: {
            MM: 'mm',
            INCH: 'in',
        },
    },
    CONDITIONS: {
        SUNNY: [1000],
        CLOUDY: [1003, 1006, 1009],
        RAINY: [
            1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240,
            1243, 1246, 1273, 1276, 1279, 1282,
        ],
        SNOWY: [
            1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252,
            1255, 1258, 1261, 1264,
        ],
    },
    THRESHOLDS: {
        TEMPERATURE: {
            COLD: 0,
            COOL: 10,
            MILD: 20,
            WARM: 30,
            HOT: 40,
        },
        WIND: {
            CALM: 5,
            LIGHT: 15,
            MODERATE: 30,
            STRONG: 50,
        },
        UV: {
            LOW: 2,
            MODERATE: 5,
            HIGH: 7,
            VERY_HIGH: 10,
        },
    },
    REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
    CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
} as const;

// App Constants
export const APP_CONFIG = {
    NAME: 'Weather Dashboard',
    VERSION: '1.0.0',
    DESCRIPTION: 'Professional weather dashboard with interactive maps and detailed forecasts',
    AUTHOR: 'Weather Dashboard Team',
    STORAGE_KEYS: {
        API_KEY: 'weather-api-key',
        USER_PREFERENCES: 'weather-preferences',
        SAVED_LOCATIONS: 'weather-locations',
        ALERTS: 'weather-alerts',
        THEME: 'weather-theme',
    },
    DEFAULT_LOCATION: {
        name: 'London',
        region: 'England',
        country: 'United Kingdom',
        lat: 51.5074,
        lon: -0.1278,
    },
    MAX_SAVED_LOCATIONS: 10,
    MAX_ALERTS: 20,
    SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de', 'it', 'pt'],
    DEFAULT_LANGUAGE: 'es',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    API: {
        NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
        INVALID_API_KEY: 'API key inválida. Verifica tu configuración.',
        RATE_LIMIT: 'Límite de requests excedido. Intenta más tarde.',
        LOCATION_NOT_FOUND: 'Ubicación no encontrada. Verifica el nombre.',
        SERVICE_UNAVAILABLE: 'Servicio temporalmente no disponible.',
    },
    VALIDATION: {
        REQUIRED_FIELD: 'Este campo es requerido.',
        INVALID_EMAIL: 'Email inválido.',
        INVALID_COORDINATES: 'Coordenadas inválidas.',
        INVALID_TEMPERATURE: 'Temperatura debe estar entre -100°C y 100°C.',
        INVALID_THRESHOLD: 'Umbral debe ser un número válido.',
    },
    GENERAL: {
        UNKNOWN_ERROR: 'Ha ocurrido un error inesperado.',
        PERMISSION_DENIED: 'Permisos insuficientes.',
        FEATURE_NOT_AVAILABLE: 'Funcionalidad no disponible.',
    },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    LOCATION_ADDED: 'Ubicación agregada exitosamente.',
    LOCATION_REMOVED: 'Ubicación eliminada exitosamente.',
    ALERT_CREATED: 'Alerta creada exitosamente.',
    ALERT_UPDATED: 'Alerta actualizada exitosamente.',
    SETTINGS_SAVED: 'Configuración guardada exitosamente.',
    DATA_REFRESHED: 'Datos actualizados exitosamente.',
} as const;

// Export all constants
export * from '../../core/router/routes';
export * from './themes';
