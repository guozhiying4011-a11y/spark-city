<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 glass-card rounded-b-none border-t-0 border-b-0">
    <div class="flex items-center justify-around py-2 px-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('change', tab.id)"
        class="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-300"
        :class="active === tab.id ? 'bg-spark-primary/30 text-white' : 'text-white/60 hover:text-white/80'"
      >
        <component :is="tab.icon" class="w-5 h-5" />
        <span class="text-xs font-medium">{{ tab.name }}</span>
      </button>
    </div>
    <div class="h-safe-area-inset-bottom bg-transparent"></div>
  </nav>
</template>

<script setup>
import { Building2, Users, Mail, BookOpen, User } from 'lucide-vue-next';

defineProps({
  active: {
    type: String,
    default: 'city'
  }
});

defineEmits(['change']);

const tabs = [
  { id: 'city', name: '城市', icon: Building2 },
  { id: 'residents', name: '居民', icon: Users },
  { id: 'letters', name: '信件', icon: Mail },
  { id: 'topics', name: '话题', icon: BookOpen },
  { id: 'profile', name: '我的', icon: User }
];
</script>
