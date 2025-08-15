import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { THEMES, THEME_CSS_VARIABLES, applyTheme, getSystemTheme } from '../themes';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe('Theme System', () => {
    beforeEach(() => {
        // Limpiar las clases y estilos antes de cada test
        document.documentElement.classList.remove('dark');
        document.documentElement.removeAttribute('style');
    });

    afterEach(() => {
        // Limpiar después de cada test
        document.documentElement.classList.remove('dark');
        document.documentElement.removeAttribute('style');
    });

    describe('THEMES constants', () => {
        it('should have LIGHT, DARK, and AUTO themes', () => {
            expect(THEMES.LIGHT).toBe('LIGHT');
            expect(THEMES.DARK).toBe('DARK');
            expect(THEMES.AUTO).toBe('AUTO');
        });
    });

    describe('THEME_CSS_VARIABLES', () => {
        it('should have variables for LIGHT theme', () => {
            const lightTheme = THEME_CSS_VARIABLES[THEMES.LIGHT];
            expect(lightTheme).toBeDefined();
            expect(lightTheme['--background']).toBe('0 0% 98%');
            expect(lightTheme['--foreground']).toBe('240 10% 3.9%');
            expect(lightTheme['--card']).toBe('0 0% 100%');
            expect(lightTheme['--card-foreground']).toBe('240 10% 3.9%');
        });

        it('should have variables for DARK theme', () => {
            const darkTheme = THEME_CSS_VARIABLES[THEMES.DARK];
            expect(darkTheme).toBeDefined();
            expect(darkTheme['--background']).toBe('224 71% 4%');
            expect(darkTheme['--foreground']).toBe('213 31% 91%');
            expect(darkTheme['--card']).toBe('224 71% 4%');
            expect(darkTheme['--card-foreground']).toBe('213 31% 91%');
        });

        it('should have all required CSS variables for both themes', () => {
            const requiredVariables = [
                '--background', '--foreground', '--primary', '--primary-foreground',
                '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
                '--accent', '--accent-foreground', '--border', '--input', '--ring',
                '--card', '--card-foreground', '--popover', '--popover-foreground',
                '--destructive', '--destructive-foreground', '--success', '--success-foreground',
                '--warning', '--warning-foreground', '--info', '--info-foreground'
            ];

            const lightTheme = THEME_CSS_VARIABLES[THEMES.LIGHT];
            const darkTheme = THEME_CSS_VARIABLES[THEMES.DARK];

            requiredVariables.forEach(variable => {
                expect(lightTheme[variable as keyof typeof lightTheme]).toBeDefined();
                expect(darkTheme[variable as keyof typeof darkTheme]).toBeDefined();
            });
        });
    });

    describe('applyTheme', () => {
        it('should apply LIGHT theme correctly', () => {
            applyTheme(THEMES.LIGHT);
            
            expect(document.documentElement.classList.contains('dark')).toBe(false);
            
            const lightTheme = THEME_CSS_VARIABLES[THEMES.LIGHT];
            Object.entries(lightTheme).forEach(([property, value]) => {
                expect(document.documentElement.style.getPropertyValue(property)).toBe(value);
            });
        });

        it('should apply DARK theme correctly', () => {
            applyTheme(THEMES.DARK);
            
            expect(document.documentElement.classList.contains('dark')).toBe(true);
            
            const darkTheme = THEME_CSS_VARIABLES[THEMES.DARK];
            Object.entries(darkTheme).forEach(([property, value]) => {
                expect(document.documentElement.style.getPropertyValue(property)).toBe(value);
            });
        });

        it('should remove dark class when switching from DARK to LIGHT', () => {
            // Aplicar tema oscuro primero
            applyTheme(THEMES.DARK);
            expect(document.documentElement.classList.contains('dark')).toBe(true);
            
            // Cambiar a tema claro
            applyTheme(THEMES.LIGHT);
            expect(document.documentElement.classList.contains('dark')).toBe(false);
        });
    });

    describe('getSystemTheme', () => {
        it('should return LIGHT when system prefers light theme', () => {
            // Mock para tema claro
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: vi.fn().mockImplementation(query => ({
                    matches: false,
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    dispatchEvent: vi.fn(),
                })),
            });

            expect(getSystemTheme()).toBe('LIGHT');
        });

        it('should return DARK when system prefers dark theme', () => {
            // Mock para tema oscuro
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: vi.fn().mockImplementation(query => ({
                    matches: true,
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    dispatchEvent: vi.fn(),
                })),
            });

            expect(getSystemTheme()).toBe('DARK');
        });
    });
});
