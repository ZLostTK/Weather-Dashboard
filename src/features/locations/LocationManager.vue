<template>
    <div class="glass-card p-4 sm:p-6 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <h3 class="text-lg sm:text-xl font-semibold text-card-foreground flex items-center">
                <MapPin class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Ubicaciones Guardadas
            </h3>
            <div class="flex w-full sm:w-auto">
                <div class="relative flex-1 sm:flex-none">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Buscar ubicaciones..."
                        class="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-sm sm:text-base"
                        @input="handleSearch"
                    />
                    <Search
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    />
                </div>
            </div>
        </div>

        <!-- Search Results -->
        <div v-if="searchResults.length > 0 || searchLoading" class="mb-4 sm:mb-6">
            <h4 class="text-muted-foreground text-sm mb-2 sm:mb-3">
                {{ searchLoading ? 'Buscando...' : 'Resultados de búsqueda:' }}
            </h4>

            <!-- Loading indicator -->
            <div v-if="searchLoading" class="flex items-center justify-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span class="ml-2 text-muted-foreground text-sm">Buscando ubicaciones...</span>
            </div>

            <!-- Search results -->
            <div v-else class="space-y-2">
                <div
                    v-for="result in searchResults"
                    :key="`${result.lat}-${result.lon}`"
                    class="flex items-center justify-between p-2 sm:p-3 bg-card/5 hover:bg-accent/50 rounded-lg transition-colors cursor-pointer"
                    @click="addLocation(result)"
                >
                    <div class="min-w-0 flex-1">
                        <div class="text-card-foreground font-medium text-sm sm:text-base truncate">
                            {{ result.name }}
                        </div>
                        <div class="text-muted-foreground text-xs sm:text-sm truncate">
                            {{ result.region }}, {{ result.country }}
                        </div>
                    </div>
                    <Plus class="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                </div>
            </div>
        </div>

        <!-- Saved Locations -->
        <div class="space-y-2 sm:space-y-3">
            <div
                v-for="location in savedLocationsList"
                :key="location.id"
                class="group relative p-3 sm:p-4 bg-card/5 hover:bg-accent/50 rounded-lg transition-all duration-200 hover:scale-[1.02]"
            >
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <!-- Location icon with weather indicator -->
                        <div class="relative flex-shrink-0">
                            <div
                                class="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center"
                            >
                                <MapPin class="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                            </div>
                            <div
                                v-if="location.isFavorite"
                                class="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                            >
                                <Star class="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white fill-current" />
                            </div>
                        </div>

                        <div class="flex-1 min-w-0">
                            <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <div class="text-card-foreground font-medium truncate text-sm sm:text-base">
                                    {{ location.name }}
                                </div>
                                <div
                                    v-if="location.isFavorite"
                                    class="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-full w-fit"
                                >
                                    Favorito
                                </div>
                            </div>
                            <div class="text-muted-foreground text-xs sm:text-sm truncate">
                                Ubicación guardada
                            </div>
                            <div class="text-muted-foreground/60 text-xs mt-1 flex items-center">
                                <Clock class="w-3 h-3 mr-1" />
                                {{ getCurrentTime() }}
                            </div>
                        </div>
                    </div>

                    <!-- Weather preview for this location -->
                    <div
                        v-if="getLocationWeather(location)"
                        class="hidden sm:flex items-center space-x-2 sm:space-x-3 mr-2 sm:mr-4"
                    >
                        <div class="text-center">
                            <div class="text-card-foreground font-bold text-base sm:text-lg">
                                {{ getLocationWeather(location)?.temp }}°
                            </div>
                            <div class="text-muted-foreground text-xs">
                                {{ getLocationWeather(location)?.condition }}
                            </div>
                        </div>
                        <img
                            :src="getLocationWeather(location)?.icon"
                            :alt="getLocationWeather(location)?.condition"
                            class="w-6 h-6 sm:w-8 sm:h-8"
                        />
                    </div>

                    <!-- Action buttons -->
                    <div
                        class="flex items-center justify-center sm:justify-end space-x-1 opacity-70 group-hover:opacity-100 transition-opacity w-full sm:w-auto"
                    >
                        <button
                            @click="toggleFavoriteLocation(location.id)"
                            :class="[
                                'p-1.5 sm:p-2 rounded-lg transition-all duration-200',
                                location.isFavorite
                                    ? 'bg-yellow-400/20 text-yellow-400 scale-110'
                                    : 'hover:bg-accent text-muted-foreground hover:text-yellow-400 hover:scale-110',
                            ]"
                            :title="
                                location.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
                            "
                        >
                            <Star
                                class="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                :class="{ 'fill-current': location.isFavorite }"
                            />
                        </button>

                        <button
                            @click="selectLocation(location)"
                            class="p-1.5 sm:p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-all duration-200 hover:scale-110"
                            title="Ver clima para esta ubicación"
                        >
                            <Eye class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>

                        <button
                            @click="removeLocation(location.id)"
                            class="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-all duration-200 hover:scale-110"
                            title="Eliminar ubicación"
                        >
                            <Trash2 class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="savedLocationsList.length === 0" class="text-center py-6 sm:py-8">
            <MapPin class="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/60 mx-auto mb-2 sm:mb-3" />
            <p class="text-muted-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                No hay ubicaciones guardadas
            </p>
            <p class="text-muted-foreground/60 text-xs sm:text-sm">
                Busca ubicaciones arriba para agregarlas a tus favoritos
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { MapPin, Search, Plus, Star, Eye, Trash2, Clock } from 'lucide-vue-next';
import type { SavedLocation } from '@/shared/types/weather';
import { useWeather } from '@/shared/composables/useWeather';

interface SearchResult {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
}

// No longer need props since we're using the composable directly
// interface Props {
//     savedLocations: SavedLocation[];
// }

// const props = defineProps<Props>();

const emit = defineEmits<{
    addLocation: [location: Omit<SavedLocation, 'id'>];
    removeLocation: [id: string];
    selectLocation: [location: SavedLocation];
}>();

// Use the weather composable
const {
    searchLocations: searchLocationsApi,
    addSavedLocation,
    removeSavedLocation,
    toggleFavorite,
    savedLocations,
} = useWeather();

const searchQuery = ref('');
const searchResults = ref<SearchResult[]>([]);
const searchLoading = ref(false);
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

// Computed property to access savedLocations from the composable, with favorites first
const savedLocationsList = computed(() => {
    return [...savedLocations.value].sort((a, b) => {
        // Favorites first, then by name
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return a.name.localeCompare(b.name);
    });
});

const handleSearch = async () => {
    // Clear previous timeout
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }

    if (searchQuery.value.length < 3) {
        searchResults.value = [];
        return;
    }

    // Set new timeout for debounced search
    searchTimeout.value = setTimeout(async () => {
        searchLoading.value = true;
        try {
            const results = await searchLocationsApi(searchQuery.value);
            searchResults.value = results.map(
                (result: {
                    name: string;
                    region?: string;
                    country: string;
                    lat: number;
                    lon: number;
                }) => ({
                    name: result.name,
                    region: result.region || result.country,
                    country: result.country,
                    lat: result.lat,
                    lon: result.lon,
                })
            );
        } catch (error) {
            console.error('Error searching locations:', error);
            searchResults.value = [];
        } finally {
            searchLoading.value = false;
        }
    }, 500); // 500ms delay
};

const addLocation = (result: SearchResult) => {
    // Check if location already exists by name
    const exists = savedLocations.value.some(
        (loc: SavedLocation) => loc.name.toLowerCase() === result.name.toLowerCase()
    );

    if (!exists) {
        addSavedLocation(result);

        // Emit event for parent component
        emit('addLocation', {
            name: result.name,
            isFavorite: false,
        });
    }

    // Clear search
    searchQuery.value = '';
    searchResults.value = [];
};

const removeLocation = (id: string) => {
    removeSavedLocation(id);
    emit('removeLocation', id);
};

const toggleFavoriteLocation = (id: string) => {
    console.log('Toggling favorite for location:', id);
    console.log('Before toggle:', savedLocations.value.find(loc => loc.id === id)?.isFavorite);
    toggleFavorite(id);
    console.log('After toggle:', savedLocations.value.find(loc => loc.id === id)?.isFavorite);
};

const selectLocation = (location: SavedLocation) => {
    emit('selectLocation', location);
};

const getCurrentTime = () => {
    return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

const getLocationWeather = (location: SavedLocation) => {
    // Mock weather data for demonstration
    const weatherTypes = [
        { temp: 12, condition: 'Cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
        { temp: 25, condition: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
        {
            temp: 18,
            condition: 'Partly Cloudy',
            icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        },
        { temp: 8, condition: 'Rainy', icon: '//cdn.weatherapi.com/weather/64x64/day/296.png' },
    ];

    // Use location ID to get consistent weather for each location
    const index = parseInt(location.id.slice(-1)) % weatherTypes.length;
    return weatherTypes[index];
};

// Clear search results when search query is cleared
watch(searchQuery, newQuery => {
    if (!newQuery) {
        searchResults.value = [];
    }
});

// Cleanup timeout on component unmount
onMounted(() => {
    return () => {
        if (searchTimeout.value) {
            clearTimeout(searchTimeout.value);
        }
    };
});
</script>
