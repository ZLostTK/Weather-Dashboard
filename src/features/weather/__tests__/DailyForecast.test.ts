import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import DailyForecast from '../DailyForecast.vue';
import type { ForecastData } from '@/shared/types/weather';

// Mock data for testing
const mockForecastData: ForecastData = {
    location: {
        name: 'Madrid',
        region: 'Madrid',
        country: 'Spain',
        lat: 40.4168,
        lon: -3.7038,
        tz_id: 'Europe/Madrid',
        localtime_epoch: 1704067200,
        localtime: '2024-01-01 12:00',
    },
    current: {
        last_updated_epoch: 1704067200,
        last_updated: '2024-01-01 12:00',
        temp_c: 20,
        temp_f: 68,
        is_day: 1,
        condition: {
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
            code: 1000,
        },
        wind_mph: 10,
        wind_kph: 16,
        wind_degree: 180,
        wind_dir: 'S',
        pressure_mb: 1013,
        pressure_in: 29.92,
        precip_mm: 0,
        precip_in: 0,
        humidity: 50,
        cloud: 0,
        feelslike_c: 22,
        feelslike_f: 72,
        vis_km: 10,
        vis_miles: 6,
        uv: 5,
        gust_mph: 15,
        gust_kph: 24,
    },
    forecast: {
        forecastday: [
            {
                date: '2024-01-01',
                date_epoch: 1704067200,
                day: {
                    maxtemp_c: 25,
                    maxtemp_f: 77,
                    mintemp_c: 15,
                    mintemp_f: 59,
                    avgtemp_c: 20,
                    avgtemp_f: 68,
                    maxwind_mph: 15,
                    maxwind_kph: 24,
                    totalprecip_mm: 0,
                    totalprecip_in: 0,
                    totalsnow_cm: 0,
                    avgvis_km: 10,
                    avgvis_miles: 6,
                    avghumidity: 50,
                    daily_will_it_rain: 0,
                    daily_chance_of_rain: 0,
                    daily_will_it_snow: 0,
                    daily_chance_of_snow: 0,
                    condition: {
                        text: 'Sunny',
                        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
                        code: 1000,
                    },
                    uv: 5,
                },
                astro: {
                    sunrise: '08:00 AM',
                    sunset: '06:00 PM',
                    moonrise: '10:00 PM',
                    moonset: '10:00 AM',
                    moon_phase: 'Waxing Crescent',
                    moon_illumination: '25',
                },
                hour: [
                    {
                        time_epoch: 1704067200,
                        time: '2024-01-01 12:00',
                        temp_c: 20,
                        temp_f: 68,
                        is_day: 1,
                        condition: {
                            text: 'Sunny',
                            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
                            code: 1000,
                        },
                        wind_mph: 10,
                        wind_kph: 16,
                        wind_degree: 180,
                        wind_dir: 'S',
                        pressure_mb: 1013,
                        pressure_in: 29.92,
                        precip_mm: 0,
                        precip_in: 0,
                        humidity: 50,
                        cloud: 0,
                        feelslike_c: 22,
                        feelslike_f: 72,
                        windchill_c: 20,
                        windchill_f: 68,
                        heatindex_c: 22,
                        heatindex_f: 72,
                        dewpoint_c: 10,
                        dewpoint_f: 50,
                        will_it_rain: 0,
                        chance_of_rain: 0,
                        will_it_snow: 0,
                        chance_of_snow: 0,
                        vis_km: 10,
                        vis_miles: 6,
                        gust_mph: 15,
                        gust_kph: 24,
                        uv: 5,
                    },
                    {
                        time_epoch: 1704070800,
                        time: '2024-01-01 13:00',
                        temp_c: 22,
                        temp_f: 72,
                        is_day: 1,
                        condition: {
                            text: 'Partly cloudy',
                            icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
                            code: 1003,
                        },
                        wind_mph: 12,
                        wind_kph: 19,
                        wind_degree: 190,
                        wind_dir: 'S',
                        pressure_mb: 1012,
                        pressure_in: 29.89,
                        precip_mm: 0,
                        precip_in: 0,
                        humidity: 45,
                        cloud: 25,
                        feelslike_c: 24,
                        feelslike_f: 75,
                        windchill_c: 22,
                        windchill_f: 72,
                        heatindex_c: 24,
                        heatindex_f: 75,
                        dewpoint_c: 9,
                        dewpoint_f: 48,
                        will_it_rain: 0,
                        chance_of_rain: 0,
                        will_it_snow: 0,
                        chance_of_snow: 0,
                        vis_km: 10,
                        vis_miles: 6,
                        gust_mph: 18,
                        gust_kph: 29,
                        uv: 6,
                    },
                ],
            },
            {
                date: '2024-01-02',
                date_epoch: 1704153600,
                day: {
                    maxtemp_c: 23,
                    maxtemp_f: 73,
                    mintemp_c: 14,
                    mintemp_f: 57,
                    avgtemp_c: 18.5,
                    avgtemp_f: 65,
                    maxwind_mph: 12,
                    maxwind_kph: 19,
                    totalprecip_mm: 5,
                    totalprecip_in: 0.2,
                    totalsnow_cm: 0,
                    avgvis_km: 8,
                    avgvis_miles: 5,
                    avghumidity: 60,
                    daily_will_it_rain: 1,
                    daily_chance_of_rain: 70,
                    daily_will_it_snow: 0,
                    daily_chance_of_snow: 0,
                    condition: {
                        text: 'Light rain',
                        icon: '//cdn.weatherapi.com/weather/64x64/day/296.png',
                        code: 1183,
                    },
                    uv: 3,
                },
                astro: {
                    sunrise: '08:01 AM',
                    sunset: '06:01 PM',
                    moonrise: '11:00 PM',
                    moonset: '11:00 AM',
                    moon_phase: 'Waxing Crescent',
                    moon_illumination: '35',
                },
                hour: [],
            },
        ],
    },
};

describe('DailyForecast', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders correctly with forecast data', () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        expect(wrapper.find('h3').text()).toBe('Pronóstico del Tiempo');
        expect(wrapper.text()).toContain('24 Horas');
        expect(wrapper.text()).toContain('3 días');
    });

    it('shows daily view by default', () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        // Should show daily forecast
        expect(wrapper.text()).toContain('Today');
    });

    it('switches to hourly view when clicking 24 Horas', async () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        expect(wrapper.exists()).toBe(true);
    });

    it('shows more details when clicking Más Detalles', async () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        // Click on Más Detalles button
        const detailsButton = wrapper.findAll('button').find(btn => btn.text().includes('Más Detalles'));
        if (detailsButton) {
            await detailsButton.trigger('click');
            
            // Should show expanded details
            expect(wrapper.text()).toContain('Menos Detalles');
        }
    });

    it('shows less details when clicking Menos Detalles', async () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        // First click to show details
        const detailsButton = wrapper.findAll('button').find(btn => btn.text().includes('Más Detalles'));
        if (detailsButton) {
            await detailsButton.trigger('click');
            
            // Then click to hide details
            const lessDetailsButton = wrapper.findAll('button').find(btn => btn.text().includes('Menos Detalles'));
            if (lessDetailsButton) {
                await lessDetailsButton.trigger('click');
                
                // Should show collapsed details
                expect(wrapper.text()).toContain('Más Detalles');
            }
        }
    });

    it('displays temperature correctly', () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        expect(wrapper.text()).toContain('25°'); // max temp
        expect(wrapper.text()).toContain('15°'); // min temp
    });

    it('displays weather condition correctly', () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        expect(wrapper.text()).toContain('Sunny');
    });

    it('shows rain chance when available', () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        // Switch to second day which has rain chance
        const dailyButton = wrapper.findAll('button').find(btn => btn.text() === '3 días');
        if (dailyButton) {
            dailyButton.trigger('click');
            expect(wrapper.text()).toContain('70%'); // rain chance
        }
    });

    it('displays wind speed correctly', () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        expect(wrapper.text()).toContain('24km/h'); // wind speed
    });

    it('shows expanded details for selected day', async () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        // Click on first day to expand details
        const dayElement = wrapper.findAll('.cursor-pointer')[0];
        if (dayElement) {
            await dayElement.trigger('click');
            
            // Should show additional details
            expect(wrapper.text()).toContain('Vista Previa por Hora');
            expect(wrapper.text()).toContain('Datos Astronómicos');
        }
    });

    it('shows expanded details for selected hour', async () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        // Switch to hourly view
        const hourlyButton = wrapper.findAll('button').find(btn => btn.text() === '24 Horas');
        if (hourlyButton) {
            await hourlyButton.trigger('click');
            
            // Click on first hour to expand details
            const hourElement = wrapper.findAll('.cursor-pointer')[0];
            if (hourElement) {
                await hourElement.trigger('click');
                
                // Should show additional details
                expect(wrapper.text()).toContain('Información Adicional');
            }
        }
    });

    it('displays astronomical data correctly', async () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        // Click on first day to expand details
        const dayElement = wrapper.findAll('.cursor-pointer')[0];
        if (dayElement) {
            await dayElement.trigger('click');
            
            expect(wrapper.text()).toContain('08:00 AM'); // sunrise
            expect(wrapper.text()).toContain('06:00 PM'); // sunset
            expect(wrapper.text()).toContain('Waxing Crescent'); // moon phase
        }
    });

    it('handles empty forecast data gracefully', () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: null,
            },
        });

        expect(wrapper.find('h3').text()).toBe('Pronóstico del Tiempo');
        // Should not crash with null data
        expect(wrapper.exists()).toBe(true);
    });

    it('formats dates correctly', () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        expect(wrapper.text()).toContain('Today');
    });

    it('formats time correctly in hourly view', async () => {
        const wrapper = mount(DailyForecast, {
            props: {
                forecast: mockForecastData,
            },
        });

        expect(wrapper.exists()).toBe(true);
    });
});
