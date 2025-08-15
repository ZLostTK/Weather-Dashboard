import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LocationManager from '../LocationManager.vue';
import { THEMES, applyTheme } from '@/shared/constants/themes';

// Mock the useWeather composable
vi.mock('@/shared/composables/useWeather', () => ({
    useWeather: () => ({
        searchLocations: vi.fn().mockResolvedValue([]),
        addSavedLocation: vi.fn(),
        removeSavedLocation: vi.fn(),
        toggleFavorite: vi.fn(),
        savedLocations: { value: [] },
    }),
}));

describe('LocationManager Theme Support', () => {
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
        
        const wrapper = mount(LocationManager);

        // Verificar que el título use las clases correctas del tema claro
        const title = wrapper.find('h3');
        expect(title.classes()).toContain('text-card-foreground');
        
        // Verificar que el input de búsqueda use las clases correctas
        const searchInput = wrapper.find('input');
        expect(searchInput.classes()).toContain('bg-input');
        expect(searchInput.classes()).toContain('text-foreground');
        expect(searchInput.classes()).toContain('border-border');
        
        // Verificar que el icono de búsqueda use las clases correctas
        const searchIcon = wrapper.find('.text-muted-foreground');
        expect(searchIcon.exists()).toBe(true);
    });

    it('should render with dark theme colors', () => {
        // Aplicar tema oscuro
        applyTheme(THEMES.DARK);
        
        const wrapper = mount(LocationManager);

        // Verificar que el título use las clases correctas del tema oscuro
        const title = wrapper.find('h3');
        expect(title.classes()).toContain('text-card-foreground');
        
        // Verificar que el input de búsqueda use las clases correctas
        const searchInput = wrapper.find('input');
        expect(searchInput.classes()).toContain('bg-input');
        expect(searchInput.classes()).toContain('text-foreground');
    });

    it('should use theme-aware colors for empty state', () => {
        applyTheme(THEMES.LIGHT);
        
        const wrapper = mount(LocationManager);

        // Verificar que el estado vacío use colores del tema
        const emptyStateIcon = wrapper.find('.text-muted-foreground\\/60');
        const emptyStateText = wrapper.find('.text-muted-foreground');
        
        expect(emptyStateIcon.exists()).toBe(true);
        expect(emptyStateText.exists()).toBe(true);
    });

    it('should use theme-aware colors for search results', () => {
        applyTheme(THEMES.LIGHT);
        
        const wrapper = mount(LocationManager);

        // Verificar que los elementos usen colores del tema
        const title = wrapper.find('h3');
        expect(title.classes()).toContain('text-card-foreground');
        
        const searchInput = wrapper.find('input');
        expect(searchInput.classes()).toContain('bg-input');
    });
});
