<template>
  <div class="min-h-screen bg-gradient-to-br from-spark-dark via-spark-night to-spark-secondary/20">
    <header class="glass-card mx-4 mt-4 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-spark-primary to-spark-secondary flex items-center justify-center">
            <Sparkles class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">Spark City</h1>
            <p class="text-xs text-white/60">把你的人生变成一座城市</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <Zap class="w-5 h-5 text-spark-energy" />
            <span class="text-spark-energy font-bold">{{ gameEngine.state.player.total_energy.toFixed(1) }}</span>
            <span class="text-white/50 text-sm">能量</span>
          </div>
          
          <div class="flex items-center gap-2">
            <User class="w-5 h-5 text-white/70" />
            <span class="text-white font-medium">Lv.{{ gameEngine.state.player.level }}</span>
          </div>
          
          <button @click="resetGame" class="text-white/50 hover:text-white transition-colors">
            <RotateCcw class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <CityView />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionPanel />
            <div class="space-y-6">
              <LetterBox />
            </div>
          </div>
        </div>
        
        <div class="space-y-6">
          <TopicManager />
          
          <div class="glass-card p-4">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users class="w-5 h-5 text-blue-400" />
              居民列表
            </h3>
            
            <div class="space-y-3 max-h-[300px] overflow-y-auto">
              <div 
                v-for="resident in gameEngine.state.residents.slice(0, 10)" 
                :key="resident.id"
                class="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
              >
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-spark-primary/30 to-spark-secondary/30 flex items-center justify-center">
                  <User class="w-5 h-5 text-white/70" />
                </div>
                <div class="flex-1">
                  <p class="text-white font-medium text-sm">{{ resident.name }}</p>
                  <p class="text-white/50 text-xs">{{ resident.occupationName }} · {{ resident.age }}岁</p>
                </div>
                <Heart class="w-4 h-4 text-pink-400" />
              </div>
            </div>
            
            <p v-if="gameEngine.state.residents.length > 10" class="text-white/40 text-xs mt-2 text-center">
              还有 {{ gameEngine.state.residents.length - 10 }} 位居民...
            </p>
          </div>

          <button 
            @click="openSleepModal"
            class="w-full glass-card p-4 flex items-center justify-center gap-3 hover:bg-white/10 transition-colors group"
          >
            <Moon class="w-6 h-6 text-indigo-400 group-hover:animate-pulse" />
            <span class="text-white font-medium">结束今天</span>
            <span class="text-white/50 text-sm">(目标: {{ gameEngine.state.player.sleep_target }}:00)</span>
          </button>
        </div>
      </div>
    </main>

    <SleepModal 
      v-if="showSleepModal || gameEngine.state.is_sleeping || gameEngine.state.is_night" 
      @close="showSleepModal = false"
    />

    <div 
      v-if="showEndDayModal" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showEndDayModal = false"
    >
      <div class="glass-card w-full max-w-sm p-6">
        <h3 class="text-xl font-bold text-white mb-4 text-center">结束今天</h3>
        
        <div class="mb-4">
          <label class="text-white/70 text-sm mb-2 block">选择就寝时间</label>
          <div class="flex items-center justify-center gap-2">
            <input 
              type="range" 
              v-model="sleepTime" 
              min="18" 
              max="24" 
              step="0.5"
              class="w-full accent-spark-primary"
            />
            <span class="text-white font-bold w-12 text-right">{{ formatTime(sleepTime) }}</span>
          </div>
        </div>

        <div class="text-center mb-6">
          <p class="text-white/60 text-sm">
            {{ sleepTime <= gameEngine.state.player.sleep_target ? '✅ 早睡！城市获得成长加成' : '🌙 正常入睡' }}
          </p>
        </div>

        <div class="flex gap-3">
          <button @click="showEndDayModal = false" class="flex-1 spark-btn-secondary">
            取消
          </button>
          <button @click="endDay" class="flex-1 spark-btn">
            晚安
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Sparkles, Zap, User, RotateCcw, Moon, Users } from 'lucide-vue-next';
import { gameEngine } from './engine/GameEngine.js';
import CityView from './components/CityView.vue';
import ActionPanel from './components/ActionPanel.vue';
import LetterBox from './components/LetterBox.vue';
import TopicManager from './components/TopicManager.vue';
import SleepModal from './components/SleepModal.vue';

const showSleepModal = ref(false);
const showEndDayModal = ref(false);
const sleepTime = ref(22);

function openSleepModal() {
  showEndDayModal.value = true;
  const now = new Date();
  sleepTime.value = Math.round(now.getHours() + now.getMinutes() / 60 * 2) / 2;
}

function formatTime(hours) {
  const h = Math.floor(hours);
  const m = (hours - h) * 60;
  return `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
}

function endDay() {
  showEndDayModal.value = false;
  showSleepModal.value = true;
  gameEngine.endDay(sleepTime.value);
}

function resetGame() {
  if (confirm('确定要重新开始吗？所有进度将会丢失。')) {
    gameEngine.reset();
    showSleepModal.value = false;
  }
}
</script>
