<template>
    <div class="glass-card p-4 sm:p-6 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <h3 class="text-lg sm:text-xl font-semibold text-white">Weather Analytics</h3>
            <div class="flex flex-wrap gap-1 sm:gap-2">
                <button
                    v-for="chart in chartTypes"
                    :key="chart.key"
                    @click="activeChart = chart.key"
                    :class="[
                        'px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition-all duration-200 flex items-center space-x-1',
                        activeChart === chart.key
                            ? 'bg-white/20 text-white shadow-lg'
                            : 'text-white/70 hover:text-white hover:bg-white/10',
                    ]"
                >
                    <component :is="chart.icon" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{{ chart.label }}</span>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <!-- Main Chart -->
            <div class="lg:col-span-2 bg-white/5 rounded-lg p-3 sm:p-4">
                <div class="h-48 sm:h-56 md:h-64 w-full">
                    <canvas ref="mainChartRef"></canvas>
                </div>
            </div>

            <!-- Secondary Charts -->
            <div class="bg-white/5 rounded-lg p-3 sm:p-4">
                <h4 class="text-xs sm:text-sm font-medium text-white/80 mb-2 sm:mb-3">
                    Humidity & Pressure
                </h4>
                <div class="h-24 sm:h-28 md:h-32 w-full">
                    <canvas ref="humidityChartRef"></canvas>
                </div>
            </div>

            <div class="bg-white/5 rounded-lg p-3 sm:p-4">
                <h4 class="text-xs sm:text-sm font-medium text-white/80 mb-2 sm:mb-3">
                    Wind Analysis
                </h4>
                <div class="h-24 sm:h-28 md:h-32 w-full">
                    <canvas ref="windChartRef"></canvas>
                </div>
            </div>
        </div>

        <!-- Chart Statistics -->
        <div class="mt-4 sm:mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <div class="text-center">
                <div class="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    {{ stats.avgTemp }}°
                </div>
                <div class="text-xs sm:text-sm text-white/60">Avg Temperature</div>
            </div>
            <div class="text-center">
                <div class="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    {{ stats.maxWind }} km/h
                </div>
                <div class="text-xs sm:text-sm text-white/60">Max Wind Speed</div>
            </div>
            <div class="text-center">
                <div class="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    {{ stats.avgHumidity }}%
                </div>
                <div class="text-xs sm:text-sm text-white/60">Avg Humidity</div>
            </div>
            <div class="text-center">
                <div class="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    {{ stats.precipitation }} mm
                </div>
                <div class="text-xs sm:text-sm text-white/60">Total Precipitation</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    BarElement,
    BarController,
    DoughnutController,
    Title,
    Tooltip,
    Legend,
    Filler,
    RadialLinearScale,
    ArcElement,
} from 'chart.js';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-vue-next';
import type { ForecastData } from '@/shared/types/weather';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    BarElement,
    BarController,
    DoughnutController,
    Title,
    Tooltip,
    Legend,
    Filler,
    RadialLinearScale,
    ArcElement
);

interface Props {
    forecast: ForecastData | null;
}

const props = defineProps<Props>();

const mainChartRef = ref<HTMLCanvasElement>();
const humidityChartRef = ref<HTMLCanvasElement>();
const windChartRef = ref<HTMLCanvasElement>();

const mainChart = ref<ChartJS | null>(null);
const humidityChart = ref<ChartJS | null>(null);
const windChart = ref<ChartJS | null>(null);

const activeChart = ref<'temperature' | 'precipitation' | 'wind' | 'comparison'>('temperature');

const chartTypes = [
    { key: 'temperature' as const, label: 'Temperature', icon: TrendingUp },
    { key: 'precipitation' as const, label: 'Precipitation', icon: BarChart3 },
    { key: 'wind' as const, label: 'Wind', icon: Activity },
    { key: 'comparison' as const, label: 'Compare', icon: PieChart },
];

// Computed statistics
const stats = computed(() => {
    if (!props.forecast) {
        return {
            avgTemp: 0,
            maxWind: 0,
            avgHumidity: 0,
            precipitation: 0,
        };
    }

    const days = props.forecast.forecast.forecastday;
    const avgTemp = Math.round(days.reduce((sum, day) => sum + day.day.avgtemp_c, 0) / days.length);
    const maxWind = Math.round(Math.max(...days.map(day => day.day.maxwind_kph)));
    const avgHumidity = Math.round(
        days.reduce((sum, day) => sum + day.day.avghumidity, 0) / days.length
    );
    const precipitation = days.reduce((sum, day) => sum + day.day.totalprecip_mm, 0).toFixed(1);

    return {
        avgTemp,
        maxWind,
        avgHumidity,
        precipitation: parseFloat(precipitation),
    };
});

const createMainChart = async () => {
    if (!mainChartRef.value || !props.forecast) return;

    // Wait for DOM to be fully ready
    await nextTick();

    // Check if canvas is still available and connected to DOM
    if (!mainChartRef.value || !mainChartRef.value.isConnected) {
        console.warn('❌ WeatherCharts: Canvas not available or not in DOM');
        return;
    }

    // Additional validation: check if canvas has proper dimensions
    const canvasRect = mainChartRef.value.getBoundingClientRect();
    if (canvasRect.width === 0 || canvasRect.height === 0) {
        console.warn('❌ WeatherCharts: Canvas has zero dimensions, waiting...');
        setTimeout(() => createMainChart(), 100);
        return;
    }

    // Destroy existing chart with better error handling
    if (mainChart.value) {
        try {
            mainChart.value.destroy();
        } catch (error) {
            console.warn('WeatherCharts: Error destroying existing chart:', error);
        } finally {
            mainChart.value = null;
        }
    }

    // Clear any lingering Chart.js instances
    try {
        const existingChart = ChartJS.getChart(mainChartRef.value);
        if (existingChart) {
            existingChart.destroy();
        }
    } catch (error) {
        console.warn('WeatherCharts: Error destroying lingering chart:', error);
    }

    // Get context with validation
    let ctx;
    try {
        ctx = mainChartRef.value.getContext('2d');
        if (!ctx) {
            console.error('❌ WeatherCharts: Could not get 2D context');
            return;
        }

        // Verify context is working by testing save/restore
        try {
            ctx.save();
            ctx.restore();
        } catch (contextError) {
            console.error(
                '❌ WeatherCharts: Canvas context is not functioning properly:',
                contextError
            );
            return;
        }
    } catch (error) {
        console.error('❌ WeatherCharts: Error getting canvas context:', error);
        return;
    }

    const days = props.forecast.forecast.forecastday;
    const labels = days.map(day =>
        new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })
    );

    let datasets: any[] = [];

    switch (activeChart.value) {
        case 'temperature':
            datasets = [
                {
                    label: 'Max Temperature',
                    data: days.map(day => day.day.maxtemp_c),
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Min Temperature',
                    data: days.map(day => day.day.mintemp_c),
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    fill: true,
                    tension: 0.4,
                },
            ];
            break;

        case 'precipitation':
            datasets = [
                {
                    label: 'Precipitation (mm)',
                    data: days.map(day => day.day.totalprecip_mm),
                    backgroundColor: '#74add1',
                    borderColor: '#4575b4',
                    borderWidth: 1,
                },
                {
                    label: 'Rain Chance (%)',
                    data: days.map(day => day.day.daily_chance_of_rain),
                    type: 'line',
                    borderColor: '#f46d43',
                    backgroundColor: 'transparent',
                    yAxisID: 'y1',
                    tension: 0.4,
                },
            ];
            break;

        case 'wind':
            datasets = [
                {
                    label: 'Max Wind Speed (km/h)',
                    data: days.map(day => day.day.maxwind_kph),
                    backgroundColor: '#a8dadc',
                    borderColor: '#457b9d',
                    borderWidth: 1,
                },
            ];
            break;

        case 'comparison':
            datasets = [
                {
                    label: 'Temperature',
                    data: days.map(day => day.day.avgtemp_c),
                    borderColor: '#ff6b6b',
                    backgroundColor: 'transparent',
                    tension: 0.4,
                },
                {
                    label: 'Humidity',
                    data: days.map(day => day.day.avghumidity),
                    borderColor: '#4ecdc4',
                    backgroundColor: 'transparent',
                    tension: 0.4,
                    yAxisID: 'y1',
                },
                {
                    label: 'UV Index',
                    data: days.map(day => day.day.uv),
                    borderColor: '#ffe66d',
                    backgroundColor: 'transparent',
                    tension: 0.4,
                    yAxisID: 'y2',
                },
            ];
            break;
    }

    const scales: any = {
        x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        },
        y: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                callback: function (value: any): string {
                    if (activeChart.value === 'precipitation') {
                        return value + ' mm';
                    }
                    return value + (activeChart.value === 'wind' ? ' km/h' : '°C');
                },
            },
        },
    };

    if (activeChart.value === 'precipitation') {
        scales.y1 = {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                callback: function (value: any) {
                    return value + '%';
                },
            },
        };
    }

    if (activeChart.value === 'comparison') {
        scales.y1 = {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                callback: function (value: any) {
                    return value + '%';
                },
            },
        };
        scales.y2 = {
            type: 'linear',
            display: false,
            grid: { drawOnChartArea: false },
        };
    }

    try {
        // Final validation before creating chart
        if (!ctx || !mainChartRef.value || !mainChartRef.value.isConnected) {
            console.error('❌ WeatherCharts: Context or canvas invalid at chart creation time');
            return;
        }

        mainChart.value = new ChartJS(ctx, {
            type:
                activeChart.value === 'precipitation' || activeChart.value === 'wind'
                    ? 'bar'
                    : 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0, // Disable animations to prevent context issues
                },
                plugins: {
                    legend: {
                        labels: { color: 'rgba(255, 255, 255, 0.8)' },
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                    },
                },
                scales,
            },
        });

        console.log('✅ WeatherCharts: Main chart created successfully');
    } catch (error) {
        console.error('❌ WeatherCharts: Error creating main chart:', error);
    }
};

const createHumidityChart = async () => {
    if (!humidityChartRef.value || !props.forecast) return;

    await nextTick();

    if (!humidityChartRef.value || !humidityChartRef.value.isConnected) {
        console.warn('❌ WeatherCharts: Humidity canvas not available');
        return;
    }

    // Destroy existing chart with better error handling
    if (humidityChart.value) {
        try {
            humidityChart.value.destroy();
        } catch (error) {
            console.warn('WeatherCharts: Error destroying humidity chart:', error);
        } finally {
            humidityChart.value = null;
        }
    }

    // Get context with validation
    let ctx;
    try {
        ctx = humidityChartRef.value.getContext('2d');
        if (!ctx) {
            console.error('❌ WeatherCharts: Could not get humidity chart context');
            return;
        }

        // Test context functionality
        ctx.save();
        ctx.restore();
    } catch (error) {
        console.error('❌ WeatherCharts: Humidity chart context error:', error);
        return;
    }

    const days = props.forecast.forecast.forecastday.slice(0, 5);
    const labels = days.map(day =>
        new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })
    );

    humidityChart.value = new ChartJS(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Humidity',
                    data: days.map(day => day.day.avghumidity),
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Pressure',
                    data: days.map(() => Math.floor(Math.random() * 20) + 1010), // Mock pressure data
                    borderColor: '#ff6b6b',
                    backgroundColor: 'transparent',
                    yAxisID: 'y1',
                    tension: 0.4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0, // Disable animations to prevent context issues
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    display: false,
                },
                y: {
                    display: false,
                },
                y1: {
                    display: false,
                    type: 'linear',
                    position: 'right',
                },
            },
        },
    });
};

const createWindChart = async () => {
    if (!windChartRef.value || !props.forecast) return;

    await nextTick();

    if (!windChartRef.value || !windChartRef.value.isConnected) {
        console.warn('❌ WeatherCharts: Wind canvas not available');
        return;
    }

    // Destroy existing chart with better error handling
    if (windChart.value) {
        try {
            windChart.value.destroy();
        } catch (error) {
            console.warn('WeatherCharts: Error destroying wind chart:', error);
        } finally {
            windChart.value = null;
        }
    }

    // Get context with validation
    let ctx;
    try {
        ctx = windChartRef.value.getContext('2d');
        if (!ctx) {
            console.error('❌ WeatherCharts: Could not get wind chart context');
            return;
        }

        // Test context functionality
        ctx.save();
        ctx.restore();
    } catch (error) {
        console.error('❌ WeatherCharts: Wind chart context error:', error);
        return;
    }

    // Note: Wind pattern analysis could use forecast data in future

    windChart.value = new ChartJS(ctx, {
        type: 'doughnut',
        data: {
            labels: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
            datasets: [
                {
                    data: [12, 8, 15, 10, 20, 18, 12, 5], // Mock wind direction data
                    backgroundColor: [
                        '#ff6b6b',
                        '#ff8e53',
                        '#ff6b6b',
                        '#4ecdc4',
                        '#45b7d1',
                        '#96ceb4',
                        '#ffeaa7',
                        '#dda0dd',
                    ],
                    borderWidth: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0, // Disable animations to prevent context issues
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    });
};

const initializeCharts = () => {
    nextTick(() => {
        createMainChart();
        createHumidityChart();
        createWindChart();
    });
};

onMounted(() => {
    initializeCharts();
});

watch([() => props.forecast, activeChart], () => {
    initializeCharts();
});
</script>
