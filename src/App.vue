<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Background gradient overlay -->
    <div class="fixed inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5"></div>
    
    <!-- API Key Setup -->
    <ApiKeySetup
      :api-key="apiKey"
      @set-api-key="setApiKey"
    />

    <!-- Main Content -->
    <div v-if="apiKey" class="relative z-10">
      <!-- Header -->
      <header class="p-6 border-b border-border bg-card/50 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Cloud class="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-foreground">Weather Dashboard</h1>
              <p class="text-muted-foreground text-sm">Real-time weather insights and forecasts</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Location selector -->
            <div class="relative">
              <select
                v-model="currentLocation"
                @change="handleLocationChange"
                class="form-select pr-8"
              >
                <option v-for="location in savedLocations" :key="location.id" :value="`${location.name}, ${location.region}`">
                  {{ location.name }}, {{ location.region }}
                </option>
              </select>
              <ChevronDown class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            <!-- Refresh button -->
            <button
              @click="refreshWeather"
              :disabled="loading"
              class="btn-ghost p-2 disabled:opacity-50"
            >
              <RefreshCw :class="['w-5 h-5', { 'animate-spin': loading }]" />
            </button>

            <!-- Settings -->
            <button
              @click="showSettings = true"
              class="btn-ghost p-2"
            >
              <Settings class="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <!-- Main Dashboard -->
      <main class="max-w-7xl mx-auto p-6">
        <div v-if="error" class="mb-6 p-4 bg-destructive/20 border border-destructive/40 rounded-lg text-destructive-foreground">
          <div class="flex items-center space-x-2">
            <AlertCircle class="w-5 h-5" />
            <span>{{ error }}</span>
          </div>
        </div>

        <!-- Weather Overview -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="lg:col-span-1">
            <WeatherCard :weather="currentWeather" />
          </div>
          
          <div class="lg:col-span-2">
            <ForecastChart :forecast="forecast" :loading="loading" />
          </div>
        </div>

        <!-- Weather Analytics Charts -->
        <div class="mb-8">
          <WeatherCharts :forecast="forecast" />
        </div>

        <!-- Weather Map and Daily Forecast -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <WeatherMap />
          <DailyForecast :forecast="forecast" />
        </div>

        <!-- Alerts and Location Management -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <WeatherAlerts
            :alerts="alerts"
            @add-alert="addAlert"
            @remove-alert="removeAlert"
            @toggle-alert="toggleAlert"
          />
          
          <LocationManager
            :saved-locations="savedLocations"
            @add-location="addSavedLocation"
            @remove-location="removeSavedLocation"
            @set-default="setDefaultLocation"
            @select-location="selectLocation"
          />
        </div>
      </main>

      <!-- Settings Modal -->
      <div
        v-if="showSettings"
        class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="showSettings = false"
      >
        <div class="bg-card backdrop-blur-md rounded-xl p-6 w-full max-w-md mx-4 border border-border shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-card-foreground">Settings</h3>
            <button
              @click="showSettings = false"
              class="btn-ghost p-1"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-card-foreground text-sm mb-2">WeatherAPI Key</label>
              <div class="flex space-x-2">
                <input
                  v-model="newApiKey"
                  type="text"
                  class="form-input flex-1"
                  placeholder="Enter new API key"
                />
                <button
                  @click="updateApiKey"
                  class="btn-primary"
                >
                  Update
                </button>
              </div>
            </div>

            <!-- Theme Selector -->
            <div>
              <label class="block text-card-foreground text-sm mb-2">Tema de la aplicación</label>
              <select
                v-model="selectedTheme"
                @change="handleThemeChange"
                class="form-select w-full"
              >
                <option value="LIGHT">Claro</option>
                <option value="DARK">Oscuro</option>
                <option value="AUTO">Automático</option>
              </select>
            </div>

            <div class="pt-4 border-t border-border">
              <button
                @click="resetToDemo"
                class="btn-secondary w-full"
              >
                Switch to Demo Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Cloud, ChevronDown, RefreshCw, Settings, X, AlertCircle
} from 'lucide-vue-next';

import { WeatherCard, ForecastChart, DailyForecast } from '@/features/weather';
import { WeatherCharts } from '@/features/charts';
import { WeatherMap } from '@/features/maps';
import { WeatherAlerts } from '@/features/alerts';
import { LocationManager } from '@/features/locations';
import { ApiKeySetup } from '@/features/dashboard';

import { useWeather } from '@/shared/composables/useWeather';
import { useAppStore } from '@/shared/stores/useAppStore';

const {
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
  addAlert,
  removeAlert,
  toggleAlert,
  addSavedLocation,
  removeSavedLocation,
  setDefaultLocation,
} = useWeather();

const showSettings = ref(false);
const newApiKey = ref('');

// Theme management
const appStore = useAppStore();
const selectedTheme = ref(appStore.theme);

const handleLocationChange = () => {
  refreshWeather();
};

const refreshWeather = async () => {
  await Promise.all([
    fetchCurrentWeather(),
    fetchForecast(),
  ]);
};

const selectLocation = (location: any) => {
  currentLocation.value = `${location.name}, ${location.region}`;
  refreshWeather();
};

const updateApiKey = () => {
  if (newApiKey.value.trim()) {
    setApiKey(newApiKey.value.trim());
    newApiKey.value = '';
    showSettings.value = false;
    refreshWeather();
  }
};

const resetToDemo = () => {
  setApiKey('demo');
  showSettings.value = false;
  refreshWeather();
};

const handleThemeChange = () => {
  appStore.setTheme(selectedTheme.value);
};

// Initialize app
onMounted(async () => {
  // Initialize app store and theme
  appStore.initialize();
  
  if (apiKey.value) {
    await refreshWeather();
  }
});
</script>