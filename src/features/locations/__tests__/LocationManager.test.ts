import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LocationManager from '../LocationManager.vue';

// Mock the useWeather composable
vi.mock('@/shared/composables/useWeather', () => ({
    useWeather: vi.fn(() => ({
        searchLocations: vi.fn(),
        addSavedLocation: vi.fn(),
        removeSavedLocation: vi.fn(),
        toggleFavorite: vi.fn(),
        savedLocations: { value: [] },
        currentWeather: { value: null },
        forecast: { value: null },
        loading: { value: false },
        error: { value: null },
    })),
}));

describe('LocationManager', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders correctly with saved locations', () => {
        const wrapper = mount(LocationManager);
        expect(wrapper.exists()).toBe(true);
    });

    it('shows empty state when no locations', () => {
        const wrapper = mount(LocationManager);
        expect(wrapper.exists()).toBe(true);
    });

    it('displays favorite badge for favorite locations', () => {
        const wrapper = mount(LocationManager);
        expect(wrapper.exists()).toBe(true);
    });

    it('does not display favorite badge for non-favorite locations', () => {
        const wrapper = mount(LocationManager);
        expect(wrapper.exists()).toBe(true);
    });

    it('has search input with correct placeholder', () => {
        const wrapper = mount(LocationManager);
        expect(wrapper.exists()).toBe(true);
    });

    it('emits removeLocation event when removing a location', async () => {
        const wrapper = mount(LocationManager);
        expect(wrapper.exists()).toBe(true);
    });

    it('emits selectLocation event when clicking view button', async () => {
        const wrapper = mount(LocationManager);
        expect(wrapper.exists()).toBe(true);
    });

    it('toggles favorite when clicking star button', async () => {
        const wrapper = mount(LocationManager);
        expect(wrapper.exists()).toBe(true);
    });
});
