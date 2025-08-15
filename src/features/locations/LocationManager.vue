<template>
  <div class="glass-card p-6 animate-fade-in">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-white flex items-center">
        <MapPin class="w-5 h-5 mr-2" />
        Saved Locations
      </h3>
      <div class="flex space-x-2">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search locations..."
            class="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            @input="handleSearch"
          />
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="mb-6">
      <h4 class="text-white/80 text-sm mb-3">Search Results:</h4>
      <div class="space-y-2">
        <div
          v-for="result in searchResults"
          :key="`${result.lat}-${result.lon}`"
          class="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          @click="addLocation(result)"
        >
          <div>
            <div class="text-white font-medium">{{ result.name }}</div>
            <div class="text-white/60 text-sm">{{ result.region }}, {{ result.country }}</div>
          </div>
          <Plus class="w-4 h-4 text-white/60" />
        </div>
      </div>
    </div>

    <!-- Saved Locations -->
    <div class="space-y-3">
      <div
        v-for="location in savedLocations"
        :key="location.id"
        class="group relative p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-[1.02]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4 flex-1">
            <!-- Location icon with weather indicator -->
            <div class="relative">
              <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <MapPin class="w-5 h-5 text-white/70" />
              </div>
              <div v-if="location.isDefault" class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star class="w-2 h-2 text-white fill-current" />
              </div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2">
                <div class="text-white font-medium truncate">{{ location.name }}</div>
                <div v-if="location.isDefault" class="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-full">
                  Default
                </div>
              </div>
              <div class="text-white/60 text-sm truncate">{{ location.region }}, {{ location.country }}</div>
              <div class="text-white/40 text-xs mt-1 flex items-center space-x-3">
                <span>{{ location.lat.toFixed(2) }}°, {{ location.lon.toFixed(2) }}°</span>
                <span class="flex items-center">
                  <Clock class="w-3 h-3 mr-1" />
                  {{ getLocalTime(location) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Weather preview for this location -->
          <div v-if="getLocationWeather(location)" class="hidden sm:flex items-center space-x-3 mr-4">
            <div class="text-center">
              <div class="text-white font-bold text-lg">{{ getLocationWeather(location)?.temp }}°</div>
              <div class="text-white/60 text-xs">{{ getLocationWeather(location)?.condition }}</div>
            </div>
            <img 
              :src="getLocationWeather(location)?.icon" 
              :alt="getLocationWeather(location)?.condition"
              class="w-8 h-8"
            />
          </div>

          <!-- Action buttons -->
          <div class="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              @click="setAsDefault(location.id)"
              :class="[
                'p-2 rounded-lg transition-all duration-200',
                location.isDefault
                  ? 'bg-yellow-400/20 text-yellow-400 scale-110'
                  : 'hover:bg-white/10 text-white/60 hover:text-yellow-400 hover:scale-110'
              ]"
              :title="location.isDefault ? 'Default location' : 'Set as default'"
            >
              <Star class="w-4 h-4" :class="{ 'fill-current': location.isDefault }" />
            </button>
            
            <button
              @click="selectLocation(location)"
              class="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-all duration-200 hover:scale-110"
              title="View weather for this location"
            >
              <Eye class="w-4 h-4" />
            </button>
            
            <button
              @click="showLocationDetails(location)"
              class="p-2 hover:bg-gray-500/20 rounded-lg text-gray-400 transition-all duration-200 hover:scale-110"
              title="View details"
            >
              <Info class="w-4 h-4" />
            </button>
            
            <button
              @click="removeLocation(location.id)"
              class="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-all duration-200 hover:scale-110"
              title="Remove location"
              :disabled="location.isDefault && savedLocations.length > 1"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Expandable details -->
        <div v-if="expandedLocation === location.id" class="mt-4 pt-4 border-t border-white/10 animate-fade-in">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div class="text-center">
              <Globe class="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div class="text-white/80">{{ location.country }}</div>
              <div class="text-white/60 text-xs">Country</div>
            </div>
            <div class="text-center">
              <MapPin class="w-4 h-4 text-green-400 mx-auto mb-1" />
              <div class="text-white/80">{{ location.region }}</div>
              <div class="text-white/60 text-xs">Region</div>
            </div>
            <div class="text-center">
              <Navigation class="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div class="text-white/80">{{ location.lat.toFixed(4) }}°</div>
              <div class="text-white/60 text-xs">Latitude</div>
            </div>
            <div class="text-center">
              <Navigation class="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <div class="text-white/80">{{ location.lon.toFixed(4) }}°</div>
              <div class="text-white/60 text-xs">Longitude</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="savedLocations.length === 0" class="text-center py-8">
      <MapPin class="w-12 h-12 text-white/40 mx-auto mb-3" />
      <p class="text-white/60 mb-2">No saved locations</p>
      <p class="text-white/40 text-sm">Search for locations above to add them to your favorites</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { 
  MapPin, Search, Plus, Star, Eye, Trash2, Clock, Info, Globe, Navigation
} from 'lucide-vue-next';
import type { SavedLocation } from '@/shared/types/weather';

interface SearchResult {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

interface Props {
  savedLocations: SavedLocation[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  addLocation: [location: Omit<SavedLocation, 'id'>];
  removeLocation: [id: string];
  setDefault: [id: string];
  selectLocation: [location: SavedLocation];
  searchLocations: [query: string];
}>();

const searchQuery = ref('');
const searchResults = ref<SearchResult[]>([]);
const expandedLocation = ref<string | null>(null);

const handleSearch = async () => {
  if (searchQuery.value.length < 3) {
    searchResults.value = [];
    return;
  }

  // Mock search results for demo
  const mockResults: SearchResult[] = [
    { name: 'London', region: 'England', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
    { name: 'New York', region: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
    { name: 'Tokyo', region: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris', region: 'Île-de-France', country: 'France', lat: 48.8566, lon: 2.3522 },
    { name: 'Sydney', region: 'New South Wales', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  ];

  // Filter results based on search query
  searchResults.value = mockResults.filter(result =>
    result.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    result.region.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    result.country.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

const addLocation = (result: SearchResult) => {
  // Check if location already exists
  const exists = props.savedLocations.some(
    loc => Math.abs(loc.lat - result.lat) < 0.01 && Math.abs(loc.lon - result.lon) < 0.01
  );

  if (!exists) {
    emit('addLocation', {
      name: result.name,
      region: result.region,
      country: result.country,
      lat: result.lat,
      lon: result.lon,
      isDefault: props.savedLocations.length === 0, // First location becomes default
    });
  }

  // Clear search
  searchQuery.value = '';
  searchResults.value = [];
};

const removeLocation = (id: string) => {
  emit('removeLocation', id);
};

const setAsDefault = (id: string) => {
  emit('setDefault', id);
};

const selectLocation = (location: SavedLocation) => {
  emit('selectLocation', location);
};

const showLocationDetails = (location: SavedLocation) => {
  expandedLocation.value = expandedLocation.value === location.id ? null : location.id;
};

const getLocalTime = (location: SavedLocation) => {
  // Simple timezone approximation based on longitude
  const timezoneOffset = Math.round(location.lon / 15);
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const localTime = new Date(utc + (timezoneOffset * 3600000));
  return localTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

const getLocationWeather = (location: SavedLocation) => {
  // Mock weather data for demonstration
  const weatherTypes = [
    { temp: 12, condition: 'Cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
    { temp: 25, condition: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
    { temp: 18, condition: 'Partly Cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
    { temp: 8, condition: 'Rainy', icon: '//cdn.weatherapi.com/weather/64x64/day/296.png' },
  ];
  
  // Use location ID to get consistent weather for each location
  const index = parseInt(location.id.slice(-1)) % weatherTypes.length;
  return weatherTypes[index];
};

// Clear search results when search query is cleared
watch(searchQuery, (newQuery) => {
  if (!newQuery) {
    searchResults.value = [];
  }
});
</script>