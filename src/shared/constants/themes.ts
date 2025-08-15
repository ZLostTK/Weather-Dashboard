// Theme Constants
export const THEMES = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
    AUTO: 'AUTO',
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
