<template>
  <div class="glass-card p-4">
    <h3 class="action-title">
      <span class="title-icon">✨</span>
      记录今天的成长
    </h3>

    <div class="grid grid-cols-2 gap-3 mb-4">
      <button 
        v-for="action in actions" 
        :key="action.type"
        @click="selectAction(action)"
        class="action-btn"
        :class="selectedAction?.type === action.type ? 'action-btn-active' : ''"
      >
        <span class="action-emoji">{{ action.emoji }}</span>
        <span class="action-name">{{ action.name }}</span>
        <span class="action-energy">{{ energyRangeText(action) }}</span>
      </button>
    </div>

    <div v-if="selectedAction" class="action-detail">
      <!-- 时长型行为 -->
      <div v-if="selectedAction.unit === 'duration'" class="duration-row">
        <span class="duration-label">⏱️ 时长</span>
        <input 
          type="range" 
          v-model="duration" 
          :min="5" 
          :max="120" 
          :step="5"
          class="duration-slider"
        />
        <span class="duration-value">{{ duration }} 分钟</span>
      </div>

      <!-- 数量型行为 -->
      <div v-else-if="selectedAction.unit === 'count'" class="duration-row">
        <span class="duration-label">📋 数量</span>
        <div class="count-controls">
          <button @click="decreaseCount" class="count-btn">−</button>
          <span class="count-value">{{ count }} 项</span>
          <button @click="increaseCount" class="count-btn">+</button>
        </div>
      </div>

      <!-- 确认型行为 -->
      <div v-else class="confirm-row">
        <span class="confirm-icon">{{ selectedAction.emoji }}</span>
        <span class="confirm-text">{{ selectedAction.hint || '点击确认完成' }}</span>
      </div>

      <textarea 
        v-model="notes" 
        placeholder="写点什么（可选）..."
        class="action-notes"
        rows="3"
      ></textarea>

      <button 
        v-if="selectedAction.type === 'speaking'"
        @click="openSpeakingModal"
        class="submit-btn speaking-btn"
      >
        🎤 开始口语练习
      </button>

      <button 
        v-else
        @click="submitAction"
        class="submit-btn"
      >
        ⚡ 获得能量 +{{ estimatedEnergy }}
      </button>
    </div>

    <div v-if="message" class="action-message" :class="messageType === 'success' ? 'msg-success' : 'msg-error'">
      {{ message }}
    </div>

    <div class="energy-summary">
      <div class="summary-header">
        <span>今日能量</span>
        <span class="summary-energy">{{ gameEngine.state.player.daily_energy.toFixed(1) }}</span>
      </div>
      <div class="energy-bar">
        <div 
          class="energy-bar-fill"
          :style="{ width: `${Math.min(gameEngine.state.player.daily_energy / 30 * 100, 100)}%` }"
        ></div>
      </div>
      <p class="summary-hint">连续打卡 {{ gameEngine.state.player.streak }} 天，能量加成 {{ Math.min(gameEngine.state.player.streak * 8, 80) }}%</p>
    </div>
  </div>

  <SpeakingModal 
    v-if="showSpeakingModal" 
    @close="showSpeakingModal = false"
    @submit="handleSpeakingSubmit"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { gameEngine } from '../engine/GameEngine.js';
import SpeakingModal from './SpeakingModal.vue';

const selectedAction = ref(null);
const duration = ref(30);
const count = ref(1);
const notes = ref('');
const message = ref('');
const messageType = ref('success');
const showSpeakingModal = ref(false);

const actions = [
  { type: 'english', name: '学英语', emoji: '🌍', base: 3, unit: 'duration' },
  { type: 'speaking', name: '口语练习', emoji: '🎤', base: 4, unit: 'duration' },
  { type: 'reading', name: '阅读', emoji: '📖', base: 3, unit: 'duration' },
  { type: 'creativity', name: '创作', emoji: '✏️', base: 4, unit: 'duration' },
  { type: 'exercise', name: '运动', emoji: '💪', base: 3, unit: 'duration' },
  { type: 'sleep', name: '早睡', emoji: '🌙', base: 5, unit: 'check', hint: '今晚已按目标时间就寝' },
  { type: 'plan', name: '完成计划', emoji: '✅', base: 2, unit: 'count', maxCount: 5 }
];

function energyRangeText(action) {
  if (action.unit === 'duration') {
    return `+${action.base}~${action.base * 2}`;
  }
  if (action.unit === 'count') {
    return `+${action.base}~${action.base * (action.maxCount || 5)}`;
  }
  return `+${action.base}`;
}

const estimatedEnergy = computed(() => {
  if (!selectedAction.value) return 0;
  const base = selectedAction.value.base;
  const streakBonus = 1.0 + Math.min(gameEngine.state.player.streak * 0.08, 0.8);

  if (selectedAction.value.unit === 'duration') {
    const durationBonus = Math.min(duration.value / 30, 2.0);
    return Math.round(base * durationBonus * streakBonus * 10) / 10;
  }
  if (selectedAction.value.unit === 'count') {
    return Math.round(base * count.value * streakBonus * 10) / 10;
  }
  // check 型：固定能量
  return Math.round(base * streakBonus * 10) / 10;
});

function selectAction(action) {
  selectedAction.value = action;
  duration.value = 30;
  count.value = 1;
  notes.value = '';
  message.value = '';
}

function increaseCount() {
  const max = selectedAction.value?.maxCount || 5;
  if (count.value < max) count.value++;
}

function decreaseCount() {
  if (count.value > 1) count.value--;
}

function submitAction() {
  if (!selectedAction.value) return;

  const payload = {
    type: selectedAction.value.type,
    notes: notes.value
  };

  if (selectedAction.value.unit === 'duration') {
    payload.duration = duration.value;
  } else if (selectedAction.value.unit === 'count') {
    payload.count = count.value;
  }

  const result = gameEngine.recordBehavior(payload);

  if (result.success) {
    message.value = `🎉 获得 ${result.energy} 能量！城市正在成长！`;
    messageType.value = 'success';
    selectedAction.value = null;
    notes.value = '';
  } else {
    message.value = result.message;
    messageType.value = 'error';
  }

  setTimeout(() => { message.value = ''; }, 3000);
}

function openSpeakingModal() {
  showSpeakingModal.value = true;
}

function handleSpeakingSubmit(data) {
  const result = gameEngine.recordBehavior({
    type: 'speaking',
    duration: data.duration,
    notes: data.notes,
    question_id: data.questionId,
    topic_id: data.topicId
  });
  
  if (result.success) {
    message.value = `🎉 口语练习完成！获得 ${result.energy} 能量！`;
    messageType.value = 'success';
  } else {
    message.value = result.message;
    messageType.value = 'error';
  }
  
  showSpeakingModal.value = false;
  selectedAction.value = null;
  
  setTimeout(() => { message.value = ''; }, 3000);
}
</script>

<style scoped>
.action-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #7c2d12;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.title-icon { font-size: 1.3rem; }

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid transparent;
  transition: all 0.3s;
  cursor: pointer;
}
.action-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}
.action-btn-active {
  background: linear-gradient(135deg, #fed7aa, #fdba74);
  border-color: #f97316;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}
.action-emoji { font-size: 2rem; }
.action-name { font-size: 0.875rem; font-weight: 600; color: #7c2d12; }
.action-energy { font-size: 0.7rem; color: #f59e0b; font-weight: 700; }

.action-detail {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.duration-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.duration-label { font-size: 0.875rem; color: #7c2d12; font-weight: 600; white-space: nowrap; }
.duration-slider { flex: 1; accent-color: #f97316; }
.duration-value { font-size: 0.875rem; color: #7c2d12; font-weight: 700; min-width: 70px; text-align: right; }

.count-controls {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}
.count-btn {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: linear-gradient(180deg, #f97316, #fb923c);
  color: white;
  border: none;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(249, 115, 22, 0.4);
  transition: transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.count-btn:active { transform: translateY(2px); }
.count-value { font-size: 1rem; color: #7c2d12; font-weight: 700; min-width: 50px; text-align: center; }

.confirm-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: rgba(254, 215, 170, 0.5);
  border-radius: 12px;
  border: 1px dashed #f97316;
}
.confirm-icon { font-size: 1.5rem; }
.confirm-text { font-size: 0.875rem; color: #7c2d12; font-weight: 600; }

.action-notes {
  width: 100%;
  padding: 12px;
  background: white;
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 10px;
  color: #451a03;
  font-size: 0.875rem;
  resize: none;
  font-family: inherit;
}
.action-notes::placeholder { color: #c4b5a0; }
.action-notes:focus { outline: none; border-color: #f97316; }

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #f97316, #fb923c);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}
.submit-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4); }
.speaking-btn { background: linear-gradient(135deg, #ec4899, #f472b6); box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3); }

.action-message {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
}
.msg-success { background: #d1fae5; color: #047857; }
.msg-error { background: #fee2e2; color: #b91c1c; }

.energy-summary {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(249, 115, 22, 0.2);
}
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.summary-header span:first-child { font-size: 0.875rem; color: #7c2d12; font-weight: 600; }
.summary-energy { font-size: 1.25rem; font-weight: 800; color: #f59e0b; }

.energy-bar {
  height: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
}
.energy-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #f97316, #ec4899);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.summary-hint { font-size: 0.75rem; color: #9a3412; }
</style>
