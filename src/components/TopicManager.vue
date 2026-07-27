<template>
  <div class="glass-card p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-white flex items-center gap-2">
        <BookOpen class="w-5 h-5 text-spark-growth" />
        话题库
      </h3>
      <button @click="showAddModal = true" class="spark-btn-secondary text-sm flex items-center gap-1">
        <Plus class="w-4 h-4" />
        添加
      </button>
    </div>

    <div class="space-y-3">
      <div 
        v-for="topic in topics" 
        :key="topic.id"
        class="bg-white/5 rounded-lg overflow-hidden"
      >
        <div 
          class="p-3 cursor-pointer flex items-center justify-between hover:bg-white/10 transition-colors"
          @click="toggleTopic(topic.id)"
        >
          <div class="flex items-center gap-2">
            <component :is="getTopicIcon(topic.icon)" class="w-5 h-5 text-spark-primary" />
            <span class="text-white font-medium">{{ topic.name }}</span>
          </div>
          <ChevronDown 
            class="w-4 h-4 text-white/50 transition-transform"
            :class="{ 'rotate-180': expandedTopics.includes(topic.id) }"
          />
        </div>
        
        <div v-if="expandedTopics.includes(topic.id)" class="border-t border-white/10">
          <div v-for="subtopic in Object.values(topic.subtopics)" :key="subtopic.id" class="p-3 bg-white/5">
            <p class="text-white/70 text-sm mb-2">{{ subtopic.name }}</p>
            <div class="space-y-2">
              <div 
                v-for="question in subtopic.questions" 
                :key="question.id"
                class="flex items-start gap-2 p-2 rounded bg-white/5"
              >
                <span class="text-spark-energy text-xs">{{ question.difficulty }}</span>
                <span class="text-white/80 text-sm flex-1">{{ question.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div 
      v-if="showAddModal" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showAddModal = false"
    >
      <div class="glass-card w-full max-w-md p-6 relative">
        <button @click="showAddModal = false" class="absolute top-4 right-4 text-white/60 hover:text-white">
          <X class="w-6 h-6" />
        </button>

        <h3 class="text-xl font-bold text-white mb-6">添加自定义话题</h3>

        <div class="space-y-4">
          <div>
            <label class="text-white/70 text-sm mb-1 block">大话题名称</label>
            <input 
              v-model="newTopic.name" 
              type="text" 
              placeholder="例如：我的项目"
              class="w-full p-3 bg-white/5 rounded-lg text-white placeholder-white/40"
            />
          </div>

          <div>
            <label class="text-white/70 text-sm mb-1 block">小话题名称</label>
            <input 
              v-model="newTopic.subtopic" 
              type="text" 
              placeholder="例如：Spark City"
              class="w-full p-3 bg-white/5 rounded-lg text-white placeholder-white/40"
            />
          </div>

          <div>
            <label class="text-white/70 text-sm mb-1 block">具体题目</label>
            <textarea 
              v-model="newTopic.question" 
              placeholder="写一个口语题目..."
              class="w-full p-3 bg-white/5 rounded-lg text-white placeholder-white/40 resize-none"
              rows="3"
            ></textarea>
          </div>

          <button 
            @click="addTopic"
            :disabled="!newTopic.name || !newTopic.subtopic || !newTopic.question"
            class="w-full spark-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { BookOpen, Plus, ChevronDown, X, Home, Briefcase, Heart, GraduationCap, FlaskConical, Palette, Globe, Star } from 'lucide-vue-next';
import { gameEngine } from '../engine/GameEngine.js';

const expandedTopics = ref([]);
const showAddModal = ref(false);
const newTopic = reactive({
  name: '',
  subtopic: '',
  question: ''
});

const topics = computed(() => Object.values(gameEngine.state.topics));

function toggleTopic(topicId) {
  const index = expandedTopics.value.indexOf(topicId);
  if (index === -1) {
    expandedTopics.value.push(topicId);
  } else {
    expandedTopics.value.splice(index, 1);
  }
}

function getTopicIcon(iconName) {
  const icons = {
    Home,
    Briefcase,
    Heart,
    GraduationCap,
    FlaskConical,
    Palette,
    Globe,
    Star
  };
  return icons[iconName] || BookOpen;
}

function addTopic() {
  if (!newTopic.name || !newTopic.subtopic || !newTopic.question) return;
  
  gameEngine.addCustomTopic(newTopic.name, newTopic.subtopic, newTopic.question);
  
  newTopic.name = '';
  newTopic.subtopic = '';
  newTopic.question = '';
  showAddModal.value = false;
}
</script>
