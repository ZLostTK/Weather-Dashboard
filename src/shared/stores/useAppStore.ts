import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import type { WeatherData, ForecastData, WeatherAlert, SavedLocation } from '@/shared/types/weather';
import { APP_CONFIG, THEMES } from '@/shared/constants';
import { getSystemTheme, applyTheme } from '@/shared/constants/themes';

interface AppState {
  // UI State
  theme: keyof typeof THEMES;
  isLoading: boolean;
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  
  // User Preferences
  preferences: {
    units: 'metric' | 'imperial';
    language: string;
    autoRefresh: boolean;
    notifications: boolean;
    defaultLocation?: SavedLocation;
  };
  
  // Error Handling
  error: {
    message: string;
    code?: string;
    timestamp?: number;
  } | null;
  
  // Feature Flags
  features: {
    mapsEnabled: boolean;
    chartsEnabled: boolean;
    alertsEnabled: boolean;
    offlineMode: boolean;
  };
}

export const useAppStore = defineStore('app', () => {
  // State
  const state = reactive<AppState>({
    theme: THEMES.DARK, // Tema oscuro como predeterminado
    isLoading: false,
    isSidebarOpen: false,
    isSettingsOpen: false,
    preferences: {
      units: 'metric',
      language: APP_CONFIG.DEFAULT_LANGUAGE,
      autoRefresh: true,
      notifications: true,
    },
    error: null,
    features: {
      mapsEnabled: true,
      chartsEnabled: true,
      alertsEnabled: true,
      offlineMode: false,
    },
  });

  // Getters
  const currentTheme = computed(() => {
    if (state.theme === THEMES.AUTO) {
      return getSystemTheme();
    }
    return state.theme as 'LIGHT' | 'DARK';
  });

  const isOnline = ref(navigator.onLine);
  const isDarkMode = computed(() => currentTheme.value === 'DARK');

  // Actions
  const setTheme = (theme: keyof typeof THEMES) => {
    state.theme = theme;
    applyTheme(currentTheme.value);
    savePreferences();
  };

  const setLoading = (loading: boolean) => {
    state.isLoading = loading;
  };

  const toggleSidebar = () => {
    state.isSidebarOpen = !state.isSidebarOpen;
  };

  const openSettings = () => {
    state.isSettingsOpen = true;
  };

  const closeSettings = () => {
    state.isSettingsOpen = false;
  };

  const setError = (error: string | null, code?: string) => {
    if (error) {
      state.error = {
        message: error,
        code,
        timestamp: Date.now(),
      };
    } else {
      state.error = null;
    }
  };

  const clearError = () => {
    state.error = null;
  };

  const updatePreferences = (preferences: Partial<AppState['preferences']>) => {
    Object.assign(state.preferences, preferences);
    savePreferences();
  };

  const toggleFeature = (feature: keyof AppState['features']) => {
    state.features[feature] = !state.features[feature];
    savePreferences();
  };

  // Persistence
  const loadPreferences = () => {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER_PREFERENCES);
      if (saved) {
        const preferences = JSON.parse(saved);
        Object.assign(state.preferences, preferences.preferences || {});
        Object.assign(state.features, preferences.features || {});
        state.theme = preferences.theme || THEMES.DARK;
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = () => {
    try {
      const toSave = {
        preferences: state.preferences,
        features: state.features,
        theme: state.theme,
      };
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(toSave));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  // Network status
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine;
    if (!isOnline.value) {
      setError('Sin conexión a internet. Funcionalidad limitada.');
    } else {
      clearError();
    }
  };

  // Initialize
  const initialize = () => {
    loadPreferences();
    applyTheme(currentTheme.value);
    
    // Listen for network changes
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (state.theme === THEMES.AUTO) {
        applyTheme(currentTheme.value);
      }
    });
  };

  return {
    // State
    ...state,
    
    // Getters
    currentTheme,
    isDarkMode,
    isOnline,
    
    // Actions
    setTheme,
    setLoading,
    toggleSidebar,
    openSettings,
    closeSettings,
    setError,
    clearError,
    updatePreferences,
    toggleFeature,
    updateOnlineStatus,
    initialize,
  };
});
