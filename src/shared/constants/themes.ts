// Theme Constants
export const THEMES = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
  AUTO: 'AUTO',
} as const;

// Weather-based Theme Colors
export const WEATHER_THEMES = {
  SUNNY: {
    primary: '#f093fb',
    secondary: '#f5576c',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    text: '#ffffff',
    accent: '#fbbf24',
  },
  CLOUDY: {
    primary: '#667eea',
    secondary: '#764ba2',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text: '#ffffff',
    accent: '#a5b4fc',
  },
  RAINY: {
    primary: '#4facfe',
    secondary: '#00f2fe',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    text: '#ffffff',
    accent: '#38bdf8',
  },
  SNOWY: {
    primary: '#e0eafc',
    secondary: '#cfdef3',
    gradient: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
    text: '#1f2937',
    accent: '#e5e7eb',
  },
  NIGHT: {
    primary: '#2d1b69',
    secondary: '#11118c',
    gradient: 'linear-gradient(135deg, #2d1b69 0%, #11118c 100%)',
    text: '#ffffff',
    accent: '#6366f1',
  },
} as const;

// CSS Custom Properties for Themes - Optimizado para accesibilidad
export const THEME_CSS_VARIABLES = {
  [THEMES.LIGHT]: {
    '--background': '0 0% 98%',
    '--foreground': '240 10% 3.9%',
    '--primary': '221.2 83.2% 53.3%',
    '--primary-foreground': '210 40% 98%',
    '--secondary': '210 40% 96%',
    '--secondary-foreground': '240 5.9% 10%',
    '--muted': '210 40% 96%',
    '--muted-foreground': '215.4 16.3% 46.9%',
    '--accent': '210 40% 96%',
    '--accent-foreground': '240 5.9% 10%',
    '--border': '214.3 31.8% 91.4%',
    '--input': '214.3 31.8% 91.4%',
    '--ring': '221.2 83.2% 53.3%',
    '--card': '0 0% 100%',
    '--card-foreground': '240 10% 3.9%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '240 10% 3.9%',
    '--destructive': '0 84.2% 60.2%',
    '--destructive-foreground': '210 40% 98%',
    '--success': '142 76% 36%',
    '--success-foreground': '355 7% 97%',
    '--warning': '32 95% 44%',
    '--warning-foreground': '355 7% 97%',
    '--info': '199 89% 48%',
    '--info-foreground': '355 7% 97%',
  },
  [THEMES.DARK]: {
    '--background': '224 71% 4%',
    '--foreground': '213 31% 91%',
    '--primary': '210 40% 70%',
    '--primary-foreground': '224 71% 4%',
    '--secondary': '215 27.9% 16.9%',
    '--secondary-foreground': '210 40% 98%',
    '--muted': '215 27.9% 16.9%',
    '--muted-foreground': '217.9 10.6% 64.9%',
    '--accent': '215 27.9% 16.9%',
    '--accent-foreground': '210 40% 98%',
    '--border': '215 27.9% 16.9%',
    '--input': '215 27.9% 16.9%',
    '--ring': '216 34% 17%',
    '--card': '224 71% 4%',
    '--card-foreground': '213 31% 91%',
    '--popover': '224 71% 4%',
    '--popover-foreground': '213 31% 91%',
    '--destructive': '0 72% 51%',
    '--destructive-foreground': '210 40% 98%',
    '--success': '142 76% 50%',
    '--success-foreground': '224 71% 4%',
    '--warning': '32 95% 60%',
    '--warning-foreground': '224 71% 4%',
    '--info': '199 89% 60%',
    '--info-foreground': '224 71% 4%',
  },
} as const;

// Theme Utilities
export const getWeatherTheme = (condition: string, isDay: boolean) => {
  if (!isDay) return WEATHER_THEMES.NIGHT;
  
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
    return WEATHER_THEMES.SUNNY;
  }
  
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle') || lowerCondition.includes('shower')) {
    return WEATHER_THEMES.RAINY;
  }
  
  if (lowerCondition.includes('snow') || lowerCondition.includes('ice') || lowerCondition.includes('frost')) {
    return WEATHER_THEMES.SNOWY;
  }
  
  return WEATHER_THEMES.CLOUDY;
};

export const applyTheme = (theme: keyof typeof THEME_CSS_VARIABLES) => {
  const root = document.documentElement;
  const variables = THEME_CSS_VARIABLES[theme];
  
  // Aplicar las variables CSS personalizadas
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Agregar o quitar la clase dark según el tema
  if (theme === THEMES.DARK) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const getSystemTheme = (): 'LIGHT' | 'DARK' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT';
};
