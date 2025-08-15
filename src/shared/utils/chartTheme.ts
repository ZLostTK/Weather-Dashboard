export interface ChartTheme {
    // Colors for datasets
    primary: string;
    secondary: string;
    destructive: string;
    warning: string;
    success: string;
    accent: string;
    
    // Colors for UI elements
    foreground: string;
    mutedForeground: string;
    border: string;
    background: string;
    card: string;
    popover: string;
    popoverForeground: string;
    
    // Colors for chart elements
    grid: string;
    text: string;
    pointBackground: string;
}

export const lightTheme: ChartTheme = {
    // Dataset colors
    primary: '#3b82f6', // blue-500
    secondary: '#8b5cf6', // violet-500
    destructive: '#ef4444', // red-500
    warning: '#f97316', // orange-500
    success: '#10b981', // emerald-500
    accent: '#06b6d4', // cyan-500
    
    // UI colors
    foreground: '#1f2937', // gray-800
    mutedForeground: '#6b7280', // gray-500
    border: '#e5e7eb', // gray-200
    background: '#ffffff', // white
    card: '#ffffff', // white
    popover: '#ffffff', // white
    popoverForeground: '#1f2937', // gray-800
    
    // Chart colors
    grid: '#e5e7eb', // gray-200
    text: '#6b7280', // gray-500
    pointBackground: '#ffffff', // white
};

export const darkTheme: ChartTheme = {
    // Dataset colors
    primary: '#60a5fa', // blue-400
    secondary: '#a78bfa', // violet-400
    destructive: '#f87171', // red-400
    warning: '#fb923c', // orange-400
    success: '#34d399', // emerald-400
    accent: '#22d3ee', // cyan-400
    
    // UI colors
    foreground: '#f9fafb', // gray-50
    mutedForeground: '#9ca3af', // gray-400
    border: '#374151', // gray-700
    background: '#111827', // gray-900
    card: '#1f2937', // gray-800
    popover: '#111827', // gray-900
    popoverForeground: '#f9fafb', // gray-50
    
    // Chart colors
    grid: '#374151', // gray-700
    text: '#9ca3af', // gray-400
    pointBackground: '#1f2937', // gray-800
};

export function getChartTheme(): ChartTheme {
    const isDarkMode = document.documentElement.classList.contains('dark');
    return isDarkMode ? darkTheme : lightTheme;
}

export function getChartColors() {
    const theme = getChartTheme();
    
    return {
        // Dataset colors
        primary: theme.primary,
        secondary: theme.secondary,
        destructive: theme.destructive,
        warning: theme.warning,
        success: theme.success,
        accent: theme.accent,
        info: theme.accent, // alias for accent
        violet: theme.secondary, // alias for secondary
        
        // Background colors with opacity
        primaryBg: `${theme.primary}1a`, // 10% opacity
        secondaryBg: `${theme.secondary}1a`, // 10% opacity
        destructiveBg: `${theme.destructive}1a`, // 10% opacity
        
        // UI colors
        foreground: theme.foreground,
        mutedForeground: theme.mutedForeground,
        border: theme.border,
        background: theme.background,
        card: theme.card,
        popover: theme.popover,
        popoverForeground: theme.popoverForeground,
        popoverBackground: theme.popover, // alias
        mutedText: theme.mutedForeground, // alias
        
        // Chart colors
        grid: theme.grid,
        text: theme.text,
        pointBackground: theme.pointBackground,
    };
}
