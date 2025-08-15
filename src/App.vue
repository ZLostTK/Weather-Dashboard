<template>
    <div class="min-h-screen bg-background text-foreground">
        <!-- Background gradient overlay -->
        <div
            class="fixed inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5"
        ></div>
    
    <!-- API Key Setup -->
        <ApiKeySetup :api-key="apiKey" @set-api-key="setApiKey" />

    <!-- Main Content -->
    <div v-if="apiKey" class="relative z-10">
      <!-- Header -->
                  <header class="p-4 sm:p-6 border-b border-border bg-card/50 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div
                class="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0"
            >
                            <Cloud class="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div class="min-w-0">
                            <h1 class="text-xl sm:text-2xl font-bold text-foreground truncate">Weather Dashboard</h1>
                            <p class="text-muted-foreground text-xs sm:text-sm truncate">
                                Real-time weather insights and forecasts
                            </p>
            </div>
          </div>
          
          <div class="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-4 w-full sm:w-auto">
                        <!-- Search Location Button -->
                        <button
                            @click="showLocationSearch = true"
                            class="btn-ghost flex items-center space-x-2 px-2 sm:px-4 py-2 border border-border hover:bg-accent flex-1 sm:flex-none"
                        >
                            <Search class="w-4 h-4" />
                            <span class="hidden sm:inline">{{ currentLocation || 'Buscar ubicación' }}</span>
                            <span class="sm:hidden">Buscar</span>
                        </button>

            <!-- Refresh button -->
            <button
              @click="refreshWeather"
              :disabled="loading"
                            class="btn-ghost p-2 disabled:opacity-50 flex-shrink-0"
            >
              <RefreshCw :class="['w-4 h-4 sm:w-5 sm:h-5', { 'animate-spin': loading }]" />
            </button>

            <!-- Settings -->
                        <button @click="showSettings = true" class="btn-ghost p-2 flex-shrink-0">
              <Settings class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

            <!-- Main Dashboard -->
      <main class="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        <div
            v-if="error"
            class="mb-4 sm:mb-6 p-3 sm:p-4 bg-destructive/20 border border-destructive/40 rounded-lg text-destructive-foreground"
        >
          <div class="flex items-center space-x-2">
            <AlertCircle class="w-4 h-4 sm:w-5 sm:h-5" />
            <span class="text-sm sm:text-base">{{ error }}</span>
          </div>
        </div>

        <!-- Weather Overview -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div class="lg:col-span-1">
            <WeatherCard :weather="currentWeather" />
          </div>
          
          <div class="lg:col-span-2">
                        <ForecastChart :forecast="forecast" :loading="loading" />
          </div>
        </div>

        <!-- Weather Analytics Charts -->
        <div class="mb-6 sm:mb-8">
          <WeatherCharts :forecast="forecast" />
        </div>

        <!-- Weather Map and Daily Forecast -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <WeatherMap />
          <DailyForecast :forecast="forecast" />
        </div>

        <!-- Alerts and Location Management -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
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
            <Teleport to="body">
      <div
        v-if="showSettings"
                    class="settings-modal-overlay fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[9998] p-3 sm:p-4"
        @click.self="showSettings = false"
                    style="z-index: 9998"
                >
                    <div
                        class="bg-card backdrop-blur-md rounded-xl p-4 sm:p-6 w-full max-w-md mx-3 sm:mx-4 border border-border shadow-lg"
                    >
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-card-foreground">Settings</h3>
                            <button @click="showSettings = false" class="btn-ghost p-1">
                                <X class="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>

          <div class="space-y-4">
            <div>
                                <label class="block text-card-foreground text-sm mb-2"
                                    >WeatherAPI Key</label
                                >
              <div class="flex space-x-2">
                <input
                  v-model="newApiKey"
                  type="text"
                                        class="form-input flex-1"
                  placeholder="Enter new API key"
                />
                                    <button @click="updateApiKey" class="btn-primary">
                  Update
                </button>
              </div>
            </div>

                            <!-- Theme Selector -->
                            <div>
                                <label class="block text-card-foreground text-sm mb-2"
                                    >Tema de la aplicación</label
                                >
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
                                <button @click="resetToDemo" class="btn-secondary w-full">
                Switch to Demo Mode
              </button>
            </div>
          </div>
        </div>
                </div>
            </Teleport>

            <!-- Location Search Modal -->
            <Teleport to="body">
                <div
                    v-if="showLocationSearch"
                    class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[9997] p-3 sm:p-4"
                    @click.self="showLocationSearch = false"
                >
                    <div class="bg-card backdrop-blur-md rounded-xl p-4 sm:p-6 w-full max-w-lg mx-3 sm:mx-4 border border-border shadow-lg max-h-[90vh] overflow-y-auto">
                        <div class="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 class="text-lg sm:text-xl font-semibold text-card-foreground">Buscar Ubicación</h3>
                            <button
                                @click="showLocationSearch = false"
                                class="btn-ghost p-1"
                            >
                                <X class="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>

                        <div class="space-y-3 sm:space-y-4">
                            <!-- Search Input -->
                            <div class="relative">
                                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground pointer-events-none" />
                                <input
                                    v-model="searchQuery"
                                    @input="searchLocations"
                                    @keyup.enter="selectFirstResult"
                                    type="text"
                                    class="w-full bg-input border border-border rounded-lg pl-10 sm:pl-12 pr-3 py-2 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
                                    placeholder="Buscar ciudad, país o región..."
                                    :disabled="searchLoading"
                                />
                            </div>

                            <!-- Search Results -->
                            <div v-if="searchResults.length > 0" class="max-h-48 sm:max-h-64 overflow-y-auto space-y-2">
                                <div
                                    v-for="result in searchResults"
                                    :key="`${result.name}-${result.region}-${result.country}`"
                                    @click="selectSearchResult(result)"
                                    class="p-2 sm:p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                                >
                                    <div class="flex items-center justify-between">
                                        <div class="min-w-0 flex-1">
                                            <div class="font-medium text-card-foreground text-sm sm:text-base truncate">{{ result.name }}</div>
                                            <div class="text-xs sm:text-sm text-muted-foreground truncate">
                                                {{ result.region }}, {{ result.country }}
                                            </div>
                                        </div>
                                        <button
                                            @click.stop="addToSavedLocations(result)"
                                            class="btn-ghost p-1 sm:p-2 text-muted-foreground hover:text-primary flex-shrink-0 ml-2"
                                            title="Agregar a favoritos"
                                        >
                                            <Plus class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Loading State -->
                            <div v-else-if="searchLoading" class="text-center py-8">
                                <RefreshCw class="w-8 h-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                                <p class="text-muted-foreground">Buscando ubicaciones...</p>
                            </div>

                            <!-- No Results -->
                            <div v-else-if="searchQuery && !searchLoading && searchResults.length === 0" class="text-center py-8">
                                <Search class="w-8 h-8 mx-auto mb-2 text-muted-foreground/60" />
                                <p class="text-muted-foreground">No se encontraron ubicaciones</p>
                                <p class="text-sm text-muted-foreground/60">Intenta con un nombre diferente</p>
                            </div>

                            <!-- Saved Locations -->
                            <div v-if="savedLocations.length > 0" class="border-t border-border pt-3 sm:pt-4">
                                <h4 class="font-medium text-card-foreground mb-2 sm:mb-3 text-sm sm:text-base">Ubicaciones Guardadas</h4>
                                <div class="space-y-2">
                                    <div
                                        v-for="location in savedLocations"
                                        :key="location.id"
                                        @click="selectSavedLocation(location)"
                                        class="p-2 sm:p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                                    >
                                        <div class="flex items-center justify-between">
                                            <div class="min-w-0 flex-1">
                                                <div class="font-medium text-card-foreground text-sm sm:text-base truncate">{{ location.name }}</div>
                                                <div class="text-xs sm:text-sm text-muted-foreground truncate">
                                                    {{ location.region }}, {{ location.country }}
                                                </div>
                                            </div>
                                            <button
                                                @click.stop="removeSavedLocation(location.id)"
                                                class="btn-ghost p-1 sm:p-2 text-destructive hover:bg-destructive/10 flex-shrink-0 ml-2"
                                                title="Eliminar de favoritos"
                                            >
                                                <Trash2 class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Cloud, Search, RefreshCw, Settings, X, AlertCircle, Plus, Trash2 } from 'lucide-vue-next';

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
const showLocationSearch = ref(false);
const newApiKey = ref('');
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const searchLoading = ref(false);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Theme management
const appStore = useAppStore();
const selectedTheme = ref(appStore.theme);

// Search functionality
const searchLocations = () => {
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    searchTimeout = setTimeout(async () => {
        if (!searchQuery.value.trim() || searchQuery.value.length < 2) {
            searchResults.value = [];
            return;
        }

        searchLoading.value = true;
        try {
            // Use WeatherAPI search endpoint
            const response = await fetch(
                `https://api.weatherapi.com/v1/search.json?key=${apiKey.value}&q=${encodeURIComponent(searchQuery.value)}`
            );
            
            if (response.ok) {
                const data = await response.json();
                searchResults.value = data.slice(0, 10); // Limit to 10 results
            } else {
                searchResults.value = [];
            }
        } catch (error) {
            console.error('Error searching locations:', error);
            searchResults.value = [];
        } finally {
            searchLoading.value = false;
        }
    }, 500); // 500ms delay
};

const selectSearchResult = (result: any) => {
    currentLocation.value = `${result.name}, ${result.region}`;
    showLocationSearch.value = false;
    searchQuery.value = '';
    searchResults.value = [];
    refreshWeather();
};

const selectFirstResult = () => {
    if (searchResults.value.length > 0) {
        selectSearchResult(searchResults.value[0]);
    }
};

const selectSavedLocation = (location: any) => {
    currentLocation.value = `${location.name}, ${location.region}`;
    showLocationSearch.value = false;
    refreshWeather();
};

const addToSavedLocations = (result: any) => {
    const newLocation = {
        id: Date.now().toString(),
        name: result.name,
        region: result.region,
        country: result.country,
        lat: result.lat,
        lon: result.lon,
    };
    addSavedLocation(newLocation);
};

const handleLocationChange = () => {
  refreshWeather();
};

const refreshWeather = async () => {
    await Promise.all([fetchCurrentWeather(), fetchForecast()]);
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

// Cleanup on unmount
onUnmounted(() => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
        searchTimeout = null;
    }
});
</script>
