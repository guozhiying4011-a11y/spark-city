<template>
  <div class="glass-card p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-white flex items-center gap-2">
        <Mail class="w-5 h-5 text-spark-primary" />
        居民来信
      </h3>
      <span 
        v-if="unreadCount > 0"
        class="px-2 py-1 bg-red-500 text-white text-xs rounded-full"
      >
        {{ unreadCount }}
      </span>
    </div>

    <div v-if="gameEngine.state.letters.length === 0" class="text-center py-8">
      <Mail class="w-12 h-12 text-white/20 mx-auto mb-2" />
      <p class="text-white/50 text-sm">暂无来信</p>
      <p class="text-white/30 text-xs mt-1">随着城市发展，居民会给你写信</p>
    </div>

    <div v-else class="space-y-3 max-h-[400px] overflow-y-auto">
      <div 
        v-for="letter in sortedLetters" 
        :key="letter.id"
        @click="openLetter(letter)"
        class="p-3 rounded-lg cursor-pointer transition-all duration-300"
        :class="letter.read ? 'bg-white/5 hover:bg-white/10' : 'bg-spark-primary/20 hover:bg-spark-primary/30'"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-white font-medium text-sm">{{ letter.sender }}</span>
              <span 
                class="text-xs px-2 py-0.5 rounded-full"
                :class="getLetterTypeClass(letter.type)"
              >
                {{ getLetterTypeName(letter.type) }}
              </span>
            </div>
            <p class="text-white/60 text-xs mt-1 line-clamp-2">{{ letter.content.substring(0, 50) }}...</p>
          </div>
          <span class="text-white/40 text-xs">第 {{ letter.date }} 天</span>
        </div>
      </div>
    </div>

    <div 
      v-if="selectedLetter" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="selectedLetter = null"
    >
      <div class="glass-card w-full max-w-md p-6 relative">
        <button @click="selectedLetter = null" class="absolute top-4 right-4 text-white/60 hover:text-white">
          <X class="w-6 h-6" />
        </button>

        <div class="flex items-center gap-2 mb-4">
          <span 
            class="text-xs px-2 py-1 rounded-full"
            :class="getLetterTypeClass(selectedLetter.type)"
          >
            {{ getLetterTypeName(selectedLetter.type) }}
          </span>
          <span class="text-white/50 text-xs">第 {{ selectedLetter.date }} 天</span>
        </div>

        <h4 class="text-white font-bold mb-4">{{ selectedLetter.sender }}</h4>
        
        <div class="bg-white/5 rounded-lg p-4 mb-4">
          <p class="text-white/90 whitespace-pre-line leading-relaxed">{{ selectedLetter.content }}</p>
        </div>

        <button @click="markAsRead" class="w-full spark-btn-secondary">
          已读
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Mail, X } from 'lucide-vue-next';
import { gameEngine } from '../engine/GameEngine.js';

const selectedLetter = ref(null);

const unreadCount = computed(() => gameEngine.getUnreadLettersCount());

const sortedLetters = computed(() => {
  return [...gameEngine.state.letters].sort((a, b) => b.date - a.date);
});

function openLetter(letter) {
  selectedLetter.value = letter;
}

function markAsRead() {
  if (selectedLetter.value) {
    gameEngine.markLetterAsRead(selectedLetter.value.id);
    selectedLetter.value = null;
  }
}

function getLetterTypeClass(type) {
  const classes = {
    wish: 'bg-yellow-500/20 text-yellow-400',
    thanks: 'bg-green-500/20 text-green-400',
    event: 'bg-purple-500/20 text-purple-400',
    update: 'bg-blue-500/20 text-blue-400'
  };
  return classes[type] || 'bg-gray-500/20 text-gray-400';
}

function getLetterTypeName(type) {
  const names = {
    wish: '愿望',
    thanks: '感谢',
    event: '事件',
    update: '通知'
  };
  return names[type] || '来信';
}
</script>
