<template>
    <div class="glass-card p-4 sm:p-6 animate-slide-up">
        <div class="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 class="text-lg sm:text-xl font-semibold text-card-foreground">Pronóstico del Tiempo</h3>
                
                <!-- Period Selector -->
                <div class="flex space-x-1 sm:space-x-2">
                    <button
                        v-for="period in periods"
                        :key="period.key"
                        @click="selectedPeriod = period.key"
                        :class="[
                            'px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors border font-medium',
                            selectedPeriod === period.key
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent border-border',
                        ]"
                    >
                        {{ period.label }}
                    </button>
                </div>
            </div>

            <button
                @click="showDetails = !showDetails"
                class="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm flex items-center justify-center sm:justify-start space-x-1 w-full sm:w-auto"
            >
                <component :is="showDetails ? ChevronUp : ChevronDown" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{{ showDetails ? 'Menos' : 'Más' }} Detalles</span>
            </button>
        </div>

        <!-- Hourly View -->
        <div v-if="selectedPeriod === 'hourly'" class="space-y-2 sm:space-y-3">
            <div
                v-for="(hour, index) in hourlyData"
                :key="hour.time_epoch"
                :class="[
                    'rounded-lg bg-card/5 hover:bg-accent/50 transition-all duration-200 cursor-pointer',
                    showDetails ? 'p-3 sm:p-4' : 'p-2 sm:p-3',
                    selectedHour === index ? 'ring-2 ring-ring bg-accent/30' : '',
                ]"
                @click="toggleHourDetails(index)"
            >
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center space-x-2 sm:space-x-4">
                        <div class="text-card-foreground font-medium w-16 sm:w-20 text-sm sm:text-base">
                            {{ formatHour(hour.time) }}
                        </div>
                        <div class="relative">
                            <img
                                :src="hour.condition.icon"
                                :alt="hour.condition.text"
                                class="w-10 h-10 sm:w-12 sm:h-12"
                            />
                            <div
                                class="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center"
                                v-if="hour.chance_of_rain > 70"
                            >
                                <Droplets class="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="text-white font-medium text-sm sm:text-base truncate">
                                {{ hour.condition.text }}
                            </div>
                            <div class="text-muted-foreground text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                                <span
                                    v-if="hour.chance_of_rain > 0"
                                    class="flex items-center"
                                >
                                    <Droplets class="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                                    {{ hour.chance_of_rain }}%
                                </span>
                                <span class="flex items-center">
                                    <Wind class="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                                    {{ Math.round(hour.wind_kph) }}km/h
                                </span>
                                <span class="flex items-center">
                                    <Eye class="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                                    {{ Math.round(hour.vis_km) }}km
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-4 w-full sm:w-auto">
                        <div class="text-right">
                            <div class="text-white font-bold text-base sm:text-lg">
                                {{ Math.round(hour.temp_c) }}°
                            </div>
                            <div class="text-muted-foreground text-xs sm:text-sm">{{ Math.round(hour.feelslike_c) }}°</div>
                        </div>

                        <!-- Enhanced temperature bar -->
                        <div class="relative w-20 sm:w-24 h-2.5 sm:h-3 bg-muted/30 rounded-full overflow-hidden">
                            <div
                                class="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                                :class="getTemperatureColor(hour.temp_c)"
                                :style="{ width: `${getTemperatureWidth(hour.temp_c)}%` }"
                            ></div>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-xs font-medium text-card-foreground">
                                    {{ Math.round(hour.temp_c) }}°
                                </span>
                            </div>
                        </div>

                        <ChevronRight
                            :class="[
                                'w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground transition-transform duration-200',
                                selectedHour === index ? 'rotate-90' : '',
                            ]"
                        />
                    </div>
                </div>

                <!-- Detailed view for hourly -->
                <div
                    v-if="showDetails && selectedHour === index"
                    class="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in"
                >
                    <!-- Hour details -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div class="bg-card/5 rounded-lg p-3 text-center">
                            <Droplets class="w-4 h-4 text-blue-400 mx-auto mb-1" />
                            <div class="text-card-foreground text-sm font-medium">
                                {{ hour.chance_of_rain }}%
                            </div>
                            <div class="text-muted-foreground text-xs">Lluvia</div>
                        </div>
                        <div class="bg-card/5 rounded-lg p-3 text-center">
                            <Eye class="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <div class="text-card-foreground text-sm font-medium">
                                {{ Math.round(hour.vis_km) }}km
                            </div>
                            <div class="text-muted-foreground text-xs">Visibilidad</div>
                        </div>
                        <div class="bg-card/5 rounded-lg p-3 text-center">
                            <Wind class="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                            <div class="text-card-foreground text-sm font-medium">
                                {{ Math.round(hour.wind_kph) }}km/h
                            </div>
                            <div class="text-muted-foreground text-xs">Viento</div>
                        </div>
                        <div class="bg-card/5 rounded-lg p-3 text-center">
                            <Sun class="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                            <div class="text-card-foreground text-sm font-medium">
                                {{ Math.round(hour.uv) }}
                            </div>
                            <div class="text-muted-foreground text-xs">UV Index</div>
                        </div>
                    </div>

                    <!-- Additional hour info -->
                    <div class="bg-card/5 rounded-lg p-3">
                        <h6 class="text-muted-foreground text-sm font-medium mb-2">Información Adicional</h6>
                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Humedad:</span>
                                <span class="text-card-foreground">{{ Math.round(hour.humidity) }}%</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Presión:</span>
                                <span class="text-card-foreground">{{ Math.round(hour.pressure_mb) }}mb</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Sensación:</span>
                                <span class="text-card-foreground">{{ Math.round(hour.feelslike_c) }}°C</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Punto rocío:</span>
                                <span class="text-card-foreground">{{ Math.round(hour.dewpoint_c) }}°C</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Daily View -->
        <div v-if="selectedPeriod === 'daily'" class="space-y-3">
            <div
                v-for="(day, index) in forecast?.forecast.forecastday || []"
                :key="day.date"
                :class="[
                    'rounded-lg bg-card/5 hover:bg-accent/50 transition-all duration-200 cursor-pointer',
                    showDetails ? 'p-4' : 'p-3',
                    selectedDay === index ? 'ring-2 ring-ring bg-accent/30' : '',
                ]"
                @click="toggleDayDetails(index)"
            >
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="text-card-foreground font-medium w-20">
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
                            <div class="text-card-foreground font-medium">
                                {{ day.day.condition.text }}
                            </div>
                            <div class="text-muted-foreground text-sm flex items-center space-x-4 mt-1">
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
                            <div class="text-card-foreground font-bold text-lg">
                                {{ Math.round(day.day.maxtemp_c) }}°
                            </div>
                            <div class="text-muted-foreground">{{ Math.round(day.day.mintemp_c) }}°</div>
                        </div>

                        <!-- Enhanced temperature bar -->
                        <div class="relative w-24 h-3 bg-muted/30 rounded-full overflow-hidden">
                            <div
                                class="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                                :class="getTemperatureColor(day.day.avgtemp_c)"
                                :style="{ width: `${getTemperatureWidth(day.day.avgtemp_c)}%` }"
                            ></div>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-xs font-medium text-card-foreground">
                                    {{ Math.round(day.day.avgtemp_c) }}°
                                </span>
                            </div>
                        </div>

                        <ChevronRight
                            :class="[
                                'w-4 h-4 text-muted-foreground transition-transform duration-200',
                                selectedDay === index ? 'rotate-90' : '',
                            ]"
                        />
                    </div>
                </div>

                <!-- Detailed view for daily -->
                <div
                    v-if="showDetails && selectedDay === index"
                    class="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in"
                >
                    <!-- Hourly forecast preview -->
                    <div>
                        <h5 class="text-muted-foreground text-sm font-medium mb-2">Vista Previa por Hora</h5>
                        <div class="flex space-x-3 overflow-x-auto pb-2">
                            <div
                                v-for="hour in getHourlyPreview(day.hour)"
                                :key="hour.time_epoch"
                                class="flex-shrink-0 text-center bg-card/5 rounded-lg p-2 min-w-[60px]"
                            >
                                <div class="text-muted-foreground text-xs">
                                    {{ formatHour(hour.time) }}
                                </div>
                                <img
                                    :src="hour.condition.icon"
                                    :alt="hour.condition.text"
                                    class="w-6 h-6 mx-auto my-1"
                                />
                                <div class="text-card-foreground text-xs font-medium">
                                    {{ Math.round(hour.temp_c) }}°
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Additional details -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div class="bg-card/5 rounded-lg p-3 text-center">
                            <Droplets class="w-4 h-4 text-blue-400 mx-auto mb-1" />
                            <div class="text-card-foreground text-sm font-medium">
                                {{ day.day.totalprecip_mm }}mm
                            </div>
                            <div class="text-muted-foreground text-xs">Precipitación</div>
                        </div>
                        <div class="bg-card/5 rounded-lg p-3 text-center">
                            <Eye class="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <div class="text-card-foreground text-sm font-medium">
                                {{ Math.round(day.day.avghumidity) }}%
                            </div>
                            <div class="text-muted-foreground text-xs">Humedad</div>
                        </div>
                        <div class="bg-card/5 rounded-lg p-3 text-center">
                            <Sun class="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                            <div class="text-card-foreground text-sm font-medium">{{ day.day.uv }}</div>
                            <div class="text-muted-foreground text-xs">UV Index</div>
                        </div>
                        <div class="bg-card/5 rounded-lg p-3 text-center">
                            <Sunrise class="w-4 h-4 text-orange-400 mx-auto mb-1" />
                            <div class="text-card-foreground text-sm font-medium">
                                {{ day.astro.sunrise }}
                            </div>
                            <div class="text-muted-foreground text-xs">Amanecer</div>
                        </div>
                    </div>

                    <!-- Astronomical info -->
                    <div class="bg-card/5 rounded-lg p-3">
                        <h6 class="text-muted-foreground text-sm font-medium mb-2">Datos Astronómicos</h6>
                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Amanecer:</span>
                                <span class="text-card-foreground">{{ day.astro.sunrise }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Atardecer:</span>
                                <span class="text-card-foreground">{{ day.astro.sunset }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Salida luna:</span>
                                <span class="text-card-foreground">{{ day.astro.moonrise }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Fase luna:</span>
                                <span class="text-card-foreground">{{ day.astro.moon_phase }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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

const props = defineProps<Props>();

const showDetails = ref(false);
const selectedDay = ref<number | null>(null);
const selectedHour = ref<number | null>(null);
const selectedPeriod = ref<'hourly' | 'daily'>('daily');

const periods = [
    { key: 'hourly' as const, label: '24 Horas' },
    { key: 'daily' as const, label: '7 Días' },
];

const toggleDayDetails = (index: number) => {
    if (selectedDay.value === index) {
        selectedDay.value = null;
    } else {
        selectedDay.value = index;
        showDetails.value = true;
    }
};

const toggleHourDetails = (index: number) => {
    if (selectedHour.value === index) {
        selectedHour.value = null;
    } else {
        selectedHour.value = index;
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

const getHourlyPreview = (hours: Array<{ time: string; temp_c: number; condition: { icon: string; text: string } }>) => {
    // Show every 3rd hour for a cleaner preview
    return hours.filter((_, index) => index % 3 === 0).slice(0, 8);
};

// Generate hourly data for the next 24 hours
const hourlyData = computed(() => {
    if (!props.forecast?.forecast?.forecastday) return [];

    const today = props.forecast.forecast.forecastday[0];
    const tomorrow = props.forecast.forecast.forecastday[1] || null;

    if (today && today.hour && today.hour.length > 0) {
        const currentHour = new Date().getHours();
        const todayHours = today.hour.slice(currentHour, 24);
        const tomorrowHours =
            tomorrow && tomorrow.hour
                ? tomorrow.hour.slice(0, Math.max(0, 24 - todayHours.length))
                : [];

        return [...todayHours, ...tomorrowHours].slice(0, 24);
    }

    return [];
});

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
