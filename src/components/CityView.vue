<template>
  <div class="city-fullscreen">
    <div class="sky-bg">
      <div class="sun">☀️</div>
      <div class="cloud cloud-1">☁️</div>
      <div class="cloud cloud-2">☁️</div>
      <div class="cloud cloud-3">☁️</div>
      <div class="balloon">🎈</div>
      <div class="bird bird-1">🕊️</div>
      <div class="bird bird-2">🕊️</div>
    </div>

    <div class="city-header">
      <div class="city-title-card">
        <h2 class="city-name">{{ gameEngine.state.city.name }}</h2>
        <p class="city-subtitle">第 {{ gameEngine.state.city.day }} 天 · {{ cityPhaseName }}</p>
      </div>
      <div class="city-stats">
        <div class="stat-chip">
          <span>👥</span>
          <span class="stat-num">{{ gameEngine.state.city.population }}</span>
        </div>
        <div class="stat-chip">
          <span>❤️</span>
          <span class="stat-num">{{ gameEngine.state.city.happiness }}%</span>
        </div>
      </div>
    </div>

    <div class="side-indicators side-left">
      <div 
        v-for="(area, key) in leftAreas" 
        :key="key"
        class="side-indicator"
      >
        <div class="side-dot" :class="getAreaColor(key)"></div>
        <span class="side-label">{{ getAreaName(key) }}</span>
        <div class="side-bar">
          <div 
            class="side-bar-fill"
            :class="getAreaColor(key)"
            :style="{ height: `${Math.min(area.growth_points / 50 * 100, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div class="side-indicators side-right">
      <div 
        v-for="(area, key) in rightAreas" 
        :key="key"
        class="side-indicator"
      >
        <div class="side-dot" :class="getAreaColor(key)"></div>
        <span class="side-label">{{ getAreaName(key) }}</span>
        <div class="side-bar">
          <div 
            class="side-bar-fill"
            :class="getAreaColor(key)"
            :style="{ height: `${Math.min(area.growth_points / 50 * 100, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div class="city-scene">
      <div class="ground">
        <div class="mountains">
          <span class="mountain m1">⛰️</span>
          <span class="mountain m2">🏔️</span>
        </div>

        <div class="river">
          <span class="river-wave">🌊</span>
          <span class="river-boat">⛵</span>
        </div>

        <div class="beach beach-1">🏖️</div>
        <div class="beach beach-2">🏖️</div>

        <div class="park-area">
          <span class="tree t1">🌳</span>
          <span class="tree t2">🌲</span>
          <span class="tree t3">🌴</span>
          <span class="flower f1">🌸</span>
          <span class="flower f2">🌺</span>
          <span class="flower f3">🌻</span>
          <span class="bench">🪑</span>
          <span class="fountain">⛲</span>
        </div>

        <div class="road road-h">
          <div class="road-line"></div>
        </div>
        <div class="road road-v">
          <div class="road-line-v"></div>
        </div>
        <div class="intersection"></div>

        <div class="building-area area-residential">
          <div 
            v-for="building in residentialBuildings" 
            :key="building.id"
            class="building-item"
            :class="[building.size, building.is_new ? 'building-new' : '']"
            @click="showBuildingDetail(building)"
          >
            <span class="building-emoji">{{ building.emoji }}</span>
            <div v-if="building.is_new" class="sparkle">✨</div>
          </div>
        </div>

        <div class="building-area area-commercial">
          <div 
            v-for="building in commercialBuildings" 
            :key="building.id"
            class="building-item"
            :class="[building.size, building.is_new ? 'building-new' : '']"
            @click="showBuildingDetail(building)"
          >
            <span class="building-emoji">{{ building.emoji }}</span>
            <div v-if="building.is_new" class="sparkle">✨</div>
          </div>
        </div>

        <div class="building-area area-education">
          <div 
            v-for="building in educationBuildings" 
            :key="building.id"
            class="building-item"
            :class="[building.size, building.is_new ? 'building-new' : '']"
            @click="showBuildingDetail(building)"
          >
            <span class="building-emoji">{{ building.emoji }}</span>
            <div v-if="building.is_new" class="sparkle">✨</div>
          </div>
        </div>

        <div class="building-area area-arts">
          <div 
            v-for="building in artsBuildings" 
            :key="building.id"
            class="building-item"
            :class="[building.size, building.is_new ? 'building-new' : '']"
            @click="showBuildingDetail(building)"
          >
            <span class="building-emoji">{{ building.emoji }}</span>
            <div v-if="building.is_new" class="sparkle">✨</div>
          </div>
        </div>

        <div class="building-area area-infrastructure">
          <div 
            v-for="building in infraBuildings" 
            :key="building.id"
            class="building-item"
            :class="[building.size, building.is_new ? 'building-new' : '']"
            @click="showBuildingDetail(building)"
          >
            <span class="building-emoji">{{ building.emoji }}</span>
            <div v-if="building.is_new" class="sparkle">✨</div>
          </div>
        </div>

        <div class="decor decor-1">🌷</div>
        <div class="decor decor-2">🌻</div>
        <div class="decor decor-3">🌿</div>
        <div class="decor decor-4">🍄</div>
        <div class="decor decor-5">🚶</div>
        <div class="decor decor-6">🚗</div>
        <div class="decor decor-7">🚲</div>
        <div class="decor decor-8">💡</div>
        <div class="decor decor-9">🌳</div>
        <div class="decor decor-10">🌲</div>
        <div class="decor decor-11">🚕</div>
        <div class="decor decor-12">🌳</div>
      </div>
    </div>

    <div v-if="gameEngine.state.city.new_buildings_today.length > 0" class="new-building-banner">
      <span>✨ 新建筑解锁！</span>
    </div>

    <div v-if="gameEngine.state.city.daily_events.length > 0" class="daily-events">
      <div class="events-card">
        <h4>📍 今日动态</h4>
        <ul>
          <li v-for="(event, index) in gameEngine.state.city.daily_events" :key="index">
            {{ event }}
          </li>
        </ul>
      </div>
    </div>

    <div v-if="selectedBuilding" class="building-modal-bg" @click="selectedBuilding = null">
      <div class="building-modal" @click.stop>
        <div class="modal-header">
          <span class="modal-emoji">{{ selectedBuilding.emoji }}</span>
          <div class="modal-title">
            <h4>{{ selectedBuilding.name }}</h4>
            <p>{{ getAreaName(selectedBuilding.area) }}</p>
          </div>
          <button @click="selectedBuilding = null" class="modal-close">✕</button>
        </div>
        <p class="modal-desc">{{ selectedBuilding.description }}</p>
        <div v-if="selectedBuilding.effect" class="modal-effect">
          <strong>✨ 效果：</strong>{{ getEffectText(selectedBuilding.effect) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { gameEngine } from '../engine/GameEngine.js';
import { BUILDING_TREE, CITY_PHASES } from '../data/buildings.js';

const selectedBuilding = ref(null);

const cityPhaseName = computed(() => {
  const phase = CITY_PHASES.find(p => gameEngine.state.city.day >= p.day_range[0] && gameEngine.state.city.day <= p.day_range[1]);
  return phase?.name || '荒地期';
});

const leftAreas = computed(() => {
  const { education, arts } = gameEngine.state.city.areas;
  return { education, arts };
});

const rightAreas = computed(() => {
  const { economy, infrastructure, residential } = gameEngine.state.city.areas;
  return { economy, infrastructure, residential };
});

function getBuildingInfo(building, area) {
  const emojiMap = {
    tent: '⛺', house: '🏠', apartment: '🏢', highrise: '🏙️',
    school: '🏫', language_corner: '🗣️', library: '📚',
    international_school: '🌍', university: '🏛️', research_center: '🔬',
    street_art: '🎨', studio: '🎭', gallery: '🖼️', theater: '🎪', museum: '🏛️',
    market: '🛒', shop: '🏪', mall: '🏬', financial_center: '🏦',
    park: '🌳', hospital: '🏥', subway: '🚇', airport: '✈️'
  };
  const sizeMap = {
    tent: 'size-sm', house: 'size-md', shop: 'size-md', school: 'size-lg',
    street_art: 'size-sm', market: 'size-md', apartment: 'size-lg',
    language_corner: 'size-md', studio: 'size-md', hospital: 'size-xl',
    gallery: 'size-lg', mall: 'size-xl', university: 'size-xl',
    theater: 'size-lg', financial_center: 'size-xl', highrise: 'size-2xl',
    airport: 'size-xl', research_center: 'size-xl', museum: 'size-xl',
    library: 'size-lg', international_school: 'size-lg'
  };
  return {
    ...building, area,
    emoji: emojiMap[building.id] || '🏗️',
    size: sizeMap[building.id] || 'size-md',
    is_new: gameEngine.state.city.new_buildings_today.some(b => b.id === building.id)
  };
}

const residentialBuildings = computed(() => 
  (BUILDING_TREE.residential || []).filter(b => gameEngine.state.city.unlocked_buildings.includes(b.id)).map(b => getBuildingInfo(b, 'residential'))
);
const commercialBuildings = computed(() => 
  (BUILDING_TREE.economy || []).filter(b => gameEngine.state.city.unlocked_buildings.includes(b.id)).map(b => getBuildingInfo(b, 'economy'))
);
const educationBuildings = computed(() => 
  (BUILDING_TREE.education || []).filter(b => gameEngine.state.city.unlocked_buildings.includes(b.id)).map(b => getBuildingInfo(b, 'education'))
);
const artsBuildings = computed(() => 
  (BUILDING_TREE.arts || []).filter(b => gameEngine.state.city.unlocked_buildings.includes(b.id)).map(b => getBuildingInfo(b, 'arts'))
);
const infraBuildings = computed(() => 
  (BUILDING_TREE.infrastructure || []).filter(b => gameEngine.state.city.unlocked_buildings.includes(b.id)).map(b => getBuildingInfo(b, 'infrastructure'))
);

function showBuildingDetail(building) { selectedBuilding.value = building; }

function getAreaName(key) {
  return { education: '教育', arts: '艺术', economy: '商业', infrastructure: '基建', residential: '居住' }[key] || key;
}
function getAreaColor(key) {
  return { education: 'area-edu', arts: 'area-arts', economy: 'area-eco', infrastructure: 'area-infra', residential: 'area-res' }[key] || 'area-res';
}
function getEffectText(effect) {
  const names = { happiness: '幸福度', health: '健康度', education: '教育水平', wealth: '财富', international: '国际化' };
  return Object.entries(effect).map(([k, v]) => `${names[k] || k} +${v * 10}`).join(', ');
}
</script>

<style scoped>
.city-fullscreen {
  position: relative;
  width: calc(100% + 2rem);
  margin-left: -1rem;
  margin-right: -1rem;
  margin-top: -1rem;
  height: calc(100vh - 64px);
  min-height: 500px;
  overflow: hidden;
  border-radius: 0;
}

.sky-bg {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 40%;
  background: linear-gradient(180deg, #FB8F4E 0%, #f9b98a 40%, #F9CCA2 100%);
  overflow: hidden;
}

.sun {
  position: absolute;
  top: 10%; right: 15%;
  font-size: 3rem;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(251, 143, 78, 0.9));
}

.cloud { position: absolute; opacity: 0.85; filter: sepia(0.3); }
.cloud-1 { top: 18%; left: 8%; font-size: 2.5rem; animation: cloudMove 25s linear infinite; }
.cloud-2 { top: 35%; font-size: 2rem; animation: cloudMove 30s linear infinite; animation-delay: -10s; }
.cloud-3 { top: 8%; right: 30%; font-size: 2.2rem; animation: cloudMove 28s linear infinite; animation-delay: -18s; }

.balloon {
  position: absolute;
  top: 25%; left: 40%;
  font-size: 1.5rem;
  animation: float 4s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(100, 45, 14, 0.3));
}

.bird { position: absolute; font-size: 1.2rem; }
.bird-1 { top: 22%; animation: birdFly1 15s linear infinite; }
.bird-2 { top: 30%; animation: birdFly2 18s linear infinite; }

@keyframes cloudMove {
  0% { transform: translateX(-30px); }
  100% { transform: translateX(calc(100vw + 30px)); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes birdFly1 {
  0% { left: -5%; transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { left: 105%; transform: translateY(0); }
}
@keyframes birdFly2 {
  0% { right: -5%; transform: translateY(0); }
  50% { transform: translateY(-15px); }
  100% { right: 105%; transform: translateY(0); }
}

.city-header {
  position: absolute;
  top: 12px; left: 12px; right: 12px;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.city-title-card {
  background: linear-gradient(135deg, #fef3e2 0%, #f5e6c8 100%);
  border: 2px solid #642D0E;
  border-radius: 12px;
  padding: 8px 14px;
  box-shadow: 0 4px 0 rgba(61, 26, 7, 0.4);
}
.city-name { font-size: 1.1rem; font-weight: 800; color: #642D0E; }
.city-subtitle { font-size: 0.7rem; color: #8b4513; }
.city-stats { display: flex; gap: 6px; }
.stat-chip {
  background: linear-gradient(135deg, #fef3e2 0%, #f5e6c8 100%);
  border: 2px solid #642D0E;
  border-radius: 10px;
  padding: 5px 9px;
  box-shadow: 0 3px 0 rgba(61, 26, 7, 0.4);
  display: flex;
  align-items: center;
  gap: 4px;
}
.stat-num { font-size: 0.75rem; font-weight: 700; color: #642D0E; }

.side-indicators {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 15;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 5px;
}
.side-left { left: 6px; }
.side-right { right: 6px; }

.side-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: linear-gradient(135deg, #fef3e2 0%, #f5e6c8 100%);
  border: 2px solid #642D0E;
  border-radius: 10px;
  padding: 5px 4px;
  box-shadow: 0 3px 0 rgba(61, 26, 7, 0.3);
}
.side-dot { width: 8px; height: 8px; border-radius: 50%; }
.side-label { font-size: 0.6rem; color: #642D0E; font-weight: 700; writing-mode: vertical-rl; }
.side-bar { width: 6px; height: 32px; background: rgba(100, 45, 14, 0.15); border-radius: 3px; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; }
.side-bar-fill { width: 100%; transition: height 0.5s ease; }

.area-edu { background: #c9a227; }
.area-arts { background: #FB8F4E; }
.area-eco { background: #6D7E34; }
.area-infra { background: #7E7C7D; }
.area-res { background: #8b4513; }

.city-scene {
  position: absolute;
  top: 35%; left: 0; right: 0; bottom: 0;
  overflow: hidden;
}
.ground {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(180deg, #8fa346 0%, #6D7E34 50%, #4a5a20 100%);
}

.mountains { position: absolute; top: -15px; left: 0; right: 0; display: flex; justify-content: space-around; opacity: 0.5; }
.mountain { font-size: 2.5rem; filter: sepia(0.3); }
.m1 { transform: scale(1.2); }
.m2 { font-size: 3rem; }

.river {
  position: absolute;
  width: 100%;
  height: 30px;
  background: linear-gradient(90deg, #5ba3d4 0%, #3a7ca5 50%, #5ba3d4 100%);
  top: 50%;
  transform: rotate(-1.5deg);
  border-radius: 15px;
  opacity: 0.75;
  border: 2px solid rgba(100, 45, 14, 0.2);
}
.river-wave {
  position: absolute;
  top: 50%; left: 30%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  animation: wave 2s ease-in-out infinite;
}
.river-boat {
  position: absolute;
  top: 50%; left: 60%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  animation: boatMove 8s ease-in-out infinite;
}
@keyframes wave {
  0%, 100% { transform: translateY(-50%) translateX(0); }
  50% { transform: translateY(-50%) translateX(10px); }
}
@keyframes boatMove {
  0%, 100% { transform: translateY(-50%) translateX(0) rotate(-3deg); }
  50% { transform: translateY(-50%) translateX(15px) rotate(3deg); }
}

.beach { position: absolute; font-size: 1.1rem; }
.beach-1 { top: 47%; left: 5%; }
.beach-2 { top: 53%; right: 8%; }

.park-area {
  position: absolute;
  top: 12%; right: 6%;
  width: 90px; height: 65px;
  background: rgba(109, 126, 52, 0.35);
  border-radius: 50%;
  border: 2px dashed rgba(100, 45, 14, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 3px;
}
.tree { font-size: 1.4rem; animation: sway 3s ease-in-out infinite; }
.flower { font-size: 0.9rem; animation: bloom 2s ease-in-out infinite; }
.bench { font-size: 1rem; }
.fountain { font-size: 1.2rem; animation: float 3s ease-in-out infinite; }
@keyframes sway { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
@keyframes bloom { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }

.road { position: absolute; background: #7E7C7D; border: 2px solid #5a5859; }
.road-h { top: 30%; left: 0; right: 0; height: 24px; }
.road-v { top: 0; bottom: 0; left: 50%; width: 24px; transform: translateX(-50%); }
.road-line {
  position: absolute;
  top: 50%; left: 0; right: 0;
  height: 3px; transform: translateY(-50%);
  background: repeating-linear-gradient(90deg, #F9CCA2 0px, #F9CCA2 15px, transparent 15px, transparent 30px);
}
.road-line-v {
  position: absolute;
  left: 50%; top: 0; bottom: 0;
  width: 3px; transform: translateX(-50%);
  background: repeating-linear-gradient(0deg, #F9CCA2 0px, #F9CCA2 15px, transparent 15px, transparent 30px);
}
.intersection {
  position: absolute;
  top: 30%; left: 50%;
  width: 24px; height: 24px;
  transform: translate(-50%, -50%);
  background: #7E7C7D;
  border: 2px solid #5a5859;
  z-index: 1;
}

.building-area {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: flex-end;
  justify-content: center;
}
.area-residential { top: 5%; left: 8%; width: 32%; height: 22%; }
.area-commercial { top: 5%; left: 60%; width: 32%; height: 22%; }
.area-education { top: 36%; left: 4%; width: 30%; height: 14%; }
.area-arts { top: 36%; right: 4%; width: 30%; height: 14%; }
.area-infrastructure { bottom: 6%; left: 50%; transform: translateX(-50%); width: 72%; height: 20%; }

.building-item {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 3px 3px rgba(100, 45, 14, 0.3));
}
.building-item:hover { transform: scale(1.15) translateY(-3px); }
.building-emoji { filter: none; }
.size-sm .building-emoji { font-size: 1.3rem; }
.size-md .building-emoji { font-size: 2rem; }
.size-lg .building-emoji { font-size: 2.6rem; }
.size-xl .building-emoji { font-size: 3.2rem; }
.size-2xl .building-emoji { font-size: 3.8rem; }
.building-new { animation: popIn 0.6s ease-out; }
.sparkle {
  position: absolute;
  top: -8px; right: -8px;
  font-size: 0.9rem;
  animation: bounce 1s infinite;
}
@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

.decor { position: absolute; font-size: 0.9rem; }
.decor-1 { top: 5%; left: 2%; }
.decor-2 { top: 12%; right: 30%; }
.decor-3 { top: 25%; left: 2%; font-size: 1rem; }
.decor-4 { top: 48%; left: 35%; }
.decor-5 { top: 33%; left: 20%; animation: walk 8s linear infinite; }
.decor-6 { top: 29%; left: 10%; animation: driveRight 7s linear infinite; }
.decor-7 { top: 34%; right: 15%; animation: driveLeft 8s linear infinite; font-size: 0.8rem; }
.decor-8 { top: 28%; left: 48%; font-size: 0.8rem; }
.decor-9 { bottom: 3%; left: 8%; font-size: 1.2rem; }
.decor-10 { bottom: 3%; right: 10%; font-size: 1.1rem; }
.decor-11 { top: 31%; left: 65%; animation: driveRight 9s linear infinite; animation-delay: -3s; }
.decor-12 { bottom: 8%; left: 40%; font-size: 1rem; }

@keyframes walk { 0% { transform: translateX(-20px); } 100% { transform: translateX(100px); } }
@keyframes driveRight { 0% { transform: translateX(-30px); } 100% { transform: translateX(120vw); } }
@keyframes driveLeft { 0% { transform: translateX(30px) scaleX(-1); } 100% { transform: translateX(-120vw) scaleX(-1); } }

.new-building-banner {
  position: absolute;
  top: 70px; left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  background: linear-gradient(135deg, #FB8F4E, #c9a227);
  color: white;
  padding: 6px 16px;
  border-radius: 999px;
  border: 2px solid #642D0E;
  box-shadow: 0 4px 0 rgba(61, 26, 7, 0.4);
  animation: bounce 1s infinite;
  font-size: 0.8rem;
  font-weight: 700;
}

.daily-events {
  position: absolute;
  bottom: 12px; left: 12px;
  z-index: 20;
  max-width: 200px;
}
.events-card {
  background: linear-gradient(135deg, #fef3e2 0%, #f5e6c8 100%);
  border: 2px solid #642D0E;
  border-radius: 12px;
  padding: 8px 12px;
  box-shadow: 0 4px 0 rgba(61, 26, 7, 0.3);
}
.events-card h4 { font-size: 0.75rem; font-weight: 800; color: #642D0E; margin-bottom: 4px; }
.events-card ul { list-style: none; }
.events-card li { font-size: 0.65rem; color: #8b4513; margin-bottom: 2px; }

.building-modal-bg {
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
.building-modal {
  background: linear-gradient(135deg, #fef3e2 0%, #f5e6c8 100%);
  border: 3px solid #642D0E;
  border-radius: 18px;
  padding: 20px;
  max-width: 360px;
  width: 100%;
  box-shadow: 0 10px 0 rgba(61, 26, 7, 0.4);
}
.modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.modal-emoji { font-size: 2.5rem; }
.modal-title { flex: 1; }
.modal-title h4 { font-size: 1.1rem; font-weight: 800; color: #642D0E; }
.modal-title p { font-size: 0.75rem; color: #8b4513; }
.modal-close {
  background: rgba(100, 45, 14, 0.1);
  border: 2px solid #642D0E;
  width: 32px; height: 32px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #642D0E;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.modal-desc { font-size: 0.875rem; color: #642D0E; margin-bottom: 12px; line-height: 1.5; }
.modal-effect {
  background: rgba(109, 126, 52, 0.2);
  border: 2px solid #6D7E34;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 0.8rem;
  color: #4a5a20;
}
</style>
