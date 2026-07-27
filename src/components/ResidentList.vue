<template>
  <div class="glass-card p-4">
    <h3 class="residents-title">
      <span>👥</span>
      居民列表
      <span class="resident-count">{{ gameEngine.state.residents.length }} 人</span>
    </h3>
    
    <div class="residents-list">
      <div 
        v-for="resident in gameEngine.state.residents" 
        :key="resident.id"
        class="resident-card"
      >
        <div class="resident-avatar">
          <span class="avatar-emoji">{{ gameEngine.getResidentAvatar(resident) }}</span>
        </div>
        <div class="resident-info">
          <div class="resident-name-row">
            <span class="resident-name">{{ resident.name }}</span>
            <span class="resident-happiness">
              ❤️ {{ resident.stats.happiness }}
            </span>
          </div>
          <p class="resident-meta">{{ resident.occupationName }} · {{ resident.age }}岁</p>
          <p class="resident-activity">{{ gameEngine.getResidentActivity(resident) }}</p>
          <div class="resident-traits">
            <span 
              v-for="traitId in resident.traits.slice(0, 3)" 
              :key="traitId"
              class="trait-chip"
            >
              {{ getTraitName(traitId) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="gameEngine.state.residents.length === 0" class="empty-state">
      <span class="empty-icon">👥</span>
      <p class="empty-title">还没有居民搬进来</p>
      <p class="empty-hint">继续建设城市，居民会陆续到来</p>
    </div>
  </div>
</template>

<script setup>
import { gameEngine } from '../engine/GameEngine.js';
import { TRAITS } from '../data/residents.js';

const traitMap = {};
for (const t of TRAITS) traitMap[t.id] = t.name;

function getTraitName(id) {
  return traitMap[id] || id;
}
</script>

<style scoped>
.residents-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #7c2d12;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.resident-count {
  margin-left: auto;
  font-size: 0.8rem;
  color: #9a3412;
  font-weight: 500;
  background: rgba(249, 115, 22, 0.15);
  padding: 2px 10px;
  border-radius: 999px;
}

.residents-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 65vh;
  overflow-y: auto;
  padding-right: 4px;
}

.resident-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  border: 1px solid rgba(249, 115, 22, 0.1);
  transition: all 0.2s;
}
.resident-card:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateX(2px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
}

.resident-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fed7aa, #fdba74);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
}
.avatar-emoji { font-size: 1.8rem; }

.resident-info { flex: 1; min-width: 0; }
.resident-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.resident-name { font-size: 0.95rem; font-weight: 700; color: #451a03; }
.resident-happiness { font-size: 0.75rem; color: #e11d48; font-weight: 600; }

.resident-meta { font-size: 0.75rem; color: #9a3412; margin-bottom: 4px; }

.resident-activity {
  font-size: 0.8rem;
  color: #7c2d12;
  background: rgba(249, 115, 22, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  margin-bottom: 6px;
  font-weight: 500;
}

.resident-traits {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.trait-chip {
  font-size: 0.65rem;
  color: #be185d;
  background: rgba(236, 72, 153, 0.12);
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 48px 20px;
}
.empty-icon { font-size: 3rem; opacity: 0.4; }
.empty-title { font-size: 0.95rem; color: #7c2d12; font-weight: 600; margin-top: 12px; }
.empty-hint { font-size: 0.8rem; color: #9a3412; margin-top: 4px; }
</style>
