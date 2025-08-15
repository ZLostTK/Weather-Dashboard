<template>
  <div class="glass-card p-4 sm:p-6 animate-slide-up">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
      <h3 class="text-lg sm:text-xl font-semibold text-card-foreground flex items-center">
        <Bell class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        Alertas del Clima
      </h3>
      <button
        @click="showAddAlert = true"
        class="btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base w-full sm:w-auto"
      >
        <Plus class="w-4 h-4" />
        <span>Agregar Alerta</span>
      </button>
    </div>

    <!-- Active Alerts -->
    <div v-if="alerts.length > 0" class="space-y-3 sm:space-y-4 mb-6">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        :class="[
          'p-3 sm:p-4 rounded-lg border-l-4 transition-all',
          getAlertStyles(alert.type),
          alert.isActive ? 'opacity-100' : 'opacity-60'
        ]"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <div class="flex items-center space-x-2">
                <component :is="getAlertIcon(alert.type)" class="w-4 h-4 flex-shrink-0" />
                <span class="font-medium text-card-foreground capitalize text-sm sm:text-base">
                  {{ getAlertTypeLabel(alert.type) }}
                </span>
              </div>
              <span :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                alert.isActive ? 'bg-success/20 text-success-foreground' : 'bg-muted text-muted-foreground'
              ]">
                {{ alert.isActive ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
            <p class="text-card-foreground/80 text-sm mb-2 break-words">{{ alert.message }}</p>
            <div class="text-muted-foreground text-xs space-y-1 sm:space-y-0">
              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span class="font-medium">Ubicación:</span>
                <span class="break-all">{{ alert.location }}</span>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span class="font-medium">Condición:</span>
                <span>{{ getConditionLabel(alert.condition) }} {{ alert.threshold }}{{ getAlertUnit(alert.type) }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end sm:justify-start space-x-2 sm:ml-4 flex-shrink-0">
            <button
              @click="toggleAlert(alert.id)"
              :class="[
                'p-2 rounded-lg transition-colors',
                alert.isActive 
                  ? 'text-success hover:bg-success/10' 
                  : 'text-muted-foreground hover:bg-muted/50'
              ]"
              :title="alert.isActive ? 'Desactivar alerta' : 'Activar alerta'"
            >
              <component :is="alert.isActive ? 'BellRing' : 'BellOff'" class="w-4 h-4" />
            </button>
            <button
              @click="removeAlert(alert.id)"
              class="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              title="Eliminar alerta"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-6 sm:py-8">
      <Bell class="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/60 mx-auto mb-3" />
      <p class="text-card-foreground/80 mb-2 text-sm sm:text-base">No hay alertas configuradas</p>
      <p class="text-muted-foreground text-xs sm:text-sm px-4">Crea alertas personalizadas para mantenerte informado sobre cambios en el clima</p>
    </div>

    <!-- Add Alert Modal -->
    <Teleport to="body">
      <div
        v-if="showAddAlert"
        class="modal-overlay fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        @click.self="showAddAlert = false"
        style="z-index: 9999"
      >
      <div class="bg-card backdrop-blur-md rounded-xl p-4 sm:p-6 w-full max-w-md mx-auto border border-border shadow-lg max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h4 class="text-lg sm:text-xl font-semibold text-card-foreground">Crear Alerta del Clima</h4>
          <button
            @click="showAddAlert = false"
            class="btn-ghost p-1"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleAddAlert" class="space-y-4 sm:space-y-5">
          <div>
            <label class="block text-card-foreground text-sm sm:text-base mb-2 font-medium">Ubicación</label>
            <input
              v-model="newAlert.location"
              type="text"
              class="form-input w-full"
              placeholder="Ingresa la ubicación"
              required
            />
          </div>

          <div>
            <label class="block text-card-foreground text-sm sm:text-base mb-2 font-medium">Tipo de Alerta</label>
            <select
              v-model="newAlert.type"
              class="form-select w-full"
              required
            >
              <option value="temperature">Temperatura</option>
              <option value="rain">Lluvia</option>
              <option value="wind">Viento</option>
              <option value="uv">Índice UV</option>
              <option value="general">Condición General</option>
            </select>
          </div>

          <div>
            <label class="block text-card-foreground text-sm sm:text-base mb-2 font-medium">Condición</label>
            <select
              v-model="newAlert.condition"
              class="form-select w-full"
              required
            >
              <option value="above">Por encima del umbral</option>
              <option value="below">Por debajo del umbral</option>
              <option value="equals">Igual a la condición</option>
            </select>
          </div>

          <div>
            <label class="block text-card-foreground text-sm sm:text-base mb-2 font-medium">
              Umbral {{ getAlertUnit(newAlert.type) }}
            </label>
            <input
              v-model.number="newAlert.threshold"
              type="number"
              class="form-input w-full"
              :placeholder="getThresholdPlaceholder(newAlert.type)"
              required
            />
          </div>

          <div>
            <label class="block text-card-foreground text-sm sm:text-base mb-2 font-medium">Mensaje Personalizado</label>
            <textarea
              v-model="newAlert.message"
              class="form-input w-full resize-none"
              rows="3"
              placeholder="Mensaje personalizado de alerta (opcional)"
            ></textarea>
          </div>

          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              @click="showAddAlert = false"
              class="btn-secondary flex-1 order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn-primary flex-1 order-1 sm:order-2"
            >
              Crear Alerta
            </button>
          </div>
        </form>
      </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  Bell, Plus, X, Trash2,
  Thermometer, CloudRain, Wind, Sun, AlertTriangle
} from 'lucide-vue-next';
import type { WeatherAlert } from '@/shared/types/weather';

interface Props {
  alerts: WeatherAlert[];
}

defineProps<Props>();

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
      return 'bg-warning/10 border-warning';
    case 'rain':
      return 'bg-info/10 border-info';
    case 'wind':
      return 'bg-muted/20 border-muted-foreground';
    case 'uv':
      return 'bg-warning/10 border-warning';
    default:
      return 'bg-destructive/10 border-destructive';
  }
};

const getAlertTypeLabel = (type: WeatherAlert['type']) => {
  switch (type) {
    case 'temperature': return 'Temperatura';
    case 'rain': return 'Lluvia';
    case 'wind': return 'Viento';
    case 'uv': return 'Índice UV';
    case 'general': return 'General';
    default: return 'Alerta';
  }
};

const getConditionLabel = (condition: string) => {
  switch (condition) {
    case 'above': return 'Por encima de';
    case 'below': return 'Por debajo de';
    case 'equals': return 'Igual a';
    default: return condition;
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
    case 'temperature': return 'ej. 25';
    case 'rain': return 'ej. 10';
    case 'wind': return 'ej. 50';
    case 'uv': return 'ej. 8';
    default: return 'Ingresa el umbral';
  }
};

const handleAddAlert = () => {
  const alertMessage = newAlert.message || 
    `Alerta de ${getAlertTypeLabel(newAlert.type)}: ${getConditionLabel(newAlert.condition)} ${newAlert.threshold}${getAlertUnit(newAlert.type)} en ${newAlert.location}`;

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