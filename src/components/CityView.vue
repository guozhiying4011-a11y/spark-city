<template>
  <div class="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden glass-card" :class="{ 'night-mode': gameEngine.state.is_night }">
    <div class="absolute inset-0 bg-gradient-to-b from-sky-900/50 via-sky-800/30 to-green-900/40"></div>
    
    <div class="absolute top-4 left-4 right-4 flex justify-between items-start">
      <div>
        <h2 class="text-2xl font-bold text-white">{{ gameEngine.state.city.name }}</h2>
        <p class="text-sm text-white/70">第 {{ gameEngine.state.city.day }} 天 · {{ cityPhaseName }}</p>
      </div>
      <div class="flex gap-2">
        <div class="glass-card px-3 py-2">
          <div class="flex items-center gap-1">
            <Users class="w-4 h-4 text-blue-400" />
            <span class="text-sm">{{ gameEngine.state.city.population }}</span>
          </div>
        </div>
        <div class="glass-card px-3 py-2">
          <div class="flex items-center gap-1">
            <Heart class="w-4 h-4 text-pink-400" />
            <span class="text-sm">{{ gameEngine.state.city.happiness }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-center gap-4 pb-8">
      <div 
        v-for="(building, index) in visibleBuildings" 
        :key="building.id"
        class="building-unlock"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div 
          class="relative flex flex-col items-center"
          :style="{ 
            height: `${getBuildingHeight(building)}px`,
            marginBottom: '0px'
          }"
        >
          <div 
            class="w-12 h-full rounded-t-lg flex items-center justify-center transition-all duration-500 hover:scale-110"
            :class="getBuildingColor(building)"
          >
            <component :is="getBuildingIcon(building)" class="w-6 h-6 text-white" />
          </div>
          <div class="mt-1 text-xs text-white/80 text-center">{{ building.name }}</div>
        </div>
      </div>
    </div>

    <div v-if="gameEngine.state.city.new_buildings_today.length > 0" class="absolute top-20 left-1/2 -translate-x-1/2">
      <div class="glass-card px-4 py-2 animate-bounce">
        <span class="text-sm text-spark-energy">✨ 新建筑解锁！</span>
      </div>
    </div>

    <div class="absolute bottom-4 left-4 right-4">
      <div class="glass-card p-3">
        <div class="flex gap-4 flex-wrap">
          <div v-for="(area, key) in gameEngine.state.city.areas" :key="key" class="flex items-center gap-2">
            <div 
              class="w-3 h-3 rounded-full"
              :class="getAreaColor(key)"
            ></div>
            <span class="text-xs text-white/70">{{ getAreaName(key) }}</span>
            <div class="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-500"
                :class="getAreaColor(key)"
                :style="{ width: `${Math.min(area.growth_points / 50 * 100, 100)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="gameEngine.state.city.daily_events.length > 0" class="absolute top-20 right-4">
      <div class="glass-card p-3 max-w-xs">
        <h4 class="text-sm font-medium text-white/80 mb-2">今日动态</h4>
        <ul class="space-y-1">
          <li v-for="(event, index) in gameEngine.state.city.daily_events" :key="index" class="text-xs text-white/60">
            • {{ event }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Users, Heart, Home, BookOpen, GraduationCap, FlaskConical, Palette, Frame, Music, Store, ShoppingBag, Building2, Landmark, Minus, TreeDeciduous, Hospital, Train, Plane, Building, Tent, Globe, Globe2 } from 'lucide-vue-next';
import { gameEngine } from '../engine/GameEngine.js';
import { BUILDING_TREE, CITY_PHASES } from '../data/buildings.js';

const cityPhaseName = computed(() => {
  const phase = CITY_PHASES.find(p => gameEngine.state.city.day >= p.day_range[0] && gameEngine.state.city.day <= p.day_range[1]);
  return phase?.name || '荒地期';
});

const visibleBuildings = computed(() => {
  const allBuildings = [];
  for (const area of Object.values(BUILDING_TREE)) {
    for (const building of area) {
      if (gameEngine.state.city.unlocked_buildings.includes(building.id)) {
        allBuildings.push(building);
      }
    }
  }
  return allBuildings;
});

function getBuildingHeight(building) {
  const heights = {
    tent: 40,
    house: 50,
    shop: 55,
    park: 45,
    road: 20,
    school: 60,
    street_art: 35,
    market: 50,
    apartment: 80,
    language_corner: 55,
    studio: 60,
    shop: 65,
    hospital: 90,
    gallery: 70,
    mall: 95,
    subway: 30,
    university: 120,
    theater: 85,
    financial_center: 130,
    highrise: 150,
    airport: 110,
    research_center: 140,
    museum: 100
  };
  return heights[building.id] || 60;
}

function getBuildingColor(building) {
  const colors = {
    tent: 'bg-green-600',
    house: 'bg-blue-600',
    apartment: 'bg-blue-700',
    highrise: 'bg-blue-800',
    school: 'bg-yellow-600',
    language_corner: 'bg-purple-600',
    library: 'bg-indigo-600',
    international_school: 'bg-purple-700',
    university: 'bg-indigo-800',
    research_center: 'bg-cyan-600',
    street_art: 'bg-pink-500',
    studio: 'bg-pink-600',
    gallery: 'bg-pink-700',
    theater: 'bg-rose-600',
    museum: 'bg-rose-700',
    market: 'bg-orange-500',
    shop: 'bg-orange-600',
    mall: 'bg-orange-700',
    financial_center: 'bg-amber-600',
    road: 'bg-gray-500',
    park: 'bg-green-500',
    hospital: 'bg-red-600',
    subway: 'bg-gray-600',
    airport: 'bg-sky-600'
  };
  return colors[building.id] || 'bg-gray-600';
}

function getBuildingIcon(building) {
  const icons = {
    tent: Tent,
    house: Home,
    apartment: Building,
    highrise: Building2,
    school: BookOpen,
    language_corner: Globe2,
    library: BookOpen,
    international_school: Globe,
    university: GraduationCap,
    research_center: FlaskConical,
    street_art: Palette,
    studio: Palette,
    gallery: Frame,
    theater: Music,
    museum: Building2,
    market: Store,
    shop: ShoppingBag,
    mall: Building2,
    financial_center: Landmark,
    road: Minus,
    park: TreeDeciduous,
    hospital: Hospital,
    subway: Train,
    airport: Plane
  };
  return icons[building.id] || Building;
}

function getAreaName(key) {
  const names = {
    education: '教育',
    arts: '艺术',
    economy: '商业',
    infrastructure: '基建',
    residential: '居住'
  };
  return names[key] || key;
}

function getAreaColor(key) {
  const colors = {
    education: 'bg-yellow-500',
    arts: 'bg-pink-500',
    economy: 'bg-orange-500',
    infrastructure: 'bg-cyan-500',
    residential: 'bg-blue-500'
  };
  return colors[key] || 'bg-gray-500';
}
</script>
