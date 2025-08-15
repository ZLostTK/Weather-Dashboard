<template>
    <div
        v-if="!apiKey"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
        <div
            class="bg-white/10 backdrop-blur-md rounded-xl p-8 w-full max-w-md mx-4 border border-white/20"
        >
            <div class="text-center mb-6">
                <h2 class="text-2xl font-bold text-white mb-2">Welcome to Weather Dashboard</h2>
                <p class="text-white/70">
                    Set up your WeatherAPI key to get started with real-time weather data
                </p>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="block text-white/80 text-sm mb-2">WeatherAPI Key</label>
                    <input
                        v-model="inputApiKey"
                        type="text"
                        class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                        placeholder="Enter your WeatherAPI key"
                        @keyup.enter="handleSave"
                    />
                    <p class="text-white/60 text-xs mt-2">
                        Get your free API key at
                        <a
                            href="https://www.weatherapi.com/signup.aspx"
                            target="_blank"
                            class="text-blue-400 hover:text-blue-300 underline"
                        >
                            weatherapi.com
                        </a>
                    </p>
                </div>

                <div class="flex space-x-3">
                    <button
                        @click="handleDemo"
                        class="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    >
                        Use Demo Mode
                    </button>
                    <button
                        @click="handleSave"
                        :disabled="!inputApiKey.trim()"
                        class="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                    >
                        Save & Continue
                    </button>
                </div>

                <div class="text-center">
                    <p class="text-white/50 text-xs">
                        Your API key is stored locally and never shared
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    apiKey: string;
}

defineProps<Props>();

const emit = defineEmits<{
    setApiKey: [key: string];
}>();

const inputApiKey = ref('');

const handleSave = () => {
    if (inputApiKey.value.trim()) {
        emit('setApiKey', inputApiKey.value.trim());
    }
};

const handleDemo = () => {
    // Use empty string to indicate demo mode
    emit('setApiKey', 'demo');
};
</script>
