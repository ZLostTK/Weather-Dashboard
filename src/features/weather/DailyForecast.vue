<template>
    <div class="glass-card p-6 animate-slide-up">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-white">7-Day Forecast</h3>
            <button
                @click="showDetails = !showDetails"
                class="text-white/70 hover:text-white transition-colors text-sm flex items-center space-x-1"
            >
                <component :is="showDetails ? ChevronUp : ChevronDown" class="w-4 h-4" />
                <span>{{ showDetails ? 'Less' : 'More' }} Details</span>
            </button>
        </div>

        <div class="space-y-3">
            <div
                v-for="(day, index) in forecast?.forecast.forecastday || []"
                :key="day.date"
                :class="[
                    'rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer',
                    showDetails ? 'p-4' : 'p-3',
                    selectedDay === index ? 'ring-2 ring-white/30 bg-white/15' : '',
                ]"
                @click="toggleDayDetails(index)"
            >
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="text-white font-medium w-20">
                            {{ formatDate(day.date, index === 0) }}
                        </div>
                        <div class="relative">
                            <img
                                :src="day.day.condition.icon"
                                :alt="day.day.condition.text"
                                class="w-12 h-12"
                            />
                            <div
                                class="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                                v-if="day.day.daily_chance_of_rain > 70"
                            >
                                <Droplets class="w-2 h-2 text-white" />
                            </div>
                        </div>
                        <div class="flex-1">
                            <div class="text-white font-medium">
                                {{ day.day.condition.text }}
                            </div>
                            <div class="text-white/60 text-sm flex items-center space-x-4 mt-1">
                                <span
                                    v-if="day.day.daily_chance_of_rain > 0"
                                    class="flex items-center"
                                >
                                    <Droplets class="w-3 h-3 mr-1" />
                                    {{ day.day.daily_chance_of_rain }}%
                                </span>
                                <span class="flex items-center">
                                    <Wind class="w-3 h-3 mr-1" />
                                    {{ Math.round(day.day.maxwind_kph) }}km/h
                                </span>
                                <span class="flex items-center">
                                    <Eye class="w-3 h-3 mr-1" />
                                    {{ Math.round(day.day.avgvis_km) }}km
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center space-x-4">
                        <div class="text-right">
                            <div class="text-white font-bold text-lg">
                                {{ Math.round(day.day.maxtemp_c) }}°
                            </div>
                            <div class="text-white/60">{{ Math.round(day.day.mintemp_c) }}°</div>
                        </div>

                        <!-- Enhanced temperature bar -->
                        <div class="relative w-24 h-3 bg-white/20 rounded-full overflow-hidden">
                            <div
                                class="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                                :class="getTemperatureColor(day.day.avgtemp_c)"
                                :style="{ width: `${getTemperatureWidth(day.day.avgtemp_c)}%` }"
                            ></div>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-xs font-medium text-white/80">
                                    {{ Math.round(day.day.avgtemp_c) }}°
                                </span>
                            </div>
                        </div>

                        <ChevronRight
                            :class="[
                                'w-4 h-4 text-white/60 transition-transform duration-200',
                                selectedDay === index ? 'rotate-90' : '',
                            ]"
                        />
                    </div>
                </div>

                <!-- Detailed view -->
                <div
                    v-if="showDetails && selectedDay === index"
                    class="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fade-in"
                >
                    <!-- Hourly forecast preview -->
                    <div>
                        <h5 class="text-white/80 text-sm font-medium mb-2">Hourly Preview</h5>
                        <div class="flex space-x-3 overflow-x-auto pb-2">
                            <div
                                v-for="hour in getHourlyPreview(day.hour)"
                                :key="hour.time_epoch"
                                class="flex-shrink-0 text-center bg-white/5 rounded-lg p-2 min-w-[60px]"
                            >
                                <div class="text-white/60 text-xs">
                                    {{ formatHour(hour.time) }}
                                </div>
                                <img
                                    :src="hour.condition.icon"
                                    :alt="hour.condition.text"
                                    class="w-6 h-6 mx-auto my-1"
                                />
                                <div class="text-white text-xs font-medium">
                                    {{ Math.round(hour.temp_c) }}°
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Additional details -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div class="bg-white/5 rounded-lg p-3 text-center">
                            <Droplets class="w-4 h-4 text-blue-400 mx-auto mb-1" />
                            <div class="text-white text-sm font-medium">
                                {{ day.day.totalprecip_mm }}mm
                            </div>
                            <div class="text-white/60 text-xs">Precipitation</div>
                        </div>
                        <div class="bg-white/5 rounded-lg p-3 text-center">
                            <Eye class="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <div class="text-white text-sm font-medium">
                                {{ Math.round(day.day.avghumidity) }}%
                            </div>
                            <div class="text-white/60 text-xs">Humidity</div>
                        </div>
                        <div class="bg-white/5 rounded-lg p-3 text-center">
                            <Sun class="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                            <div class="text-white text-sm font-medium">{{ day.day.uv }}</div>
                            <div class="text-white/60 text-xs">UV Index</div>
                        </div>
                        <div class="bg-white/5 rounded-lg p-3 text-center">
                            <Sunrise class="w-4 h-4 text-orange-400 mx-auto mb-1" />
                            <div class="text-white text-sm font-medium">
                                {{ day.astro.sunrise }}
                            </div>
                            <div class="text-white/60 text-xs">Sunrise</div>
                        </div>
                    </div>

                    <!-- Astronomical info -->
                    <div class="bg-white/5 rounded-lg p-3">
                        <h6 class="text-white/80 text-sm font-medium mb-2">Astronomical Data</h6>
                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-white/60">Sunrise:</span>
                                <span class="text-white">{{ day.astro.sunrise }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-white/60">Sunset:</span>
                                <span class="text-white">{{ day.astro.sunset }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-white/60">Moonrise:</span>
                                <span class="text-white">{{ day.astro.moonrise }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-white/60">Moon phase:</span>
                                <span class="text-white">{{ day.astro.moon_phase }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    Droplets,
    Wind,
    Eye,
    Sun,
    Sunrise,
    ChevronUp,
    ChevronDown,
    ChevronRight,
} from 'lucide-vue-next';
import type { ForecastData } from '@/shared/types/weather';

interface Props {
    forecast: ForecastData | null;
}

defineProps<Props>();

const showDetails = ref(false);
const selectedDay = ref<number | null>(null);

const toggleDayDetails = (index: number) => {
    if (selectedDay.value === index) {
        selectedDay.value = null;
    } else {
        selectedDay.value = index;
        showDetails.value = true;
    }
};

const formatDate = (dateString: string, isToday: boolean) => {
    if (isToday) return 'Today';

    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    }

    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
};

const formatHour = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

const getHourlyPreview = (hours: any[]) => {
    // Show every 3rd hour for a cleaner preview
    return hours.filter((_, index) => index % 3 === 0).slice(0, 8);
};

const getTemperatureColor = (temp: number) => {
    if (temp < 0) return 'bg-blue-500';
    if (temp < 10) return 'bg-cyan-400';
    if (temp < 20) return 'bg-yellow-400';
    if (temp < 30) return 'bg-orange-400';
    return 'bg-red-500';
};

const getTemperatureWidth = (temp: number) => {
    // Normalize temperature to percentage (assuming range -10 to 40°C)
    return Math.max(10, Math.min(100, ((temp + 10) / 50) * 100));
};
</script>
