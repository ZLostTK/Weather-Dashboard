<template>
  <div class="min-h-screen weather-gradient">
    <!-- Background -->
    <div class="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
    
    <!-- API Key Setup -->
    <ApiKeySetup
      :api-key="apiKey"
      @set-api-key="setApiKey"
    />

    <!-- Main Content -->
    <div v-if="apiKey" class="relative z-10">
      <!-- Header -->
      <header class="p-6 border-b border-white/10">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Cloud class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Weather Dashboard</h1>
              <p class="text-white/60 text-sm">Real-time weather insights and forecasts</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Location selector -->
            <div class="relative">
              <select
                v-model="currentLocation"
                @change="handleLocationChange"
                class="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white pr-8 focus:outline-none focus:border-white/40"
              >
                <option v-for="location in savedLocations" :key="location.id" :value="`${location.name}, ${location.region}`">
                  {{ location.name }}, {{ location.region }}
                </option>
              </select>
              <ChevronDown class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
            </div>

            <!-- Refresh button -->
            <button
              @click="refreshWeather"
              :disabled="loading"
              class="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw :class="['w-5 h-5', { 'animate-spin': loading }]" />
            </button>

            <!-- Settings -->
            <button
              @click="showSettings = true"
              class="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <Settings class="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <!-- Main Dashboard -->
      <main class="max-w-7xl mx-auto p-6">
        <div v-if="error" class="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200">
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
            <ForecastChart :forecast="forecast" />
          </div>
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
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="showSettings = false"
      >
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-md mx-4 border border-white/20">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Settings</h3>
            <button
              @click="showSettings = false"
              class="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X class="w-5 h-5 text-white" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-white/80 text-sm mb-2">WeatherAPI Key</label>
              <div class="flex space-x-2">
                <input
                  v-model="newApiKey"
                  type="text"
                  class="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="Enter new API key"
                />
                <button
                  @click="updateApiKey"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                >
                  Update
                </button>
              </div>
            </div>

            <div class="pt-4 border-t border-white/10">
              <button
                @click="resetToDemo"
                class="w-full py-2 px-4 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg text-white transition-colors"
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

import WeatherCard from '@/components/WeatherCard.vue';
import ForecastChart from '@/components/ForecastChart.vue';
import WeatherMap from '@/components/WeatherMap.vue';
import DailyForecast from '@/components/DailyForecast.vue';
import WeatherAlerts from '@/components/WeatherAlerts.vue';
import LocationManager from '@/components/LocationManager.vue';
import ApiKeySetup from '@/components/ApiKeySetup.vue';

import { useWeather } from '@/composables/useWeather';

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

// Initialize app
onMounted(async () => {
  if (apiKey.value) {
    await refreshWeather();
  }
});
</script>