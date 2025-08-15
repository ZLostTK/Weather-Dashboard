<template>
    <div class="glass-card p-6 animate-fade-in">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-card-foreground">Interactive Weather Map</h3>
            <div class="flex space-x-2 overflow-x-auto">
                <button
                    v-for="layer in mapLayers"
                    :key="layer.key"
                    @click="setActiveLayer(layer.key)"
                    :class="[
                        'px-3 py-1 rounded-lg text-sm transition-all duration-200 flex items-center space-x-1 whitespace-nowrap',
                        selectedLayer === layer.key
                            ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-102',
                    ]"
                >
                    <component :is="layer.icon" class="w-4 h-4" />
                    <span>{{ layer.label }}</span>
                </button>
            </div>
        </div>

        <div class="relative h-96 bg-card/5 rounded-lg overflow-hidden">
            <!-- Map placeholder with interactive elements -->
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center text-muted-foreground">
                    <Map class="w-16 h-16 mx-auto mb-4" />
                    <p class="text-lg font-medium mb-2">Interactive Weather Map</p>
                    <p class="text-sm">Showing {{ getLayerDescription() }}</p>
                    <p class="text-xs mt-2">Click on markers to see detailed weather information</p>
                </div>
            </div>

            <!-- Mock weather markers -->
            <div
                v-for="marker in weatherMarkers"
                :key="marker.id"
                class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                :style="{ left: marker.x + '%', top: marker.y + '%' }"
                @click="selectMarker(marker)"
            >
                <div class="relative">
                    <div
                        class="w-8 h-8 bg-card/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-border shadow-lg"
                    >
                        <span class="text-xs font-semibold text-card-foreground">
                            {{ Math.round(marker.temp) }}°
                        </span>
                    </div>
                    <div
                        class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-card/80 rotate-45 border-r border-b border-border"
                    ></div>
                </div>
            </div>

            <!-- Selected marker details -->
            <div
                v-if="selectedMarker"
                class="absolute bottom-4 left-4 right-4 bg-popover/90 backdrop-blur-md rounded-lg p-4 text-popover-foreground border border-border"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-semibold">{{ selectedMarker.city }}</h4>
                        <p class="text-sm text-muted-foreground">{{ selectedMarker.condition }}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-xl font-bold">{{ Math.round(selectedMarker.temp) }}°C</div>
                        <div class="text-sm text-muted-foreground">
                            Feels {{ Math.round(selectedMarker.feelsLike) }}°
                        </div>
                    </div>
                    <button
                        @click="selectedMarker = null"
                        class="ml-4 p-1 hover:bg-accent rounded"
                    >
                        <X class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Map legend -->
        <div class="mt-4 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-blue-400 rounded"></div>
                <span>Cold (&lt; 10°C)</span>
            </div>
            <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-yellow-400 rounded"></div>
                <span>Mild (10-25°C)</span>
            </div>
            <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-red-400 rounded"></div>
                <span>Hot (> 25°C)</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Map, Thermometer, Cloud, CloudRain, Wind, X } from 'lucide-vue-next';

const selectedLayer = ref<'temp' | 'clouds' | 'precipitation' | 'wind'>('temp');
const selectedMarker = ref<WeatherMarker | null>(null);

interface WeatherMarker {
    id: string;
    x: number;
    y: number;
    city: string;
    temp: number;
    feelsLike: number;
    condition: string;
}

const mapLayers = [
    { key: 'temp' as const, label: 'Temperature', icon: Thermometer },
    { key: 'clouds' as const, label: 'Clouds', icon: Cloud },
    { key: 'precipitation' as const, label: 'Precipitation', icon: CloudRain },
    { key: 'wind' as const, label: 'Wind', icon: Wind },
];

// Mock weather markers positioned on the map
const weatherMarkers: WeatherMarker[] = [
    { id: '1', x: 25, y: 30, city: 'London', temp: 12, feelsLike: 10, condition: 'Partly Cloudy' },
    { id: '2', x: 45, y: 25, city: 'Berlin', temp: 8, feelsLike: 5, condition: 'Overcast' },
    { id: '3', x: 60, y: 35, city: 'Moscow', temp: -2, feelsLike: -5, condition: 'Snow' },
    { id: '4', x: 15, y: 55, city: 'Madrid', temp: 18, feelsLike: 20, condition: 'Sunny' },
    { id: '5', x: 35, y: 40, city: 'Rome', temp: 22, feelsLike: 24, condition: 'Clear' },
    { id: '6', x: 75, y: 20, city: 'Tokyo', temp: 15, feelsLike: 17, condition: 'Partly Cloudy' },
];

const setActiveLayer = (layer: typeof selectedLayer.value) => {
    selectedLayer.value = layer;
    // Reset selected marker when changing layers
    selectedMarker.value = null;
    // Simulate loading delay for layer change
    setTimeout(() => {
        // Layer switched successfully
    }, 300);
};

const getLayerDescription = () => {
    switch (selectedLayer.value) {
        case 'temp':
            return 'Temperature overlay with regional variations and heat maps';
        case 'clouds':
            return 'Cloud coverage, density patterns and satellite imagery';
        case 'precipitation':
            return 'Rainfall intensity, precipitation radar and forecasts';
        case 'wind':
            return 'Wind patterns, speed variations and directional flows';
        default:
            return 'Current weather conditions across regions';
    }
};

const selectMarker = (marker: WeatherMarker) => {
    selectedMarker.value = selectedMarker.value?.id === marker.id ? null : marker;
};
</script>
