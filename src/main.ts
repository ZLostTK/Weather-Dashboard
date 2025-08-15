import { createApp } from 'vue';
import App from './App.vue';
import { pinia } from './core/store';
import { useAppStore } from './shared/stores/useAppStore';
import './style.css';

// Create Vue app
const app = createApp(App);

// Install Pinia
app.use(pinia);

// Initialize app store
const appStore = useAppStore();
appStore.initialize();

// Global error handler
app.config.errorHandler = (error, instance, info) => {
    console.error('Global error:', error, info);
    const message = error instanceof Error ? error.message : String(error);
    appStore.setError(`Unexpected error: ${message}`);
};

// Mount app
app.mount('#app');
