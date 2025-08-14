<template>
  <div class="glass-card p-6 animate-slide-up">
    <h3 class="text-xl font-semibold text-white mb-6">7-Day Forecast</h3>
    
    <div class="space-y-3">
      <div
        v-for="(day, index) in forecast?.forecast.forecastday || []"
        :key="day.date"
        class="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div class="flex items-center space-x-4">
          <div class="text-white font-medium w-16">
            {{ formatDate(day.date, index === 0) }}
          </div>
          <img 
            :src="day.day.condition.icon" 
            :alt="day.day.condition.text"
            class="w-10 h-10"
          />
          <div>
            <div class="text-white text-sm font-medium">
              {{ day.day.condition.text }}
            </div>
            <div class="text-white/60 text-xs flex items-center space-x-3">
              <span v-if="day.day.daily_chance_of_rain > 0" class="flex items-center">
                <Droplets class="w-3 h-3 mr-1" />
                {{ day.day.daily_chance_of_rain }}%
              </span>
              <span class="flex items-center">
                <Wind class="w-3 h-3 mr-1" />
                {{ Math.round(day.day.maxwind_kph) }}km/h
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <div class="text-white font-semibold">
              {{ Math.round(day.day.maxtemp_c) }}°
            </div>
            <div class="text-white/60 text-sm">
              {{ Math.round(day.day.mintemp_c) }}°
            </div>
          </div>
          
          <!-- Temperature bar -->
          <div class="relative w-20 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              class="absolute left-0 top-0 h-full rounded-full"
              :class="getTemperatureColor(day.day.avgtemp_c)"
              :style="{ width: `${getTemperatureWidth(day.day.avgtemp_c)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Droplets, Wind } from 'lucide-vue-next';
import type { ForecastData } from '@/types/weather';

interface Props {
  forecast: ForecastData | null;
}

defineProps<Props>();

const formatDate = (dateString: string, isToday: boolean) => {
  if (isToday) return 'Today';
  
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  
  return date.toLocaleDateString([], { weekday: 'short' });
};

const getTemperatureColor = (temp: number) => {
  if (temp < 0) return 'bg-blue-400';
  if (temp < 10) return 'bg-cyan-400';
  if (temp < 20) return 'bg-yellow-400';
  if (temp < 30) return 'bg-orange-400';
  return 'bg-red-400';
};

const getTemperatureWidth = (temp: number) => {
  // Normalize temperature to percentage (assuming range -10 to 40°C)
  return Math.max(0, Math.min(100, ((temp + 10) / 50) * 100));
};
</script>