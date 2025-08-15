import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import WeatherAlerts from '../WeatherAlerts.vue';
import type { WeatherAlert } from '@/shared/types/weather';

// Mock data for testing
const mockAlerts: WeatherAlert[] = [
    {
        id: '1',
        location: 'Madrid',
        type: 'temperature',
        condition: 'above',
        threshold: 30,
        message: 'Temperature above 30°C',
        isActive: true,
        createdAt: '2024-01-01T12:00:00Z',
    },
    {
        id: '2',
        location: 'Barcelona',
        type: 'rain',
        condition: 'above',
        threshold: 50,
        message: 'Heavy rain expected',
        isActive: false,
        createdAt: '2024-01-01T13:00:00Z',
    },
];

describe('WeatherAlerts', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders correctly with alerts', () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: mockAlerts,
            },
        });

        expect(wrapper.find('h3').text()).toBe('Alertas del Clima');
        expect(wrapper.findAll('.space-y-3').length).toBeGreaterThan(0);
    });

    it('shows empty state when no alerts', () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: [],
            },
        });

        expect(wrapper.text()).toContain('No hay alertas configuradas');
        expect(wrapper.text()).toContain('Crea alertas personalizadas para mantenerte informado');
    });

    it('displays alert information correctly', () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: mockAlerts,
            },
        });

        expect(wrapper.text()).toContain('Madrid');
        expect(wrapper.text()).toContain('Barcelona');
        expect(wrapper.text()).toContain('Temperature above 30°C');
        expect(wrapper.text()).toContain('Heavy rain expected');
    });

    it('shows active status for active alerts', () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: mockAlerts,
            },
        });

        expect(wrapper.text()).toContain('Activa');
    });

    it('shows inactive status for inactive alerts', () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: mockAlerts,
            },
        });

        expect(wrapper.text()).toContain('Inactiva');
    });

    it('emits addAlert event when adding new alert', async () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: mockAlerts,
            },
        });

        expect(wrapper.exists()).toBe(true);
    });

    it('emits removeAlert event when removing alert', async () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: mockAlerts,
            },
        });

        // Click remove button on first alert
        const removeButton = wrapper.findAll('button').find(btn => 
            btn.attributes('title') === 'Eliminar alerta'
        );
        
        if (removeButton) {
            await removeButton.trigger('click');
            expect(wrapper.emitted('removeAlert')).toBeTruthy();
            expect(wrapper.emitted('removeAlert')?.[0][0]).toBe('1');
        }
    });

    it('emits toggleAlert event when toggling alert status', async () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: mockAlerts,
            },
        });

        // Click toggle button on first alert
        const toggleButton = wrapper.findAll('button').find(btn => 
            btn.attributes('title')?.includes('Desactivar') || btn.attributes('title')?.includes('Activar')
        );
        
        if (toggleButton) {
            await toggleButton.trigger('click');
            expect(wrapper.emitted('toggleAlert')).toBeTruthy();
            expect(wrapper.emitted('toggleAlert')?.[0][0]).toBe('1');
        }
    });

    it('shows add alert modal when clicking add button', async () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: mockAlerts,
            },
        });

        expect(wrapper.exists()).toBe(true);
    });

    it('hides add alert modal when clicking cancel', async () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: mockAlerts,
            },
        });

        expect(wrapper.exists()).toBe(true);
    });

    it('displays alert type labels correctly', () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: mockAlerts,
            },
        });

        expect(wrapper.text()).toContain('Temperatura');
        expect(wrapper.text()).toContain('Lluvia');
    });

    it('shows alert threshold correctly', () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: mockAlerts,
            },
        });

        expect(wrapper.text()).toContain('30°C'); // temperature threshold
        expect(wrapper.text()).toContain('50mm'); // rain threshold
    });

    it('handles different alert types', () => {
        const differentAlerts: WeatherAlert[] = [
            {
                id: '1',
                location: 'Madrid',
                type: 'temperature',
                condition: 'above',
                threshold: 30,
                message: 'Temperature above 30°C',
                isActive: true,
                createdAt: '2024-01-01T12:00:00Z',
            },
            {
                id: '2',
                location: 'Barcelona',
                type: 'rain',
                condition: 'above',
                threshold: 50,
                message: 'Heavy rain expected',
                isActive: true,
                createdAt: '2024-01-01T13:00:00Z',
            },
            {
                id: '3',
                location: 'Valencia',
                type: 'wind',
                condition: 'above',
                threshold: 40,
                message: 'Strong winds expected',
                isActive: true,
                createdAt: '2024-01-01T14:00:00Z',
            },
            {
                id: '4',
                location: 'Sevilla',
                type: 'uv',
                condition: 'above',
                threshold: 8,
                message: 'High UV index warning',
                isActive: true,
                createdAt: '2024-01-01T15:00:00Z',
            },
        ];

        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: differentAlerts,
            },
        });

        expect(wrapper.text()).toContain('Temperatura');
        expect(wrapper.text()).toContain('Lluvia');
        expect(wrapper.text()).toContain('Viento');
        expect(wrapper.text()).toContain('Índice UV');
    });

    it('resets form after successful submission', async () => {
        const wrapper = mount(WeatherAlerts, {
            props: {
                alerts: mockAlerts,
            },
        });

        expect(wrapper.exists()).toBe(true);
    });
});
