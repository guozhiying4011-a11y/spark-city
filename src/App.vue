<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-left">
        <div class="header-logo">
          <Sparkles class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="header-title">{{ currentTitle }}</h1>
          <p class="header-subtitle">{{ currentSubtitle }}</p>
        </div>
      </div>
      
      <div class="header-right">
        <div class="energy-chip">
          <Zap class="w-4 h-4" />
          <span class="energy-num">{{ gameEngine.state.player.total_energy.toFixed(1) }}</span>
        </div>
        
        <div class="level-chip">
          <span>Lv.{{ gameEngine.state.player.level }}</span>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div v-show="activeTab === 'city'" class="city-tab">
        <CityView />
      </div>

      <div v-show="activeTab === 'action'" class="content-tab">
        <ActionPanel />
      </div>

      <div v-show="activeTab === 'residents'" class="content-tab">
        <ResidentList />
      </div>

      <div v-show="activeTab === 'letters'" class="content-tab">
        <LetterBox />
      </div>

      <div v-show="activeTab === 'profile'" class="content-tab">
        <div class="profile-card">
          <div class="profile-header">
            <div class="profile-avatar">
              <User class="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 class="profile-name">市长</h2>
              <p class="profile-meta">Lv.{{ gameEngine.state.player.level }} · 第 {{ gameEngine.state.city.day }} 天</p>
            </div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card stat-energy">
              <Zap class="w-5 h-5" />
              <span class="stat-label">总能量</span>
              <span class="stat-value">{{ gameEngine.state.player.total_energy.toFixed(1) }}</span>
            </div>
            <div class="stat-card stat-streak">
              <Flame class="w-5 h-5" />
              <span class="stat-label">连续天数</span>
              <span class="stat-value">{{ gameEngine.state.player.streak }} 天</span>
            </div>
            <div class="stat-card stat-building">
              <Building2 class="w-5 h-5" />
              <span class="stat-label">解锁建筑</span>
              <span class="stat-value">{{ gameEngine.state.city.unlocked_buildings.length }}</span>
            </div>
            <div class="stat-card stat-population">
              <Users class="w-5 h-5" />
              <span class="stat-label">城市人口</span>
              <span class="stat-value">{{ gameEngine.state.city.population }}</span>
            </div>
          </div>
        </div>

        <div class="sleep-card">
          <h3 class="card-title">
            <Moon class="w-5 h-5" />
            早睡目标
          </h3>
          <p class="sleep-hint">设定你的早睡目标时间，达成可获得额外城市成长加成</p>
          
          <div class="sleep-control">
            <button @click="decreaseSleepTarget" class="sleep-btn">−</button>
            <div class="sleep-display">
              <span class="sleep-time">{{ formatHour(gameEngine.state.player.sleep_target) }}</span>
              <span class="sleep-label">目标就寝</span>
            </div>
            <button @click="increaseSleepTarget" class="sleep-btn">+</button>
          </div>

          <div class="sleep-quick">
            <button 
              v-for="h in [20, 21, 22, 23]" 
              :key="h"
              @click="setSleepTarget(h)"
              class="quick-btn"
              :class="gameEngine.state.player.sleep_target === h ? 'quick-btn-active' : ''"
            >
              {{ formatHour(h) }}
            </button>
          </div>

          <div class="daily-energy-row">
            <span>今日能量获取</span>
            <span class="daily-energy">{{ gameEngine.state.player.daily_energy.toFixed(1) }}</span>
          </div>
        </div>

        <button 
          @click="openSleepModal"
          class="end-day-btn"
        >
          <Moon class="w-5 h-5" />
          <span>结束今天</span>
        </button>

        <div class="data-card">
          <h3 class="card-title">
            <span>📦</span>
            数据管理
          </h3>
          <p class="data-hint">导出存档备份，或从文件恢复进度</p>
          
          <div class="data-buttons">
            <button @click="exportData" class="data-btn export-btn">
              <Download class="w-4 h-4" />
              <span>导出数据</span>
            </button>
            <label class="data-btn import-btn">
              <Upload class="w-4 h-4" />
              <span>导入数据</span>
              <input 
                type="file" 
                accept=".json" 
                @change="importData"
                class="hidden-input"
              />
            </label>
          </div>
        </div>

        <button 
          @click="resetGame"
          class="reset-btn"
        >
          <RotateCcw class="w-4 h-4" />
          <span>重新开始</span>
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
      class="end-day-modal-bg"
      @click.self="showEndDayModal = false"
    >
      <div class="end-day-modal">
        <h3 class="end-day-title">🌙 结束今天</h3>
        
        <div class="end-day-content">
          <label class="end-day-label">选择就寝时间</label>
          <div class="end-day-slider">
            <input 
              type="range" 
              v-model="sleepTime" 
              min="18" 
              max="24" 
              step="0.5"
              class="sleep-slider"
            />
            <span class="end-day-time">{{ formatTime(sleepTime) }}</span>
          </div>

          <p class="end-day-hint">
            {{ sleepTime <= gameEngine.state.player.sleep_target ? '✅ 早睡！城市获得成长加成' : '🌙 正常入睡' }}
          </p>
        </div>

        <div class="end-day-actions">
          <button @click="showEndDayModal = false" class="cancel-btn">取消</button>
          <button @click="endDay" class="goodnight-btn">晚安</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Sparkles, Zap, User, RotateCcw, Moon, Users, Building2, Flame, Download, Upload } from 'lucide-vue-next';
import { gameEngine } from './engine/GameEngine.js';
import { CITY_PHASES } from './data/buildings.js';
import CityView from './components/CityView.vue';
import ActionPanel from './components/ActionPanel.vue';
import LetterBox from './components/LetterBox.vue';
import ResidentList from './components/ResidentList.vue';
import SleepModal from './components/SleepModal.vue';
import BottomNav from './components/BottomNav.vue';

const activeTab = ref('city');
const showSleepModal = ref(false);
const showEndDayModal = ref(false);
const sleepTime = ref(22);

const currentTitle = computed(() => {
  return { city: 'Spark City', action: '记录行动', residents: '居民', letters: '信件', profile: '我的' }[activeTab.value] || 'Spark City';
});

const currentSubtitle = computed(() => {
  if (activeTab.value === 'city') {
    return '第 ' + gameEngine.state.city.day + ' 天 · ' + getCityPhaseName();
  }
  return {
    action: '记录现实行为，获取能量',
    residents: `${gameEngine.state.residents.length} 位居民`,
    letters: '来自居民的信',
    profile: '管理你的城市'
  }[activeTab.value] || '';
});

function getCityPhaseName() {
  const phase = CITY_PHASES.find(p => gameEngine.state.city.day >= p.day_range[0] && gameEngine.state.city.day <= p.day_range[1]);
  return phase?.name || '荒地期';
}

function formatHour(h) {
  return `${h.toString().padStart(2, '0')}:00`;
}

function formatTime(hours) {
  const h = Math.floor(hours);
  const m = (hours - h) * 60;
  return `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
}

function increaseSleepTarget() {
  const current = gameEngine.state.player.sleep_target;
  if (current < 24) {
    gameEngine.setSleepTarget(current + 1);
  }
}

function decreaseSleepTarget() {
  const current = gameEngine.state.player.sleep_target;
  if (current > 18) {
    gameEngine.setSleepTarget(current - 1);
  }
}

function setSleepTarget(h) {
  gameEngine.setSleepTarget(h);
}

function openSleepModal() {
  showEndDayModal.value = true;
  const now = new Date();
  sleepTime.value = Math.round(now.getHours() + now.getMinutes() / 60 * 2) / 2;
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

function exportData() {
  const data = JSON.parse(JSON.stringify(gameEngine.state));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `lifespark-save-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!confirm('导入数据将覆盖当前进度，确定继续吗？')) {
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.player || !data.city) {
        alert('文件格式不正确，请选择有效的存档文件。');
        event.target.value = '';
        return;
      }
      gameEngine.restore(data);
      gameEngine.save();
      showSleepModal.value = false;
      activeTab.value = 'city';
      alert('数据导入成功！');
    } catch (err) {
      alert('导入失败：文件解析错误。');
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  padding-bottom: 88px;
}

.app-header {
  margin: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fef3e2 0%, #f5e6c8 100%);
  border: 3px solid #642D0E;
  border-radius: 16px;
  box-shadow: 0 6px 0 rgba(61, 26, 7, 0.35);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-left { display: flex; align-items: center; gap: 10px; }
.header-logo {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FB8F4E, #c9a227);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #642D0E;
  box-shadow: 0 2px 0 rgba(61, 26, 7, 0.4);
}
.header-title { font-size: 1.1rem; font-weight: 800; color: #642D0E; }
.header-subtitle { font-size: 0.7rem; color: #8b4513; }

.header-right { display: flex; align-items: center; gap: 6px; }
.energy-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #c9a227, #fbbf24);
  color: white;
  padding: 5px 10px;
  border-radius: 999px;
  font-weight: 800;
  border: 2px solid #642D0E;
  box-shadow: 0 2px 0 rgba(61, 26, 7, 0.4);
}
.energy-num { font-size: 0.85rem; }

.level-chip {
  background: linear-gradient(135deg, #6D7E34, #8fa346);
  color: white;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  border: 2px solid #642D0E;
  box-shadow: 0 2px 0 rgba(61, 26, 7, 0.4);
}

.app-main { padding: 0 16px; }
.city-tab { margin: 0 -16px; }
.content-tab { display: flex; flex-direction: column; gap: 16px; }

.profile-card {
  background: linear-gradient(135deg, #fef3e2 0%, #f5e6c8 100%);
  border: 3px solid #642D0E;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 0 rgba(61, 26, 7, 0.3);
}
.profile-header { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.profile-avatar {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FB8F4E, #c9a227);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #642D0E;
  box-shadow: 0 3px 0 rgba(61, 26, 7, 0.4);
}
.profile-name { font-size: 1.2rem; font-weight: 800; color: #642D0E; }
.profile-meta { font-size: 0.75rem; color: #8b4513; }

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.stat-card {
  padding: 10px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: white;
  border: 2px solid #642D0E;
  box-shadow: 0 3px 0 rgba(61, 26, 7, 0.3);
}
.stat-energy { background: linear-gradient(135deg, #c9a227, #fbbf24); }
.stat-streak { background: linear-gradient(135deg, #FB8F4E, #fdba74); }
.stat-building { background: linear-gradient(135deg, #6D7E34, #8fa346); }
.stat-population { background: linear-gradient(135deg, #8b4513, #a0522d); }
.stat-label { font-size: 0.65rem; opacity: 0.9; font-weight: 600; }
.stat-value { font-size: 1.3rem; font-weight: 800; }

.sleep-card {
  background: linear-gradient(135deg, #fef3e2 0%, #f5e6c8 100%);
  border: 3px solid #642D0E;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 6px 0 rgba(61, 26, 7, 0.3);
}
.card-title {
  font-size: 1rem;
  font-weight: 800;
  color: #642D0E;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sleep-hint { font-size: 0.75rem; color: #8b4513; margin-bottom: 14px; }

.sleep-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 14px;
}
.sleep-btn {
  width: 42px; height: 42px;
  border-radius: 50%;
  background: linear-gradient(180deg, #FB8F4E, #e67a3a);
  color: white;
  border: 2px solid #642D0E;
  font-size: 1.4rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 3px 0 rgba(61, 26, 7, 0.4);
  transition: all 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sleep-btn:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 rgba(61, 26, 7, 0.4);
}
.sleep-display {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sleep-time { font-size: 1.8rem; font-weight: 800; color: #642D0E; }
.sleep-label { font-size: 0.7rem; color: #8b4513; }

.sleep-quick {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.quick-btn {
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid #8b4513;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #642D0E;
  cursor: pointer;
  transition: all 0.1s;
}
.quick-btn:hover { background: rgba(251, 143, 78, 0.2); }
.quick-btn-active {
  background: linear-gradient(180deg, #FB8F4E, #e67a3a);
  color: white;
  border-color: #642D0E;
  box-shadow: 0 2px 0 rgba(61, 26, 7, 0.4);
}

.daily-energy-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 2px dashed rgba(100, 45, 14, 0.2);
  font-size: 0.8rem;
  color: #642D0E;
  font-weight: 700;
}
.daily-energy { font-size: 1rem; font-weight: 800; color: #c9a227; }

.end-day-btn {
  width: 100%;
  padding: 13px;
  background: linear-gradient(180deg, #6D7E34, #4a5a20);
  color: white;
  border: 2px solid #642D0E;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 0 rgba(61, 26, 7, 0.5);
  transition: all 0.1s;
}
.end-day-btn:hover { transform: translateY(2px); box-shadow: 0 2px 0 rgba(61, 26, 7, 0.5); }

.data-card {
  background: linear-gradient(135deg, #fef3e2 0%, #f5e6c8 100%);
  border: 3px solid #642D0E;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 6px 0 rgba(61, 26, 7, 0.3);
}
.data-hint { font-size: 0.75rem; color: #8b4513; margin-bottom: 14px; }

.data-buttons {
  display: flex;
  gap: 10px;
}
.data-btn {
  flex: 1;
  padding: 12px 10px;
  border: 2px solid #642D0E;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.1s;
  color: #642D0E;
}
.export-btn {
  background: linear-gradient(180deg, #FB8F4E, #e67a3a);
  color: white;
  box-shadow: 0 3px 0 rgba(61, 26, 7, 0.5);
}
.export-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 0 rgba(61, 26, 7, 0.5); }
.export-btn:active { transform: translateY(2px); box-shadow: 0 1px 0 rgba(61, 26, 7, 0.5); }
.import-btn {
  background: linear-gradient(180deg, #8fa346, #6D7E34);
  color: white;
  box-shadow: 0 3px 0 rgba(61, 26, 7, 0.5);
}
.import-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 0 rgba(61, 26, 7, 0.5); }
.import-btn:active { transform: translateY(2px); box-shadow: 0 1px 0 rgba(61, 26, 7, 0.5); }
.hidden-input { display: none; }

.reset-btn {
  width: 100%;
  padding: 10px;
  background: rgba(139, 69, 19, 0.1);
  color: #b91c1c;
  border: 2px solid #b91c1c;
  border-radius: 14px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.1s;
}
.reset-btn:hover { background: rgba(185, 28, 28, 0.1); }

.end-day-modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(61, 26, 7, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
}
.end-day-modal {
  background: linear-gradient(135deg, #fef3e2 0%, #f5e6c8 100%);
  border: 3px solid #642D0E;
  border-radius: 18px;
  padding: 22px;
  max-width: 360px;
  width: 100%;
  box-shadow: 0 10px 0 rgba(61, 26, 7, 0.4);
}
.end-day-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #642D0E;
  text-align: center;
  margin-bottom: 18px;
}
.end-day-content { margin-bottom: 20px; }
.end-day-label { font-size: 0.85rem; color: #642D0E; font-weight: 700; display: block; margin-bottom: 10px; }
.end-day-slider { display: flex; align-items: center; gap: 10px; }
.sleep-slider { flex: 1; accent-color: #FB8F4E; }
.end-day-time { font-size: 1rem; font-weight: 800; color: #642D0E; min-width: 50px; text-align: right; }
.end-day-hint { font-size: 0.75rem; color: #8b4513; text-align: center; margin-top: 10px; font-weight: 600; }

.end-day-actions { display: flex; gap: 10px; }
.cancel-btn {
  flex: 1;
  padding: 10px;
  background: rgba(100, 45, 14, 0.1);
  color: #642D0E;
  border: 2px solid #642D0E;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
.goodnight-btn {
  flex: 1;
  padding: 10px;
  background: linear-gradient(180deg, #6D7E34, #4a5a20);
  color: white;
  border: 2px solid #642D0E;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 3px 0 rgba(61, 26, 7, 0.4);
}
</style>
