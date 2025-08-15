import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ForecastChart from '../ForecastChart.vue';
import { THEMES, applyTheme } from '@/shared/constants/themes';

describe('ForecastChart Theme Support', () => {
    beforeEach(() => {
        // Limpiar antes de cada test
        document.documentElement.classList.remove('dark');
        document.documentElement.removeAttribute('style');
    });

    afterEach(() => {
        // Limpiar después de cada test
        document.documentElement.classList.remove('dark');
        document.documentElement.removeAttribute('style');
    });

    it('should render with light theme colors', () => {
        // Aplicar tema claro
        applyTheme(THEMES.LIGHT);
        
        const wrapper = mount(ForecastChart, {
            props: {
                forecast: null,
                loading: false
            }
        });

        // Verificar que el título use las clases correctas del tema claro
        const title = wrapper.find('h3');
        expect(title.classes()).toContain('text-card-foreground');
        
        // Verificar que los botones usen las clases correctas
        const buttons = wrapper.findAll('button');
        buttons.forEach(button => {
            const classes = button.classes();
            expect(classes.some(cls => 
                cls.includes('text-muted-foreground') || 
                cls.includes('text-foreground') || 
                cls.includes('bg-primary') ||
                cls.includes('bg-accent')
            )).toBe(true);
        });
    });

    it('should render with dark theme colors', () => {
        // Aplicar tema oscuro
        applyTheme(THEMES.DARK);
        
        const wrapper = mount(ForecastChart, {
            props: {
                forecast: null,
                loading: false
            }
        });

        // Verificar que el título use las clases correctas del tema oscuro
        const title = wrapper.find('h3');
        expect(title.classes()).toContain('text-card-foreground');
        
        // Verificar que el contenedor use las clases correctas
        const container = wrapper.find('.glass-card');
        expect(container.exists()).toBe(true);
    });

    it('should use theme-aware colors for loading state', () => {
        applyTheme(THEMES.LIGHT);
        
        const wrapper = mount(ForecastChart, {
            props: {
                forecast: null,
                loading: true
            }
        });

        // Verificar que el estado de carga use colores del tema
        const loadingText = wrapper.find('.text-muted-foreground');
        expect(loadingText.exists()).toBe(true);
    });

    it('should use theme-aware colors for demo state', () => {
        applyTheme(THEMES.LIGHT);
        
        const wrapper = mount(ForecastChart, {
            props: {
                forecast: null,
                loading: false
            }
        });

        // Verificar que el estado de demo use colores del tema
        const demoText = wrapper.find('.text-muted-foreground');
        expect(demoText.exists()).toBe(true);
    });
});
