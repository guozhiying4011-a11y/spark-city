<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="glass-card w-full max-w-lg p-6 relative">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-white/60 hover:text-white">
        <X class="w-6 h-6" />
      </button>

      <div class="text-center mb-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-spark-primary/20 flex items-center justify-center">
          <Mic class="w-8 h-8 text-spark-primary" />
        </div>
        <h3 class="text-xl font-bold text-white">口语练习</h3>
        <p class="text-white/60 text-sm mt-1">每天进步一点点</p>
      </div>

      <div v-if="!question" class="text-center py-8">
        <button @click="drawQuestion" class="spark-btn">
          <Shuffle class="w-4 h-4 inline mr-2" />
          抽取题目
        </button>
      </div>

      <div v-else>
        <div class="bg-white/5 rounded-lg p-4 mb-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs px-2 py-1 rounded-full bg-spark-primary/20 text-spark-primary">{{ question.topic_name }}</span>
            <span class="text-xs text-white/60">{{ question.subtopic_name }}</span>
          </div>
          <p class="text-white font-medium">{{ question.text }}</p>
          <div v-if="question.hints && question.hints.length > 0" class="mt-3">
            <p class="text-xs text-white/50 mb-2">提示：</p>
            <ul class="space-y-1">
              <li v-for="(hint, index) in question.hints" :key="index" class="text-xs text-white/70">• {{ hint }}</li>
            </ul>
          </div>
        </div>

        <div class="flex flex-col items-center gap-4">
          <div 
            class="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300"
            :class="isRecording ? 'bg-red-500 animate-pulse' : 'bg-spark-primary/30 hover:bg-spark-primary/50'"
          >
            <button 
              @click="toggleRecording"
              class="w-20 h-20 rounded-full flex items-center justify-center"
              :class="isRecording ? 'bg-red-600' : 'bg-spark-primary'"
            >
              <component :is="isRecording ? Square : Mic" class="w-8 h-8 text-white" />
            </button>
          </div>

          <div class="text-center">
            <p class="text-white font-mono text-2xl">{{ formatTime(recordingTime) }}</p>
            <p class="text-xs text-white/50">{{ isRecording ? '正在录音...' : '点击开始录音' }}</p>
          </div>

          <div v-if="audioBlob" class="w-full">
            <audio :src="audioUrl" controls class="w-full"></audio>
          </div>
        </div>

        <div class="mt-6 space-y-3">
          <textarea 
            v-model="notes" 
            placeholder="记录这次练习的感受..."
            class="w-full p-3 bg-white/5 rounded-lg text-white placeholder-white/40 text-sm resize-none"
            rows="2"
          ></textarea>
          
          <button 
            @click="submit"
            :disabled="!audioBlob"
            class="w-full spark-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            完成练习
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { Mic, X, Shuffle, Square } from 'lucide-vue-next';
import { gameEngine } from '../engine/GameEngine.js';

const emit = defineEmits(['close', 'submit']);

const question = ref(null);
const isRecording = ref(false);
const recordingTime = ref(0);
const audioBlob = ref(null);
const audioUrl = ref('');
const notes = ref('');
let mediaRecorder = null;
let recordingInterval = null;
let audioChunks = [];

function drawQuestion() {
  question.value = gameEngine.drawSpeakingQuestion();
}

async function toggleRecording() {
  if (isRecording.value) {
    stopRecording();
  } else {
    await startRecording();
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      audioBlob.value = new Blob(audioChunks, { type: 'audio/webm' });
      audioUrl.value = URL.createObjectURL(audioBlob.value);
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    isRecording.value = true;
    recordingTime.value = 0;
    
    recordingInterval = setInterval(() => {
      recordingTime.value++;
    }, 1000);
  } catch (error) {
    console.error('Recording failed:', error);
    alert('无法访问麦克风，请检查权限');
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  isRecording.value = false;
  if (recordingInterval) {
    clearInterval(recordingInterval);
    recordingInterval = null;
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function submit() {
  if (!audioBlob.value || !question.value) return;
  
  emit('submit', {
    duration: recordingTime.value,
    notes: notes.value,
    questionId: question.value.id,
    topicId: question.value.topic_id
  });
  
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value);
  }
}

onUnmounted(() => {
  stopRecording();
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value);
  }
});
</script>
