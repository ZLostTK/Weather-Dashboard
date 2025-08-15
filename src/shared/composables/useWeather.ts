import { ref } from 'vue';
import { weatherService } from '@/shared/api/weatherService';
import type {
    WeatherData,
    ForecastData,
    WeatherAlert,
    SavedLocation,
} from '@/shared/types/weather';

export function useWeather() {
    const currentWeather = ref<WeatherData | null>(null);
    const forecast = ref<ForecastData | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const alerts = ref<WeatherAlert[]>([]);
    const savedLocations = ref<SavedLocation[]>([]);
    const currentLocation = ref<string>('London, UK');

    const apiKey = ref<string>('');

    // Load saved data from localStorage
    const loadSavedData = () => {
        const saved = localStorage.getItem('weather-dashboard');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                alerts.value = data.alerts || [];
                savedLocations.value = data.savedLocations || [];
                currentLocation.value = data.currentLocation || 'London, UK';
                apiKey.value = data.apiKey || '';

                if (apiKey.value) {
                    weatherService.setApiKey(apiKey.value);
                }
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    };

    // Save data to localStorage
    const saveData = () => {
        const data = {
            alerts: alerts.value,
            savedLocations: savedLocations.value,
            currentLocation: currentLocation.value,
            apiKey: apiKey.value,
        };

        try {
            localStorage.setItem('weather-dashboard', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    };

    const setApiKey = (key: string) => {
        apiKey.value = key;
        weatherService.setApiKey(key);
        saveData();
    };

    const fetchCurrentWeather = async (location: string = currentLocation.value) => {
        loading.value = true;
        error.value = null;

        try {
            if (apiKey.value) {
                currentWeather.value = await weatherService.getCurrentWeather(location);
            } else {
                // Use mock data for demo
                currentWeather.value = weatherService.getMockCurrentWeather();
            }
            currentLocation.value = location;
            saveData();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch weather data';
            console.error('Weather fetch error:', err);
        } finally {
            loading.value = false;
        }
    };

    const fetchForecast = async (location: string = currentLocation.value, days: number = 7) => {
        loading.value = true;
        error.value = null;

        try {
            if (apiKey.value) {
                forecast.value = await weatherService.getForecast(location, days);
            } else {
                // Use mock data for demo
                forecast.value = weatherService.getMockForecast();
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch forecast data';
            console.error('Forecast fetch error:', err);
        } finally {
            loading.value = false;
        }
    };

    const searchLocations = async (query: string) => {
        if (!apiKey.value) {
            // Return mock locations for demo
            return [
                {
                    name: 'London',
                    region: 'England',
                    country: 'United Kingdom',
                    lat: 51.52,
                    lon: -0.11,
                },
                { name: 'New York', region: 'New York', country: 'USA', lat: 40.71, lon: -74.01 },
                { name: 'Tokyo', region: 'Tokyo', country: 'Japan', lat: 35.69, lon: 139.69 },
            ];
        }

        try {
            return await weatherService.searchLocations(query);
        } catch (err) {
            console.error('Location search error:', err);
            return [];
        }
    };

    const addAlert = (alert: Omit<WeatherAlert, 'id' | 'createdAt'>) => {
        const newAlert: WeatherAlert = {
            ...alert,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        alerts.value.push(newAlert);
        saveData();
    };

    const removeAlert = (id: string) => {
        alerts.value = alerts.value.filter(alert => alert.id !== id);
        saveData();
    };

    const toggleAlert = (id: string) => {
        const alert = alerts.value.find(a => a.id === id);
        if (alert) {
            alert.isActive = !alert.isActive;
            saveData();
        }
    };

    const addSavedLocation = (location: {
        name: string;
        region?: string;
        country?: string;
        lat?: number;
        lon?: number;
    }) => {
        const newLocation: SavedLocation = {
            id: Date.now().toString(),
            name: location.name,
            isFavorite: false, // Default to not favorite
        };
        savedLocations.value.push(newLocation);
        saveData();
    };

    const removeSavedLocation = (id: string) => {
        savedLocations.value = savedLocations.value.filter(loc => loc.id !== id);
        saveData();
    };

    const toggleFavorite = (id: string) => {
        const location = savedLocations.value.find(loc => loc.id === id);
        if (location) {
            location.isFavorite = !location.isFavorite;
            saveData();
        } else {
            console.error('Location not found with id:', id);
        }
    };

    // Utility function to check localStorage state
    const checkLocalStorageState = () => {
        const saved = localStorage.getItem('weather-dashboard');
        if (saved) {
            const data = JSON.parse(saved);
            console.log('Current localStorage state:', {
                savedLocations: data.savedLocations?.length || 0,
                favorites:
                    data.savedLocations?.filter((loc: { isFavorite: boolean }) => loc.isFavorite)
                        ?.length || 0,
            });
        }
    };

    // Initialize
    loadSavedData();

    return {
        currentWeather,
        forecast,
        loading,
        error,
        alerts,
        savedLocations,
        currentLocation,
        apiKey,
        setApiKey,
        fetchCurrentWeather,
        fetchForecast,
        searchLocations,
        addAlert,
        removeAlert,
        toggleAlert,
        addSavedLocation,
        removeSavedLocation,
        toggleFavorite,
        checkLocalStorageState,
    };
}
