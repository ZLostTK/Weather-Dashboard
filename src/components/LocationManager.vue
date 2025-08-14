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
        class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
      >
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <div class="flex items-center space-x-2">
              <div class="text-white font-medium">{{ location.name }}</div>
              <Star
                v-if="location.isDefault"
                class="w-4 h-4 text-yellow-400 fill-current"
              />
            </div>
            <div class="text-white/60 text-sm">{{ location.region }}, {{ location.country }}</div>
            <div class="text-white/40 text-xs">
              {{ location.lat.toFixed(2) }}°, {{ location.lon.toFixed(2) }}°
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="setAsDefault(location.id)"
            :class="[
              'p-2 rounded-lg transition-colors',
              location.isDefault
                ? 'bg-yellow-400/20 text-yellow-400'
                : 'hover:bg-white/10 text-white/60 hover:text-yellow-400'
            ]"
            :title="location.isDefault ? 'Default location' : 'Set as default'"
          >
            <Star class="w-4 h-4" :class="{ 'fill-current': location.isDefault }" />
          </button>
          
          <button
            @click="selectLocation(location)"
            class="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-colors"
            title="View weather for this location"
          >
            <Eye class="w-4 h-4" />
          </button>
          
          <button
            @click="removeLocation(location.id)"
            class="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
            title="Remove location"
          >
            <Trash2 class="w-4 h-4" />
          </button>
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
import { MapPin, Search, Plus, Star, Eye, Trash2 } from 'lucide-vue-next';
import type { SavedLocation } from '@/types/weather';

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

// Clear search results when search query is cleared
watch(searchQuery, (newQuery) => {
  if (!newQuery) {
    searchResults.value = [];
  }
});
</script>