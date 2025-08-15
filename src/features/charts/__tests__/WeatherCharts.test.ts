import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import WeatherCharts from '../WeatherCharts.vue';
import { THEMES, applyTheme } from '@/shared/constants/themes';

describe('WeatherCharts Theme Support', () => {
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
        
        const wrapper = mount(WeatherCharts, {
            props: {
                forecast: null
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
        
        const wrapper = mount(WeatherCharts, {
            props: {
                forecast: null
            }
        });

        // Verificar que el título use las clases correctas del tema oscuro
        const title = wrapper.find('h3');
        expect(title.classes()).toContain('text-card-foreground');
        
        // Verificar que los contenedores usen las clases correctas
        const containers = wrapper.findAll('.bg-card\\/5');
        expect(containers.length).toBeGreaterThan(0);
    });

    it('should use theme-aware text colors for statistics', () => {
        applyTheme(THEMES.LIGHT);
        
        const wrapper = mount(WeatherCharts, {
            props: {
                forecast: null
            }
        });

        // Verificar que las estadísticas usen colores del tema
        const statValues = wrapper.findAll('.text-card-foreground');
        const statLabels = wrapper.findAll('.text-muted-foreground');
        
        expect(statValues.length).toBeGreaterThan(0);
        expect(statLabels.length).toBeGreaterThan(0);
    });
});
