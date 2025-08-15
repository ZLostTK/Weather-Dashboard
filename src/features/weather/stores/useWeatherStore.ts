import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { WeatherData, ForecastData } from '@/shared/types/weather';
import { weatherService } from '@/shared/api/weatherService';
import { WEATHER_CONFIG } from '@/shared/constants';
import { useAppStore } from '@/shared/stores/useAppStore';

export const useWeatherStore = defineStore('weather', () => {
  const appStore = useAppStore();

  // State
  const currentWeather = ref<WeatherData | null>(null);
  const forecast = ref<ForecastData | null>(null);
  const loading = ref(false);
  const lastUpdated = ref<Date | null>(null);
  const selectedLocation = ref<string>('London, UK');

  // Cache
  const cache = ref(new Map<string, { data: WeatherData | ForecastData; timestamp: number }>());

  // Getters
  const isDataStale = computed(() => {
    if (!lastUpdated.value) return true;
    const now = Date.now();
    const updateTime = lastUpdated.value.getTime();
    return (now - updateTime) > WEATHER_CONFIG.REFRESH_INTERVAL;
  });

  const currentCondition = computed(() => {
    if (!currentWeather.value) return null;
    return weatherService.getWeatherConditionType(currentWeather.value.current.condition.code);
  });

  const weatherSummary = computed(() => {
    if (!currentWeather.value) return null;
    
    const { current } = currentWeather.value;
    return {
      temperature: Math.round(current.temp_c),
      condition: current.condition.text,
      humidity: current.humidity,
      windSpeed: Math.round(current.wind_kph),
      windDirection: current.wind_dir,
      pressure: Math.round(current.pressure_mb),
      visibility: Math.round(current.vis_km),
      uv: current.uv,
      feelsLike: Math.round(current.feelslike_c),
    };
  });

  // Cache utilities
  const getCacheKey = (location: string, type: 'current' | 'forecast') => {
    return `${type}:${location}`;
  };

  const isCacheValid = (timestamp: number) => {
    return (Date.now() - timestamp) < WEATHER_CONFIG.CACHE_DURATION;
  };

  const getFromCache = (key: string) => {
    const cached = cache.value.get(key);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    return null;
  };

  const setCache = (key: string, data: WeatherData | ForecastData) => {
    cache.value.set(key, {
      data,
      timestamp: Date.now(),
    });
  };

  // Actions
  const fetchCurrentWeather = async (location: string = selectedLocation.value, useCache = true) => {
    const cacheKey = getCacheKey(location, 'current');
    
    if (useCache) {
      const cached = getFromCache(cacheKey);
      if (cached) {
        currentWeather.value = cached as WeatherData;
        return cached;
      }
    }

    loading.value = true;
    appStore.setError(null);

    try {
      let data: WeatherData;
      
      if (weatherService.apiKey && weatherService.apiKey !== 'demo') {
        data = await weatherService.getCurrentWeather(location);
      } else {
        data = weatherService.getMockCurrentWeather();
      }

      currentWeather.value = data;
      selectedLocation.value = location;
      lastUpdated.value = new Date();
      
      setCache(cacheKey, data);
      
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching weather data';
      appStore.setError(message);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fetchForecast = async (location: string = selectedLocation.value, days = 7, useCache = true) => {
    const cacheKey = getCacheKey(location, 'forecast');
    
    if (useCache) {
      const cached = getFromCache(cacheKey);
      if (cached) {
        forecast.value = cached as ForecastData;
        return cached;
      }
    }

    loading.value = true;
    appStore.setError(null);

    try {
      let data: ForecastData;
      
      if (weatherService.apiKey && weatherService.apiKey !== 'demo') {
        data = await weatherService.getForecast(location, days);
      } else {
        data = weatherService.getMockForecast();
      }

      forecast.value = data;
      lastUpdated.value = new Date();
      
      setCache(cacheKey, data);
      
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching forecast data';
      appStore.setError(message);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const refreshWeatherData = async (location?: string) => {
    const targetLocation = location || selectedLocation.value;
    
    await Promise.all([
      fetchCurrentWeather(targetLocation, false),
      fetchForecast(targetLocation, 7, false),
    ]);
  };

  const setLocation = (location: string) => {
    selectedLocation.value = location;
  };

  const setApiKey = (apiKey: string) => {
    weatherService.setApiKey(apiKey);
    // Clear cache when API key changes
    cache.value.clear();
  };

  const clearCache = () => {
    cache.value.clear();
  };

  // Auto-refresh setup
  let refreshInterval: number | null = null;

  const startAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    
    refreshInterval = window.setInterval(() => {
      if (appStore.preferences.autoRefresh && !loading.value) {
        refreshWeatherData();
      }
    }, WEATHER_CONFIG.REFRESH_INTERVAL);
  };

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  };

  return {
    // State
    currentWeather,
    forecast,
    loading,
    lastUpdated,
    selectedLocation,
    
    // Getters
    isDataStale,
    currentCondition,
    weatherSummary,
    
    // Actions
    fetchCurrentWeather,
    fetchForecast,
    refreshWeatherData,
    setLocation,
    setApiKey,
    clearCache,
    startAutoRefresh,
    stopAutoRefresh,
  };
});
