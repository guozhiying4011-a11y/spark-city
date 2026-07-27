<template>
  <div class="glass-card p-4">
    <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
      <Sparkles class="w-5 h-5 text-spark-energy" />
      记录今天的成长
    </h3>

    <div class="grid grid-cols-2 gap-3 mb-4">
      <button 
        v-for="action in actions" 
        :key="action.type"
        @click="selectAction(action)"
        class="flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-300 hover:scale-105"
        :class="selectedAction?.type === action.type ? 'bg-spark-primary/30 ring-2 ring-spark-primary' : 'bg-white/5 hover:bg-white/10'"
      >
        <component :is="action.icon" class="w-8 h-8" :class="action.color" />
        <span class="text-sm font-medium text-white">{{ action.name }}</span>
      </button>
    </div>

    <div v-if="selectedAction" class="space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-white/70">时长（分钟）</span>
        <input 
          type="range" 
          v-model="duration" 
          :min="5" 
          :max="120" 
          :step="5"
          class="w-32 accent-spark-primary"
        />
        <span class="text-sm text-white font-medium">{{ duration }} min</span>
      </div>

      <textarea 
        v-model="notes" 
        placeholder="写点什么（可选）..."
        class="w-full p-3 bg-white/5 rounded-lg text-white placeholder-white/40 text-sm resize-none"
        rows="3"
      ></textarea>

      <button 
        v-if="selectedAction.type === 'speaking'"
        @click="openSpeakingModal"
        class="w-full spark-btn flex items-center justify-center gap-2"
      >
        <Mic class="w-4 h-4" />
        开始口语练习
      </button>

      <button 
        v-else
        @click="submitAction"
        class="w-full spark-btn flex items-center justify-center gap-2"
      >
        <Zap class="w-4 h-4" />
        获得能量 +{{ estimatedEnergy }}
      </button>
    </div>

    <div v-if="message" class="mt-4 p-3 rounded-lg" :class="messageType === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
      {{ message }}
    </div>

    <div class="mt-4 pt-4 border-t border-white/10">
      <div class="flex items-center justify-between">
        <span class="text-sm text-white/70">今日能量</span>
        <span class="text-spark-energy font-bold">{{ gameEngine.state.player.daily_energy.toFixed(1) }}</span>
      </div>
      <div class="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-spark-energy to-yellow-400 transition-all duration-500"
          :style="{ width: `${Math.min(gameEngine.state.player.daily_energy / 10 * 100, 100)}%` }"
        ></div>
      </div>
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
import { Sparkles, Zap, BookOpen, Mic, PenTool, Dumbbell, Moon, CheckSquare, Globe } from 'lucide-vue-next';
import { gameEngine } from '../engine/GameEngine.js';
import SpeakingModal from './SpeakingModal.vue';

const selectedAction = ref(null);
const duration = ref(30);
const notes = ref('');
const message = ref('');
const messageType = ref('success');
const showSpeakingModal = ref(false);

const actions = [
  { type: 'english', name: '学英语', icon: Globe, color: 'text-blue-400' },
  { type: 'speaking', name: '口语练习', icon: Mic, color: 'text-purple-400' },
  { type: 'reading', name: '阅读', icon: BookOpen, color: 'text-green-400' },
  { type: 'creativity', name: '创作', icon: PenTool, color: 'text-pink-400' },
  { type: 'exercise', name: '运动', icon: Dumbbell, color: 'text-orange-400' },
  { type: 'sleep', name: '早睡', icon: Moon, color: 'text-indigo-400' },
  { type: 'plan', name: '完成计划', icon: CheckSquare, color: 'text-cyan-400' }
];

const estimatedEnergy = computed(() => {
  if (!selectedAction.value) return 0;
  const config = {
    english: { base: 1 },
    speaking: { base: 1.5 },
    reading: { base: 1 },
    creativity: { base: 1.5 },
    exercise: { base: 1 },
    sleep: { base: 1 },
    plan: { base: 0.5 }
  };
  const base = config[selectedAction.value.type]?.base || 1;
  const durationBonus = Math.min(duration.value / 30, 2.0);
  return Math.round(base * durationBonus * 10) / 10;
});

function selectAction(action) {
  selectedAction.value = action;
  duration.value = 30;
  notes.value = '';
  message.value = '';
}

function submitAction() {
  if (!selectedAction.value) return;
  
  const result = gameEngine.recordBehavior({
    type: selectedAction.value.type,
    duration: duration.value,
    notes: notes.value
  });
  
  if (result.success) {
    message.value = `✅ 获得 ${result.energy} 能量！`;
    messageType.value = 'success';
    selectedAction.value = null;
    notes.value = '';
  } else {
    message.value = result.message;
    messageType.value = 'error';
  }
  
  setTimeout(() => {
    message.value = '';
  }, 3000);
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
    message.value = `✅ 口语练习完成！获得 ${result.energy} 能量！`;
    messageType.value = 'success';
  } else {
    message.value = result.message;
    messageType.value = 'error';
  }
  
  showSpeakingModal.value = false;
  selectedAction.value = null;
  
  setTimeout(() => {
    message.value = '';
  }, 3000);
}
</script>
