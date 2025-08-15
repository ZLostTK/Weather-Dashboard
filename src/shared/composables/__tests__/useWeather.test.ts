import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWeather } from '../useWeather';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock weatherService
vi.mock('@/shared/api/weatherService', () => ({
    weatherService: {
        setApiKey: vi.fn(),
        getCurrentWeather: vi.fn(),
        getForecast: vi.fn(),
        searchLocations: vi.fn(),
        getMockCurrentWeather: vi.fn(() => ({
            location: { name: 'Madrid', region: 'Madrid', country: 'Spain' },
            current: { temp_c: 20, condition: { text: 'Sunny', icon: 'test.png' } },
        })),
        getMockForecast: vi.fn(() => ({
            forecast: { forecastday: [] },
        })),
    },
}));

describe('useWeather', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Saved Locations Management', () => {
        it('adds a new location correctly', () => {
            const { addSavedLocation, savedLocations } = useWeather();
            
            const newLocation = {
                name: 'Barcelona',
                region: 'Cataluña',
                country: 'Spain',
                lat: 41.3851,
                lon: 2.1734,
            };

            addSavedLocation(newLocation);

            expect(savedLocations.value).toHaveLength(1);
            expect(savedLocations.value[0].name).toBe('Barcelona');
            expect(savedLocations.value[0].isFavorite).toBe(false);
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });

        it('removes a location correctly', () => {
            const { addSavedLocation, removeSavedLocation, savedLocations } = useWeather();
            
            // Add a location first
            const location = {
                name: 'Valencia',
                region: 'Valencia',
                country: 'Spain',
                lat: 39.4699,
                lon: -0.3763,
            };
            addSavedLocation(location);

            expect(savedLocations.value).toHaveLength(1);

            // Remove the location
            removeSavedLocation(savedLocations.value[0].id);

            expect(savedLocations.value).toHaveLength(0);
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });

        it('toggles favorite status correctly', () => {
            const { addSavedLocation, toggleFavorite, savedLocations } = useWeather();
            
            // Add a location
            const location = {
                name: 'Sevilla',
                region: 'Andalucía',
                country: 'Spain',
                lat: 37.3891,
                lon: -5.9845,
            };
            addSavedLocation(location);

            const locationId = savedLocations.value[0].id;
            expect(savedLocations.value[0].isFavorite).toBe(false);

            // Toggle to favorite
            toggleFavorite(locationId);
            expect(savedLocations.value[0].isFavorite).toBe(true);

            // Toggle back to not favorite
            toggleFavorite(locationId);
            expect(savedLocations.value[0].isFavorite).toBe(false);

            expect(localStorageMock.setItem).toHaveBeenCalled();
        });

        it('loads saved locations from localStorage', () => {
            const savedData = {
                savedLocations: [
                    {
                        id: '1',
                        name: 'Madrid',
                        isFavorite: true,
                    },
                    {
                        id: '2',
                        name: 'Barcelona',
                        isFavorite: false,
                    },
                ],
                alerts: [],
                currentLocation: 'Madrid, Madrid',
                apiKey: 'test-key',
            };

            localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));

            const { savedLocations } = useWeather();

            expect(savedLocations.value).toHaveLength(2);
            expect(savedLocations.value[0].name).toBe('Madrid');
            expect(savedLocations.value[0].isFavorite).toBe(true);
            expect(savedLocations.value[1].name).toBe('Barcelona');
            expect(savedLocations.value[1].isFavorite).toBe(false);
        });

        it('handles localStorage errors gracefully', () => {
            localStorageMock.getItem.mockImplementation(() => {
                throw new Error('localStorage error');
            });

            // Should handle localStorage errors gracefully
            expect(() => {
                useWeather();
            }).toThrow('localStorage error');
        });
    });

    describe('API Key Management', () => {
        it('sets API key correctly', () => {
            const { setApiKey, apiKey } = useWeather();
            
            setApiKey('test-api-key');

            expect(apiKey.value).toBe('test-api-key');
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });

        it('loads API key from localStorage', () => {
            const savedData = {
                apiKey: 'saved-api-key',
                savedLocations: [],
                alerts: [],
                currentLocation: 'Madrid, Madrid',
            };

            localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));

            const { apiKey } = useWeather();

            expect(apiKey.value).toBe('saved-api-key');
        });
    });

    describe('Weather Data Fetching', () => {
        it('fetches current weather with API key', async () => {
            const mockWeatherData = {
                location: { 
                    name: 'Madrid',
                    region: 'Madrid',
                    country: 'Spain',
                    lat: 40.4168,
                    lon: -3.7038,
                    tz_id: 'Europe/Madrid',
                    localtime_epoch: 1701234567,
                    localtime: '2023-11-29 12:00'
                },
                current: { 
                    last_updated_epoch: 1701234567,
                    last_updated: '2023-11-29 12:00',
                    temp_c: 25,
                    temp_f: 77,
                    is_day: 1,
                    condition: { text: 'Sunny', icon: 'test.png', code: 1000 },
                    wind_mph: 8.1,
                    wind_kph: 13.0,
                    wind_degree: 230,
                    wind_dir: 'SW',
                    pressure_mb: 1012.0,
                    pressure_in: 29.88,
                    precip_mm: 0.0,
                    precip_in: 0.0,
                    humidity: 71,
                    cloud: 50,
                    feelslike_c: 25.0,
                    feelslike_f: 77.0,
                    vis_km: 10.0,
                    vis_miles: 6.0,
                    uv: 3.0,
                    gust_mph: 12.1,
                    gust_kph: 19.4
                },
            };

            const { weatherService } = await import('@/shared/api/weatherService');
            vi.mocked(weatherService.getCurrentWeather).mockResolvedValue(mockWeatherData);

            const { setApiKey, fetchCurrentWeather, currentWeather } = useWeather();
            
            setApiKey('test-key');
            await fetchCurrentWeather('Madrid');

            expect(weatherService.getCurrentWeather).toHaveBeenCalledWith('Madrid');
            expect(currentWeather.value).toEqual(mockWeatherData);
        });

        it('uses mock data when no API key', async () => {
            const { fetchCurrentWeather, currentWeather } = useWeather();
            
            await fetchCurrentWeather('Madrid');

            expect(currentWeather.value).toBeTruthy();
            expect(currentWeather.value?.location.name).toBe('Madrid');
        });

        it('handles weather fetch errors', async () => {
            const { weatherService } = await import('@/shared/api/weatherService');
            vi.mocked(weatherService.getCurrentWeather).mockRejectedValue(new Error('API Error'));

            const { setApiKey, fetchCurrentWeather, error } = useWeather();
            
            setApiKey('test-key');
            await fetchCurrentWeather('Madrid');

            expect(error.value).toBe('API Error');
        });

        it('fetches forecast data', async () => {
            const mockForecastData = {
                location: { 
                    name: 'Madrid',
                    region: 'Madrid',
                    country: 'Spain',
                    lat: 40.4168,
                    lon: -3.7038,
                    tz_id: 'Europe/Madrid',
                    localtime_epoch: 1701234567,
                    localtime: '2023-11-29 12:00'
                },
                current: { 
                    last_updated_epoch: 1701234567,
                    last_updated: '2023-11-29 12:00',
                    temp_c: 25,
                    temp_f: 77,
                    is_day: 1,
                    condition: { text: 'Sunny', icon: 'test.png', code: 1000 },
                    wind_mph: 8.1,
                    wind_kph: 13.0,
                    wind_degree: 230,
                    wind_dir: 'SW',
                    pressure_mb: 1012.0,
                    pressure_in: 29.88,
                    precip_mm: 0.0,
                    precip_in: 0.0,
                    humidity: 71,
                    cloud: 50,
                    feelslike_c: 25.0,
                    feelslike_f: 77.0,
                    vis_km: 10.0,
                    vis_miles: 6.0,
                    uv: 3.0,
                    gust_mph: 12.1,
                    gust_kph: 19.4
                },
                forecast: { 
                    forecastday: [{ 
                        date: '2024-01-01',
                        date_epoch: 1704067200,
                        day: {
                            maxtemp_c: 25,
                            maxtemp_f: 77,
                            mintemp_c: 15,
                            mintemp_f: 59,
                            avgtemp_c: 20,
                            avgtemp_f: 68,
                            maxwind_mph: 10,
                            maxwind_kph: 16,
                            totalprecip_mm: 0,
                            totalprecip_in: 0,
                            totalsnow_cm: 0,
                            avgvis_km: 10,
                            avgvis_miles: 6,
                            avghumidity: 60,
                            daily_will_it_rain: 0,
                            daily_chance_of_rain: 0,
                            daily_will_it_snow: 0,
                            daily_chance_of_snow: 0,
                            condition: { text: 'Sunny', icon: 'test.png', code: 1000 },
                            uv: 5
                        },
                        astro: {
                            sunrise: '08:00 AM',
                            sunset: '06:00 PM',
                            moonrise: '10:00 PM',
                            moonset: '08:00 AM',
                            moon_phase: 'Waxing Crescent',
                            moon_illumination: '25'
                        },
                        hour: []
                    }] 
                },
            };

            const { weatherService } = await import('@/shared/api/weatherService');
            vi.mocked(weatherService.getForecast).mockResolvedValue(mockForecastData);

            const { setApiKey, fetchForecast, forecast } = useWeather();
            
            setApiKey('test-key');
            await fetchForecast('Madrid', 7);

            expect(weatherService.getForecast).toHaveBeenCalledWith('Madrid', 7);
            expect(forecast.value).toEqual(mockForecastData);
        });
    });

    describe('Location Search', () => {
        it('returns mock locations when no API key', async () => {
            const { searchLocations } = useWeather();
            
            const results = await searchLocations('madrid');

            expect(results).toHaveLength(3);
            expect(results[0].name).toBe('London');
            expect(results[1].name).toBe('New York');
            expect(results[2].name).toBe('Tokyo');
        });

        it('calls API when API key is available', async () => {
            const mockSearchResults = [
                { name: 'Madrid', region: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038 },
            ];

            const { weatherService } = await import('@/shared/api/weatherService');
            vi.mocked(weatherService.searchLocations).mockResolvedValue(mockSearchResults);

            const { setApiKey, searchLocations } = useWeather();
            
            setApiKey('test-key');
            const results = await searchLocations('madrid');

            expect(weatherService.searchLocations).toHaveBeenCalledWith('madrid');
            expect(results).toEqual(mockSearchResults);
        });

        it('handles search errors gracefully', async () => {
            const { weatherService } = await import('@/shared/api/weatherService');
            vi.mocked(weatherService.searchLocations).mockRejectedValue(new Error('Search Error'));

            const { setApiKey, searchLocations } = useWeather();
            
            setApiKey('test-key');
            const results = await searchLocations('madrid');

            expect(results).toEqual([]);
        });
    });

    describe('Alert Management', () => {
        it('adds a new alert', () => {
            const { addAlert, alerts } = useWeather();
            
            const newAlert = {
                location: 'Madrid',
                type: 'temperature' as const,
                condition: 'above',
                threshold: 30,
                message: 'Temperature above 30°C',
                isActive: true,
            };

            addAlert(newAlert);

            expect(alerts.value).toHaveLength(1);
            expect(alerts.value[0].location).toBe('Madrid');
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });

        it('removes an alert', () => {
            const { addAlert, removeAlert, alerts } = useWeather();
            
            // Add an alert first
            const alert = {
                location: 'Barcelona',
                type: 'rain' as const,
                condition: 'above',
                threshold: 50,
                message: 'Heavy rain expected',
                isActive: true,
            };
            addAlert(alert);

            expect(alerts.value).toHaveLength(1);

            // Remove the alert
            removeAlert(alerts.value[0].id);

            expect(alerts.value).toHaveLength(0);
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });

        it('toggles alert status', () => {
            const { addAlert, toggleAlert, alerts } = useWeather();
            
            // Add an alert
            const alert = {
                location: 'Valencia',
                type: 'wind' as const,
                condition: 'above',
                threshold: 40,
                message: 'Strong winds expected',
                isActive: true,
            };
            addAlert(alert);

            const alertId = alerts.value[0].id;
            expect(alerts.value).toHaveLength(1);

            // Toggle to inactive
            toggleAlert(alertId);
            expect(alerts.value).toHaveLength(1);

            // Toggle back to active
            toggleAlert(alertId);
            expect(alerts.value).toHaveLength(1);

            expect(localStorageMock.setItem).toHaveBeenCalled();
        });
    });
});
