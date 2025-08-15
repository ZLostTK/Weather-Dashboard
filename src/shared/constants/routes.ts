// Application Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  MAPS: '/maps',
  ALERTS: '/alerts',
  LOCATIONS: '/locations',
  SETTINGS: '/settings',
  ABOUT: '/about',
} as const;

// Route Names
export const ROUTE_NAMES = {
  HOME: 'home',
  DASHBOARD: 'dashboard',
  MAPS: 'maps',
  ALERTS: 'alerts',
  LOCATIONS: 'locations',
  SETTINGS: 'settings',
  ABOUT: 'about',
} as const;

// Route Metadata
export const ROUTE_META = {
  [ROUTE_NAMES.HOME]: {
    title: 'Inicio - Weather Dashboard',
    description: 'Dashboard meteorológico profesional',
    requiresAuth: false,
  },
  [ROUTE_NAMES.DASHBOARD]: {
    title: 'Dashboard - Weather Dashboard',
    description: 'Vista principal del dashboard meteorológico',
    requiresAuth: false,
  },
  [ROUTE_NAMES.MAPS]: {
    title: 'Mapas - Weather Dashboard',
    description: 'Mapas meteorológicos interactivos',
    requiresAuth: false,
  },
  [ROUTE_NAMES.ALERTS]: {
    title: 'Alertas - Weather Dashboard',
    description: 'Gestión de alertas meteorológicas',
    requiresAuth: false,
  },
  [ROUTE_NAMES.LOCATIONS]: {
    title: 'Ubicaciones - Weather Dashboard',
    description: 'Gestión de ubicaciones guardadas',
    requiresAuth: false,
  },
  [ROUTE_NAMES.SETTINGS]: {
    title: 'Configuración - Weather Dashboard',
    description: 'Configuración de la aplicación',
    requiresAuth: false,
  },
  [ROUTE_NAMES.ABOUT]: {
    title: 'Acerca de - Weather Dashboard',
    description: 'Información sobre la aplicación',
    requiresAuth: false,
  },
} as const;
