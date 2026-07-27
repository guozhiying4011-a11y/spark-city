<template>
  <div class="min-h-screen bg-gradient-to-br from-spark-dark via-spark-night to-spark-secondary/20 pb-20">
    <header class="glass-card mx-4 mt-4 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-spark-primary to-spark-secondary flex items-center justify-center">
            <Sparkles class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">{{ currentTitle }}</h1>
            <p class="text-xs text-white/60">{{ currentSubtitle }}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <Zap class="w-5 h-5 text-spark-energy" />
            <span class="text-spark-energy font-bold">{{ gameEngine.state.player.total_energy.toFixed(1) }}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <User class="w-4 h-4 text-white/70" />
            <span class="text-white font-medium text-sm">Lv.{{ gameEngine.state.player.level }}</span>
          </div>
        </div>
      </div>
    </header>

    <main class="px-4 py-4">
      <div v-show="activeTab === 'city'" class="space-y-4">
        <CityView />
        <ActionPanel />
      </div>

      <div v-show="activeTab === 'residents'">
        <ResidentList />
      </div>

      <div v-show="activeTab === 'letters'">
        <LetterBox />
      </div>

      <div v-show="activeTab === 'topics'">
        <TopicManager />
      </div>

      <div v-show="activeTab === 'profile'" class="space-y-4">
        <div class="glass-card p-6">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-spark-primary to-spark-secondary flex items-center justify-center">
              <User class="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">市长</h2>
              <p class="text-white/60 text-sm">Lv.{{ gameEngine.state.player.level }} · 第 {{ gameEngine.state.city.day }} 天</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-white/5 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1">
                <Zap class="w-4 h-4 text-spark-energy" />
                <span class="text-white/60 text-xs">总能量</span>
              </div>
              <p class="text-spark-energy font-bold text-lg">{{ gameEngine.state.player.total_energy.toFixed(1) }}</p>
            </div>
            <div class="bg-white/5 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1">
                <Flame class="w-4 h-4 text-orange-400" />
                <span class="text-white/60 text-xs">连续天数</span>
              </div>
              <p class="text-orange-400 font-bold text-lg">{{ gameEngine.state.player.streak }} 天</p>
            </div>
            <div class="bg-white/5 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1">
                <Building2 class="w-4 h-4 text-blue-400" />
                <span class="text-white/60 text-xs">解锁建筑</span>
              </div>
              <p class="text-blue-400 font-bold text-lg">{{ gameEngine.state.city.unlocked_buildings.length }}</p>
            </div>
            <div class="bg-white/5 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1">
                <Users class="w-4 h-4 text-pink-400" />
                <span class="text-white/60 text-xs">城市人口</span>
              </div>
              <p class="text-pink-400 font-bold text-lg">{{ gameEngine.state.city.population }}</p>
            </div>
          </div>
        </div>

        <div class="glass-card p-4 space-y-3">
          <h3 class="text-white font-bold mb-2 flex items-center gap-2">
            <Moon class="w-5 h-5 text-indigo-400" />
            作息设置
          </h3>
          <div class="flex items-center justify-between">
            <span class="text-white/70 text-sm">早睡目标</span>
            <span class="text-white font-medium">{{ gameEngine.state.player.sleep_target }}:00</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-white/70 text-sm">今日能量获取</span>
            <span class="text-spark-energy font-medium">{{ gameEngine.state.player.today_energy.toFixed(1) }}</span>
          </div>
        </div>

        <button 
          @click="openSleepModal"
          class="w-full glass-card p-4 flex items-center justify-center gap-3 hover:bg-white/10 transition-colors group"
        >
          <Moon class="w-6 h-6 text-indigo-400 group-hover:animate-pulse" />
          <span class="text-white font-medium">结束今天</span>
          <span class="text-white/50 text-sm">(目标: {{ gameEngine.state.player.sleep_target }}:00)</span>
        </button>

        <button 
          @click="resetGame"
          class="w-full glass-card p-4 flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors text-red-400"
        >
          <RotateCcw class="w-5 h-5" />
          <span class="font-medium">重新开始</span>
        </button>
      </div>
    </main>

    <BottomNav :active="activeTab" @change="activeTab = $event" />

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
import { ref, computed } from 'vue';
import { Sparkles, Zap, User, RotateCcw, Moon, Users, Building2, Flame } from 'lucide-vue-next';
import { gameEngine } from './engine/GameEngine.js';
import CityView from './components/CityView.vue';
import ActionPanel from './components/ActionPanel.vue';
import LetterBox from './components/LetterBox.vue';
import TopicManager from './components/TopicManager.vue';
import ResidentList from './components/ResidentList.vue';
import SleepModal from './components/SleepModal.vue';
import BottomNav from './components/BottomNav.vue';

const activeTab = ref('city');
const showSleepModal = ref(false);
const showEndDayModal = ref(false);
const sleepTime = ref(22);

const currentTitle = computed(() => {
  const titles = {
    city: 'Spark City',
    residents: '居民',
    letters: '信箱',
    topics: '话题库',
    profile: '我的'
  };
  return titles[activeTab.value] || 'Spark City';
});

const currentSubtitle = computed(() => {
  if (activeTab.value === 'city') {
    return '把你的人生变成一座城市';
  }
  const subtitles = {
    residents: `${gameEngine.state.residents.length} 位居民`,
    letters: '来自居民的信',
    topics: '口语练习话题',
    profile: '第 ' + gameEngine.state.city.day + ' 天'
  };
  return subtitles[activeTab.value] || '';
});

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
    activeTab.value = 'city';
  }
}
</script>
