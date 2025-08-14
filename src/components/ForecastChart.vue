<template>
  <div class="glass-card p-6 animate-slide-up">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-white">Temperature Trend</h3>
      <div class="flex space-x-2">
        <button
          v-for="period in periods"
          :key="period.key"
          @click="selectedPeriod = period.key"
          :class="[
            'px-3 py-1 rounded-lg text-sm transition-colors',
            selectedPeriod === period.key
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>
    
    <div class="h-64 w-full">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { ForecastData } from '@/types/weather';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  forecast: ForecastData | null;
}

const props = defineProps<Props>();

const chartRef = ref<HTMLCanvasElement>();
const chart = ref<ChartJS | null>(null);
const selectedPeriod = ref<'hourly' | 'daily'>('hourly');

const periods = [
  { key: 'hourly' as const, label: '24 Hours' },
  { key: 'daily' as const, label: '7 Days' },
];

const createChart = () => {
  if (!chartRef.value || !props.forecast) return;

  // Destroy existing chart
  if (chart.value) {
    chart.value.destroy();
  }

  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;

  let labels: string[] = [];
  let temperatures: number[] = [];
  let feelsLike: number[] = [];

  if (selectedPeriod.value === 'hourly') {
    // Get next 24 hours
    const today = props.forecast.forecast.forecastday[0];
    const tomorrow = props.forecast.forecast.forecastday[1];
    
    const currentHour = new Date().getHours();
    const todayHours = today.hour.slice(currentHour);
    const tomorrowHours = tomorrow ? tomorrow.hour.slice(0, 24 - todayHours.length) : [];
    
    const hours = [...todayHours, ...tomorrowHours];
    
    labels = hours.map(hour => 
      new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
    temperatures = hours.map(hour => hour.temp_c);
    feelsLike = hours.map(hour => hour.feelslike_c);
  } else {
    // Get 7 days
    labels = props.forecast.forecast.forecastday.map(day => 
      new Date(day.date).toLocaleDateString([], { weekday: 'short', day: 'numeric' })
    );
    temperatures = props.forecast.forecast.forecastday.map(day => day.day.avgtemp_c);
    feelsLike = temperatures; // For daily view, use same values
  }

  chart.value = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temperature',
          data: temperatures,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'white',
          pointBorderColor: 'rgba(255, 255, 255, 0.8)',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Feels Like',
          data: feelsLike,
          borderColor: 'rgba(255, 255, 255, 0.5)',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
          pointBackgroundColor: 'rgba(255, 255, 255, 0.7)',
          pointBorderColor: 'rgba(255, 255, 255, 0.5)',
          pointRadius: 3,
          pointHoverRadius: 5,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: 'rgba(255, 255, 255, 0.8)',
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            maxTicksLimit: 8,
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            callback: function(value) {
              return value + '°C';
            }
          }
        }
      },
      elements: {
        point: {
          hoverBackgroundColor: 'white',
        }
      }
    }
  });
};

onMounted(() => {
  nextTick(() => {
    createChart();
  });
});

watch([() => props.forecast, selectedPeriod], () => {
  nextTick(() => {
    createChart();
  });
});
</script>