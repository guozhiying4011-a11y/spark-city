<template>
  <div class="glass-card p-4">
    <div class="letters-header">
      <h3 class="letters-title">
        <span>✉️</span>
        居民来信
      </h3>
      <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
    </div>

    <div v-if="gameEngine.state.letters.length === 0" class="empty-state">
      <span class="empty-icon">✉️</span>
      <p class="empty-title">暂无来信</p>
      <p class="empty-hint">随着城市发展，居民会给你写信</p>
    </div>

    <div v-else class="letters-list">
      <div 
        v-for="letter in sortedLetters" 
        :key="letter.id"
        @click="openLetter(letter)"
        class="letter-card"
        :class="letter.read ? 'letter-read' : 'letter-unread'"
      >
        <div class="letter-left">
          <span class="letter-type-icon">{{ getTypeIcon(letter.type) }}</span>
        </div>
        <div class="letter-content">
          <div class="letter-top">
            <span class="letter-sender">{{ letter.sender }}</span>
            <span class="letter-type-chip" :class="getLetterTypeClass(letter.type)">
              {{ getLetterTypeName(letter.type) }}
            </span>
          </div>
          <p class="letter-preview">{{ letter.content.substring(0, 50) }}...</p>
          <span class="letter-date">第 {{ letter.date }} 天</span>
        </div>
        <span v-if="!letter.read" class="unread-dot"></span>
      </div>
    </div>

    <div 
      v-if="selectedLetter" 
      class="letter-modal-bg"
      @click.self="selectedLetter = null"
    >
      <div class="letter-modal">
        <button @click="selectedLetter = null" class="modal-close">✕</button>

        <div class="modal-letter-header">
          <span class="modal-type-icon">{{ getTypeIcon(selectedLetter.type) }}</span>
          <div>
            <span class="modal-type-chip" :class="getLetterTypeClass(selectedLetter.type)">
              {{ getLetterTypeName(selectedLetter.type) }}
            </span>
            <p class="modal-date">第 {{ selectedLetter.date }} 天</p>
          </div>
        </div>

        <h4 class="modal-sender">{{ selectedLetter.sender }}</h4>
        
        <div class="modal-letter-body">
          <p class="letter-text">{{ selectedLetter.content }}</p>
        </div>

        <button @click="markAsRead" class="modal-btn">
          ✓ 标记已读
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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
    wish: 'type-wish',
    thanks: 'type-thanks',
    event: 'type-event',
    update: 'type-update'
  };
  return classes[type] || 'type-default';
}

function getLetterTypeName(type) {
  return { wish: '愿望', thanks: '感谢', event: '事件', update: '通知' }[type] || '来信';
}

function getTypeIcon(type) {
  return { wish: '🌟', thanks: '🙏', event: '🎉', update: '📢' }[type] || '✉️';
}
</script>

<style scoped>
.letters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.letters-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #7c2d12;
  display: flex;
  align-items: center;
  gap: 8px;
}
.unread-badge {
  background: #dc2626;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 999px;
  min-width: 24px;
  text-align: center;
}

.letters-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 65vh;
  overflow-y: auto;
  padding-right: 4px;
}

.letter-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  border: 1px solid transparent;
}
.letter-read {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(249, 115, 22, 0.08);
}
.letter-unread {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(249, 115, 22, 0.3);
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.1);
}
.letter-card:hover { transform: translateX(2px); }

.letter-left { flex-shrink: 0; }
.letter-type-icon { font-size: 1.8rem; }

.letter-content { flex: 1; min-width: 0; }
.letter-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.letter-sender { font-size: 0.9rem; font-weight: 700; color: #451a03; }
.letter-type-chip {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 600;
}
.type-wish { background: rgba(245, 158, 11, 0.2); color: #b45309; }
.type-thanks { background: rgba(16, 185, 129, 0.2); color: #047857; }
.type-event { background: rgba(236, 72, 153, 0.2); color: #be185d; }
.type-update { background: rgba(6, 182, 212, 0.2); color: #0e7490; }
.type-default { background: rgba(107, 114, 128, 0.2); color: #4b5563; }

.letter-preview {
  font-size: 0.8rem;
  color: #57534e;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.letter-date { font-size: 0.7rem; color: #9a3412; }

.unread-dot {
  position: absolute;
  top: 12px; right: 12px;
  width: 8px; height: 8px;
  background: #dc2626;
  border-radius: 50%;
}

.empty-state {
  text-align: center;
  padding: 48px 20px;
}
.empty-icon { font-size: 3rem; opacity: 0.4; }
.empty-title { font-size: 0.95rem; color: #7c2d12; font-weight: 600; margin-top: 12px; }
.empty-hint { font-size: 0.8rem; color: #9a3412; margin-top: 4px; }

.letter-modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
}
.letter-modal {
  background: white;
  border-radius: 20px;
  padding: 24px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-close {
  position: absolute;
  top: 16px; right: 16px;
  background: rgba(0,0,0,0.05);
  border: none;
  width: 32px; height: 32px;
  border-radius: 50%;
  font-size: 1rem;
  color: #6b7280;
  cursor: pointer;
}
.modal-close:hover { background: rgba(0,0,0,0.1); }

.modal-letter-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.modal-type-icon { font-size: 2.5rem; }
.modal-type-chip {
  font-size: 0.7rem;
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 4px;
}
.modal-date { font-size: 0.75rem; color: #9a3412; }

.modal-sender {
  font-size: 1.2rem;
  font-weight: 800;
  color: #451a03;
  margin-bottom: 16px;
}

.modal-letter-body {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(245, 158, 11, 0.2);
}
.letter-text {
  font-size: 0.9rem;
  color: #451a03;
  line-height: 1.7;
  white-space: pre-line;
}

.modal-btn {
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
.modal-btn:hover { transform: translateY(-2px); }
</style>
