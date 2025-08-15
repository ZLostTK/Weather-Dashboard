<template>
  <div class="glass-card p-4 sm:p-6 animate-slide-up">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
      <h3 class="text-lg sm:text-xl font-semibold text-card-foreground">Tendencia de Temperatura</h3>
      <div class="flex space-x-1 sm:space-x-2 w-full sm:w-auto">
        <button
          v-for="period in periods"
          :key="period.key"
          @click="selectedPeriod = period.key"
          :class="[
            'flex-1 sm:flex-none px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors border font-medium',
            selectedPeriod === period.key
              ? 'bg-primary text-primary-foreground border-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent border-border'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>
    
    <div class="h-48 sm:h-64 w-full relative">
      <canvas ref="chartRef" class="w-full h-full"></canvas>
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-lg">
        <div class="text-muted-foreground text-sm">Cargando datos del gráfico...</div>
      </div>
      <div v-else-if="!forecast && !props.loading" class="absolute inset-0 flex items-center justify-center">
        <div class="text-muted-foreground text-sm text-center">
          <div class="mb-2">📊</div>
          <div>Mostrando datos de demostración</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { ForecastData } from '@/shared/types/weather';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

// console.log('📦 Chart.js registered successfully', ChartJS.version);

interface Props {
  forecast: ForecastData | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const chartRef = ref<HTMLCanvasElement>();
const chart = ref<ChartJS | null>(null);
const selectedPeriod = ref<'hourly' | 'daily'>('hourly');

const periods = [
  { key: 'hourly' as const, label: '24 Hours' },
  { key: 'daily' as const, label: '7 Days' },
];

// Fallback data generator in case forecast data is missing or incomplete
const generateFallbackData = () => {
  if (selectedPeriod.value === 'hourly') {
    const now = new Date();
    const labels = Array.from({ length: 24 }, (_, i) => {
      const hour = (now.getHours() + i) % 24;
      return hour.toString().padStart(2, '0') + ':00';
    });
    const temperatures = Array.from({ length: 24 }, (_, i) => {
      const baseTemp = 15;
      const variation = Math.sin((i * Math.PI) / 12) * 5;
      return Math.round((baseTemp + variation + Math.random() * 2 - 1) * 10) / 10;
    });
    const feelsLike = temperatures.map(temp => Math.round((temp + Math.random() * 3 - 1.5) * 10) / 10);
    
    return { labels, temperatures, feelsLike };
  } else {
    const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const temperatures = Array.from({ length: 7 }, () => Math.round((10 + Math.random() * 15) * 10) / 10);
    const feelsLike = temperatures.map(temp => Math.round((temp + Math.random() * 2 - 1) * 10) / 10);
    
    return { labels, temperatures, feelsLike };
  }
};

const createChart = async () => {
  // Early validation
  if (!chartRef.value || props.loading) {
    return;
  }

  // Wait for DOM to be fully ready
  await nextTick();

  // Check if canvas is still available and connected to DOM
  if (!chartRef.value || !chartRef.value.isConnected) {
    console.warn('❌ Canvas not available or not in DOM');
    return;
  }

  // Destroy existing chart with better error handling
  if (chart.value) {
    try {
      chart.value.destroy();
    } catch (error) {
      console.warn('Error destroying existing chart:', error);
    } finally {
      chart.value = null;
    }
  }

  // Clear any lingering Chart.js instances
  try {
    const existingChart = ChartJS.getChart(chartRef.value);
    if (existingChart) {
      existingChart.destroy();
    }
  } catch (error) {
    console.warn('Error destroying lingering chart:', error);
  }

  // Get context with validation
  let ctx;
  try {
    ctx = chartRef.value.getContext('2d');
    if (!ctx) {
      console.error('❌ Could not get 2D context');
      return;
    }
  } catch (error) {
    console.error('❌ Error getting canvas context:', error);
    return;
  }

  let labels: string[] = [];
  let temperatures: number[] = [];
  let feelsLike: number[] = [];

  // Try to use real forecast data, fallback to generated data if not available
  try {
    if (props.forecast && props.forecast.forecast && props.forecast.forecast.forecastday) {
      if (selectedPeriod.value === 'hourly') {
        // Get next 24 hours starting from current hour
        const today = props.forecast.forecast.forecastday[0];
        const tomorrow = props.forecast.forecast.forecastday[1] || null;
        
        if (today && today.hour && today.hour.length > 0) {
          const currentHour = new Date().getHours();
          const todayHours = today.hour.slice(currentHour, 24);
          const tomorrowHours = tomorrow && tomorrow.hour ? tomorrow.hour.slice(0, Math.max(0, 24 - todayHours.length)) : [];
          
          const hours = [...todayHours, ...tomorrowHours].slice(0, 24);
          
          if (hours.length > 0) {
            labels = hours.map(hour => {
              const date = new Date(hour.time);
              return date.getHours().toString().padStart(2, '0') + ':00';
            });
            temperatures = hours.map(hour => Math.round(hour.temp_c * 10) / 10);
            feelsLike = hours.map(hour => Math.round(hour.feelslike_c * 10) / 10);
          }
        }
      } else {
        // Get 7 days
        const days = props.forecast.forecast.forecastday;
        if (days && days.length > 0) {
          labels = days.map(day => {
            const date = new Date(day.date);
            return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
          });
          temperatures = days.map(day => Math.round(day.day.avgtemp_c * 10) / 10);
          feelsLike = days.map(day => Math.round((day.day.maxtemp_c + day.day.mintemp_c) / 2 * 10) / 10);
        }
      }
    }
    
    // If no data was extracted, use fallback data
    if (labels.length === 0 || temperatures.length === 0) {
      const fallbackData = generateFallbackData();
      labels = fallbackData.labels;
      temperatures = fallbackData.temperatures;
      feelsLike = fallbackData.feelsLike;
    }
  } catch (error) {
    console.error('Error processing forecast data, using fallback:', error);
    const fallbackData = generateFallbackData();
    labels = fallbackData.labels;
    temperatures = fallbackData.temperatures;
    feelsLike = fallbackData.feelsLike;
  }

  // Use simpler static colors for debugging
  const primaryColor = '#60a5fa'; // blue-400
  const secondaryColor = '#a78bfa'; // violet-400
  const foregroundColor = '#f8fafc'; // slate-50
  const mutedForegroundColor = '#94a3b8'; // slate-400
  const borderColor = '#475569'; // slate-600



  try {
    chart.value = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temperatura',
          data: temperatures,
          borderColor: primaryColor,
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: primaryColor,
          pointBorderColor: primaryColor,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBorderWidth: 2,
        },
        {
          label: selectedPeriod.value === 'hourly' ? 'Sensación Térmica' : 'Promedio Real',
          data: feelsLike,
          borderColor: secondaryColor,
          backgroundColor: 'transparent',
          borderDash: selectedPeriod.value === 'hourly' ? [5, 5] : [],
          tension: 0.4,
          pointBackgroundColor: secondaryColor,
          pointBorderColor: secondaryColor,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBorderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: foregroundColor,
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
            },
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: borderColor,
          borderWidth: 1,
          callbacks: {
            label: function(context: any) {
              return `${context.dataset.label}: ${context.parsed.y}°C`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: borderColor,
            display: true,
          },
          ticks: {
            color: mutedForegroundColor,
            maxTicksLimit: 6,
            font: {
              size: 11,
            },
          }
        },
        y: {
          grid: {
            color: borderColor,
            display: true,
          },
          ticks: {
            color: mutedForegroundColor,
            font: {
              size: 11,
            },
            callback: function(value: any) {
              return Math.round(value) + '°C';
            }
          }
        }
      }
    }
  });
    
    console.log('✅ Chart created successfully');
  } catch (error) {
    console.error('❌ Error creating chart:', error);
  }
};

onMounted(() => {
  setTimeout(() => {
    debouncedCreateChart();
  }, 200);
});

// Debounced chart creation to prevent multiple rapid calls
let chartTimeout: ReturnType<typeof setTimeout> | null = null;

const debouncedCreateChart = () => {
  if (chartTimeout) {
    clearTimeout(chartTimeout);
  }
  chartTimeout = setTimeout(() => {
    createChart();
  }, 100);
};

watch(selectedPeriod, () => {
  debouncedCreateChart();
});

watch(() => props.forecast, () => {
  debouncedCreateChart();
});

watch(() => props.loading, (newLoading) => {
  if (!newLoading) {
    debouncedCreateChart();
  }
});

// Cleanup on unmount
onUnmounted(() => {
  // Clear any pending timeout
  if (chartTimeout) {
    clearTimeout(chartTimeout);
    chartTimeout = null;
  }
  
  // Destroy chart
  if (chart.value) {
    try {
      chart.value.destroy();
      chart.value = null;
    } catch (error) {
      console.warn('Error destroying chart on unmount:', error);
    }
  }
});
</script>