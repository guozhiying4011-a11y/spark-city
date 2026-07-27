<template>
  <nav class="bottom-nav">
    <div class="nav-inner">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('change', tab.id)"
        class="nav-btn"
        :class="{ 'nav-btn-active': active === tab.id }"
      >
        <component :is="tab.icon" class="nav-icon" />
        <span class="nav-name">{{ tab.name }}</span>
      </button>
    </div>
    <div class="nav-bottom-space"></div>
  </nav>
</template>

<script setup>
import { Building2, Zap, Users, Mail, User } from 'lucide-vue-next';

defineProps({
  active: { type: String, default: 'city' }
});
defineEmits(['change']);

const tabs = [
  { id: 'city', name: '城市', icon: Building2 },
  { id: 'action', name: '行动', icon: Zap },
  { id: 'residents', name: '居民', icon: Users },
  { id: 'letters', name: '信件', icon: Mail },
  { id: 'profile', name: '我的', icon: User }
];
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  background: linear-gradient(180deg, #fef3e2 0%, #f5e6c8 100%);
  border-top: 3px solid #642D0E;
  border-radius: 0;
  box-shadow: 0 -4px 0 rgba(61, 26, 7, 0.2);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 6px 4px;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 12px;
  border-radius: 12px;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #8b4513;
}
.nav-btn-active {
  background: linear-gradient(180deg, #FB8F4E 0%, #e67a3a 100%);
  color: white;
  box-shadow: 0 3px 0 #642D0E;
  border: 2px solid #642D0E;
  padding: 4px 10px;
}

.nav-icon { width: 22px; height: 22px; }
.nav-name { font-size: 0.7rem; font-weight: 700; }

.nav-bottom-space {
  height: env(safe-area-inset-bottom, 0px);
}
</style>
