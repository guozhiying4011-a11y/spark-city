<template>
  <div class="glass-card p-4">
    <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
      <Users class="w-5 h-5 text-blue-400" />
      居民列表
      <span class="ml-auto text-sm text-white/50 font-normal">{{ gameEngine.state.residents.length }} 人</span>
    </h3>
    
    <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
      <div 
        v-for="resident in gameEngine.state.residents" 
        :key="resident.id"
        class="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
      >
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-spark-primary/30 to-spark-secondary/30 flex items-center justify-center flex-shrink-0">
          <User class="w-6 h-6 text-white/70" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white font-medium">{{ resident.name }}</p>
          <p class="text-white/50 text-sm">{{ resident.occupationName }} · {{ resident.age }}岁</p>
          <p class="text-white/40 text-xs mt-1 truncate">{{ resident.personality }}</p>
        </div>
        <div class="flex items-center gap-1 flex-shrink-0">
          <Heart class="w-4 h-4 text-pink-400" />
          <span class="text-pink-400 text-sm">{{ resident.happiness }}</span>
        </div>
      </div>
    </div>

    <div v-if="gameEngine.state.residents.length === 0" class="text-center py-12">
      <Users class="w-12 h-12 text-white/20 mx-auto mb-3" />
      <p class="text-white/40 text-sm">还没有居民搬进来</p>
      <p class="text-white/30 text-xs mt-1">继续建设城市，居民会陆续到来</p>
    </div>
  </div>
</template>

<script setup>
import { Users, User, Heart } from 'lucide-vue-next';
import { gameEngine } from '../engine/GameEngine.js';
</script>
