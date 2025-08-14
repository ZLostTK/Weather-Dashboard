<template>
  <div class="glass-card p-6 animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-2xl font-bold text-white mb-1">
          {{ weather?.location.name }}
        </h2>
        <p class="text-white/70 text-sm">
          {{ weather?.location.region }}, {{ weather?.location.country }}
        </p>
      </div>
      <div class="text-right">
        <div class="text-4xl font-light text-white">
          {{ Math.round(weather?.current.temp_c || 0) }}°
        </div>
        <div class="text-white/70 text-sm">
          Feels like {{ Math.round(weather?.current.feelslike_c || 0) }}°
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <img 
          :src="weather?.current.condition.icon" 
          :alt="weather?.current.condition.text"
          class="w-16 h-16"
        />
        <div>
          <div class="text-white font-medium">
            {{ weather?.current.condition.text }}
          </div>
          <div class="text-white/70 text-sm">
            Updated {{ formatTime(weather?.current.last_updated) }}
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="text-center">
        <Wind class="w-5 h-5 text-white/70 mx-auto mb-1" />
        <div class="text-white text-sm">Wind</div>
        <div class="text-white/70 text-xs">
          {{ weather?.current.wind_kph }}km/h {{ weather?.current.wind_dir }}
        </div>
      </div>
      
      <div class="text-center">
        <Droplets class="w-5 h-5 text-white/70 mx-auto mb-1" />
        <div class="text-white text-sm">Humidity</div>
        <div class="text-white/70 text-xs">{{ weather?.current.humidity }}%</div>
      </div>
      
      <div class="text-center">
        <Eye class="w-5 h-5 text-white/70 mx-auto mb-1" />
        <div class="text-white text-sm">Visibility</div>
        <div class="text-white/70 text-xs">{{ weather?.current.vis_km }}km</div>
      </div>
      
      <div class="text-center">
        <Gauge class="w-5 h-5 text-white/70 mx-auto mb-1" />
        <div class="text-white text-sm">Pressure</div>
        <div class="text-white/70 text-xs">{{ weather?.current.pressure_mb }}mb</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Wind, Droplets, Eye, Gauge } from 'lucide-vue-next';
import type { WeatherData } from '@/types/weather';

interface Props {
  weather: WeatherData | null;
}

defineProps<Props>();

const formatTime = (timestamp: string | undefined) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
</script>