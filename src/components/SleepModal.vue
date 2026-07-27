<template>
  <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="text-center">
      <div v-if="gameEngine.state.is_sleeping && !gameEngine.state.is_night" class="animate-pulse">
        <Moon class="w-24 h-24 text-indigo-400 mx-auto mb-4" />
        <p class="text-white text-xl">准备入睡...</p>
      </div>

      <div v-else-if="gameEngine.state.is_night" class="animate-float">
        <div class="relative">
          <Moon class="w-32 h-32 text-indigo-300 mx-auto" />
          <div class="absolute inset-0 flex items-center justify-center">
            <Stars class="w-4 h-4 text-white/50 animate-pulse" style="top: 10%; left: 20%" />
            <Stars class="w-3 h-3 text-white/30 animate-pulse" style="top: 20%; right: 15%" />
            <Stars class="w-5 h-5 text-white/40 animate-pulse" style="bottom: 30%; left: 10%" />
          </div>
        </div>
        <p class="text-white/70 text-lg mt-4">夜晚降临...</p>
        <p class="text-white/50 text-sm mt-2">居民们回家休息，城市静静成长</p>
      </div>

      <div v-else>
        <Sun class="w-24 h-24 text-yellow-400 mx-auto mb-4 animate-spin-slow" />
        <p class="text-white text-xl">新的一天开始了！</p>
        <p class="text-white/70 text-sm mt-2">第 {{ gameEngine.state.city.day }} 天</p>
        
        <button 
          @click="$emit('close')"
          class="mt-6 spark-btn"
        >
          开始新的一天
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Moon, Stars, Sun } from 'lucide-vue-next';
import { gameEngine } from '../engine/GameEngine.js';

defineEmits(['close']);
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 10s linear infinite;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
