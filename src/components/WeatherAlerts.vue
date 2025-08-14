<template>
  <div class="glass-card p-6 animate-slide-up">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-white flex items-center">
        <Bell class="w-5 h-5 mr-2" />
        Weather Alerts
      </h3>
      <button
        @click="showAddAlert = true"
        class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-colors flex items-center space-x-1"
      >
        <Plus class="w-4 h-4" />
        <span>Add Alert</span>
      </button>
    </div>

    <!-- Active Alerts -->
    <div v-if="alerts.length > 0" class="space-y-3 mb-6">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        :class="[
          'p-4 rounded-lg border-l-4 transition-all',
          getAlertStyles(alert.type),
          alert.isActive ? 'opacity-100' : 'opacity-60'
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <component :is="getAlertIcon(alert.type)" class="w-4 h-4" />
              <span class="font-medium text-white capitalize">
                {{ alert.type }} Alert
              </span>
              <span :class="[
                'px-2 py-1 rounded-full text-xs',
                alert.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
              ]">
                {{ alert.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <p class="text-white/80 text-sm mb-1">{{ alert.message }}</p>
            <div class="text-white/60 text-xs">
              <span>Location: {{ alert.location }}</span>
              <span class="mx-2">•</span>
              <span>Condition: {{ alert.condition }}</span>
              <span class="mx-2">•</span>
              <span>Threshold: {{ alert.threshold }}{{ getAlertUnit(alert.type) }}</span>
            </div>
          </div>
          <div class="flex items-center space-x-2 ml-4">
            <button
              @click="toggleAlert(alert.id)"
              :class="[
                'p-1 rounded hover:bg-white/10 transition-colors',
                alert.isActive ? 'text-green-400' : 'text-gray-400'
              ]"
            >
              <component :is="alert.isActive ? 'BellRing' : 'BellOff'" class="w-4 h-4" />
            </button>
            <button
              @click="removeAlert(alert.id)"
              class="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <Bell class="w-12 h-12 text-white/40 mx-auto mb-3" />
      <p class="text-white/60 mb-2">No weather alerts set up</p>
      <p class="text-white/40 text-sm">Create personalized alerts to stay informed about weather changes</p>
    </div>

    <!-- Add Alert Modal -->
    <div
      v-if="showAddAlert"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showAddAlert = false"
    >
      <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-md mx-4 border border-white/20">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-semibold text-white">Create Weather Alert</h4>
          <button
            @click="showAddAlert = false"
            class="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X class="w-5 h-5 text-white" />
          </button>
        </div>

        <form @submit.prevent="handleAddAlert" class="space-y-4">
          <div>
            <label class="block text-white/80 text-sm mb-2">Location</label>
            <input
              v-model="newAlert.location"
              type="text"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              placeholder="Enter location"
              required
            />
          </div>

          <div>
            <label class="block text-white/80 text-sm mb-2">Alert Type</label>
            <select
              v-model="newAlert.type"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              required
            >
              <option value="temperature">Temperature</option>
              <option value="rain">Rain</option>
              <option value="wind">Wind</option>
              <option value="uv">UV Index</option>
              <option value="general">General Condition</option>
            </select>
          </div>

          <div>
            <label class="block text-white/80 text-sm mb-2">Condition</label>
            <select
              v-model="newAlert.condition"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              required
            >
              <option value="above">Above threshold</option>
              <option value="below">Below threshold</option>
              <option value="equals">Equals condition</option>
            </select>
          </div>

          <div>
            <label class="block text-white/80 text-sm mb-2">
              Threshold {{ getAlertUnit(newAlert.type) }}
            </label>
            <input
              v-model.number="newAlert.threshold"
              type="number"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              :placeholder="getThresholdPlaceholder(newAlert.type)"
              required
            />
          </div>

          <div>
            <label class="block text-white/80 text-sm mb-2">Custom Message</label>
            <textarea
              v-model="newAlert.message"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 resize-none"
              rows="3"
              placeholder="Custom alert message (optional)"
            ></textarea>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="showAddAlert = false"
              class="flex-1 py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
            >
              Create Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  Bell, BellRing, BellOff, Plus, X, Trash2,
  Thermometer, CloudRain, Wind, Sun, AlertTriangle
} from 'lucide-vue-next';
import type { WeatherAlert } from '@/types/weather';

interface Props {
  alerts: WeatherAlert[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  addAlert: [alert: Omit<WeatherAlert, 'id' | 'createdAt'>];
  removeAlert: [id: string];
  toggleAlert: [id: string];
}>();

const showAddAlert = ref(false);

const newAlert = reactive({
  location: '',
  type: 'temperature' as WeatherAlert['type'],
  condition: 'above',
  threshold: 0,
  message: '',
  isActive: true,
});

const getAlertIcon = (type: WeatherAlert['type']) => {
  switch (type) {
    case 'temperature': return Thermometer;
    case 'rain': return CloudRain;
    case 'wind': return Wind;
    case 'uv': return Sun;
    default: return AlertTriangle;
  }
};

const getAlertStyles = (type: WeatherAlert['type']) => {
  switch (type) {
    case 'temperature':
      return 'bg-orange-500/10 border-orange-400';
    case 'rain':
      return 'bg-blue-500/10 border-blue-400';
    case 'wind':
      return 'bg-gray-500/10 border-gray-400';
    case 'uv':
      return 'bg-yellow-500/10 border-yellow-400';
    default:
      return 'bg-red-500/10 border-red-400';
  }
};

const getAlertUnit = (type: WeatherAlert['type']) => {
  switch (type) {
    case 'temperature': return '°C';
    case 'rain': return 'mm';
    case 'wind': return 'km/h';
    case 'uv': return '';
    default: return '';
  }
};

const getThresholdPlaceholder = (type: WeatherAlert['type']) => {
  switch (type) {
    case 'temperature': return 'e.g. 25';
    case 'rain': return 'e.g. 10';
    case 'wind': return 'e.g. 50';
    case 'uv': return 'e.g. 8';
    default: return 'Enter threshold';
  }
};

const handleAddAlert = () => {
  const alertMessage = newAlert.message || 
    `Weather alert: ${newAlert.type} ${newAlert.condition} ${newAlert.threshold}${getAlertUnit(newAlert.type)} in ${newAlert.location}`;

  emit('addAlert', {
    location: newAlert.location,
    type: newAlert.type,
    condition: newAlert.condition,
    threshold: newAlert.threshold,
    message: alertMessage,
    isActive: newAlert.isActive,
  });

  // Reset form
  Object.assign(newAlert, {
    location: '',
    type: 'temperature' as WeatherAlert['type'],
    condition: 'above',
    threshold: 0,
    message: '',
    isActive: true,
  });
  
  showAddAlert.value = false;
};

const removeAlert = (id: string) => {
  emit('removeAlert', id);
};

const toggleAlert = (id: string) => {
  emit('toggleAlert', id);
};
</script>