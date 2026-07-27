import { reactive } from 'vue';
import { DEFAULT_TOPICS, UNLOCKED_TOPICS } from '../data/topics.js';
import { BUILDING_TREE, CITY_PHASES } from '../data/buildings.js';
import { LETTER_TEMPLATES } from '../data/letters.js';
import { FIRST_NAMES, LAST_NAMES, OCCUPATIONS, TRAITS, INTERESTS, LIFE_EVENTS } from '../data/residents.js';
const STORAGE_KEY = 'spark_city_save';
class Random {
 constructor(seed) {
 this.seed = seed;
 }
 next() {
 this.seed = (this.seed * 9301 + 49297) % 233280;
 return this.seed / 233280;
 }
 range(min, max) {
 return min + this.next() * (max - min);
 }
 int(min, max) {
 return Math.floor(this.range(min, max + 1));
 }
 choice(arr) {
 return arr[this.int(0, arr.length - 1)];
 }
 shuffle(arr) {
 const result = [...arr];
 for (let i = result.length - 1; i > 0; i--) {
 const j = this.int(0, i);
 [result[i], result[j]] = [result[j], result[i]];
 }
 return result;
 }
}
function generateResidentId() {
 return `r_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function generateName(seed) {
 const r = new Random(seed);
 const gender = r.choice(['female', 'male']);
 const first = r.choice(FIRST_NAMES[gender]);
 const last = r.choice(LAST_NAMES);
 return { name: `${first} ${last}`, gender };
}
function generateResident(seed, day) {
 const r = new Random(seed);
 const { name, gender } = generateName(seed);
 const age = r.int(18, 40);
 const occupation = r.choice(OCCUPATIONS);
 const numTraits = r.int(2, 4);
 const traits = r.shuffle(TRAITS).slice(0, numTraits).map(t => t.id);
 const numInterests = r.int(2, 4);
 const interests = r.shuffle(INTERESTS).slice(0, numInterests);
 const stats = {
 happiness: r.int(50, 80),
 health: r.int(60, 90),
 education: r.int(40, 80),
 wealth: r.int(30, 70)
 };
 return {
 id: generateResidentId(),
 name,
 gender,
 age,
 occupation: occupation.id,
 occupationName: occupation.name,
 workplace: null,
 home: null,
 traits,
 interests,
 relationships: {
 friends: [],
 partner: null,
 children: []
 },
 stats,
 seed,
 created_at: day,
 current_state: 'idle',
 life_events: []
 };
}
function calculateStreak(history, today) {
 let streak = 0;
 for (let i = 0; i < 30; i++) {
 const checkDate = new Date(today);
 checkDate.setDate(checkDate.getDate() - i);
 const dateStr = checkDate.toISOString().split('T')[0];
 if (history.some(h => h.date === dateStr)) {
 streak++;
 }
 else {
 break;
 }
 }
 return streak;
}
function calculateEnergy(behaviorType, duration, streakDays) {
 const BEHAVIOR_CONFIG = {
 english: { base: 1, maxDaily: 4 },
 speaking: { base: 1.5, maxDaily: 2 },
 reading: { base: 1, maxDaily: 3 },
 creativity: { base: 1.5, maxDaily: 2 },
 exercise: { base: 1, maxDaily: 3 },
 sleep: { base: 1, maxDaily: 1 },
 plan: { base: 0.5, maxDaily: 3 }
 };
 const config = BEHAVIOR_CONFIG[behaviorType] || { base: 1, maxDaily: 5 };
 const durationBonus = Math.min(duration / 30, 2.0);
 const streakBonus = 1.0 + Math.min(streakDays * 0.05, 0.5);
 return Math.round(config.base * durationBonus * streakBonus * 10) / 10;
}
function getAreaGrowth(behaviorType) {
 const areaMap = {
 english: { education: 1, international: 0.5 },
 speaking: { education: 0.5, international: 1 },
 reading: { education: 1 },
 creativity: { arts: 1 },
 exercise: { infrastructure: 0.5, residential: 0.3 },
 sleep: { infrastructure: 0.3, residential: 0.5 },
 plan: { economy: 0.8, infrastructure: 0.2 }
 };
 return areaMap[behaviorType] || { education: 0.5 };
}
function getCityPhase(day) {
 return CITY_PHASES.find(p => day >= p.day_range[0] && day <= p.day_range[1]) || CITY_PHASES[0];
}
export class GameEngine {
 constructor() {
 this.state = reactive({
 player: {
 id: 'player_001',
 name: '',
 created_at: null,
 streak: 0,
 total_energy: 0,
 level: 1,
 preferences: [],
 sleep_target: 22,
 daily_energy: 0,
 last_login: null
 },
 city: {
 id: 'city_001',
 name: 'Spark City',
 day: 1,
 population: 3,
 happiness: 60,
 health: 70,
 education: 50,
 wealth: 40,
 international: 10,
 phase: 'wilderness',
 areas: {
 education: { growth_points: 0, buildings: [] },
 arts: { growth_points: 0, buildings: [] },
 economy: { growth_points: 0, buildings: [] },
 infrastructure: { growth_points: 0, buildings: [] },
 residential: { growth_points: 0, buildings: [] }
 },
 unlocked_buildings: ['tent'],
 new_buildings_today: [],
 daily_events: []
 },
 residents: [],
 behaviors: [],
 letters: [],
 topics: { ...DEFAULT_TOPICS },
 custom_topics: [],
 current_speaking_topic: null,
 is_night: false,
 is_sleeping: false
 });
 this.init();
 }
 init() {
 const saved = this.load();
 if (saved) {
 this.restore(saved);
 }
 else {
 this.reset();
 }
 }
 reset() {
 const now = new Date();
 this.state.player = {
 id: 'player_001',
 name: '',
 created_at: now.toISOString(),
 streak: 0,
 total_energy: 0,
 level: 1,
 preferences: [],
 sleep_target: 22,
 daily_energy: 0,
 last_login: now.toISOString()
 };
 this.state.city = {
 id: 'city_001',
 name: 'Spark City',
 day: 1,
 population: 3,
 happiness: 60,
 health: 70,
 education: 50,
 wealth: 40,
 international: 10,
 phase: 'wilderness',
 areas: {
 education: { growth_points: 0, buildings: ['tent'] },
 arts: { growth_points: 0, buildings: [] },
 economy: { growth_points: 0, buildings: [] },
 infrastructure: { growth_points: 0, buildings: [] },
 residential: { growth_points: 0, buildings: [] }
 },
 unlocked_buildings: ['tent'],
 new_buildings_today: [],
 daily_events: []
 };
 this.state.residents = [
 generateResident(12345, 1),
 generateResident(67890, 1),
 generateResident(13579, 1)
 ];
 this.state.behaviors = [];
 this.state.letters = [];
 this.state.topics = { ...DEFAULT_TOPICS };
 this.state.custom_topics = [];
 this.state.is_night = false;
 this.state.is_sleeping = false;
 this.save();
 }
 load() {
 try {
 const data = localStorage.getItem(STORAGE_KEY);
 return data ? JSON.parse(data) : null;
 }
 catch {
 return null;
 }
 }
 save() {
 try {
 const data = JSON.stringify(this.state);
 localStorage.setItem(STORAGE_KEY, data);
 }
 catch {
 console.error('Failed to save game');
 }
 }
 restore(data) {
 Object.assign(this.state, data);
 }
 recordBehavior(behavior) {
 const now = new Date();
 const dateStr = now.toISOString().split('T')[0];
 const todayBehaviors = this.state.behaviors.filter(b => b.date === dateStr);
 const sameTypeCount = todayBehaviors.filter(b => b.type === behavior.type).length;
 const BEHAVIOR_LIMITS = {
 english: 4,
 speaking: 2,
 reading: 3,
 creativity: 2,
 exercise: 3,
 sleep: 1,
 plan: 3
 };
 const limit = BEHAVIOR_LIMITS[behavior.type] || 5;
 if (sameTypeCount >= limit) {
 return { success: false, message: '今日该行为已达上限' };
 }
 const streak = calculateStreak(this.state.behaviors, now);
 const energy = calculateEnergy(behavior.type, behavior.duration || 30, streak);
 const areaGrowth = getAreaGrowth(behavior.type);
 const record = {
 id: `b_${Date.now()}`,
 player_id: this.state.player.id,
 type: behavior.type,
 duration: behavior.duration || 30,
 energy,
 date: dateStr,
 notes: behavior.notes || '',
 audio_path: behavior.audio_path || null,
 question_id: behavior.question_id || null,
 topic_id: behavior.topic_id || null,
 area_growth: areaGrowth
 };
 this.state.behaviors.push(record);
 this.state.player.total_energy += energy;
 this.state.player.daily_energy += energy;
 this.updateCityGrowth(areaGrowth, energy);
 this.updatePlayerLevel();
 this.checkUnlockTopics();
 this.generateDailyEvents();
 this.save();
 return { success: true, energy, record };
 }
 updateCityGrowth(areaGrowth, energy) {
 for (const [area, amount] of Object.entries(areaGrowth)) {
 if (this.state.city.areas[area]) {
 this.state.city.areas[area].growth_points += energy * amount;
 }
 }
 this.checkBuildingUnlocks();
 this.updateCityPhase();
 }
 checkBuildingUnlocks() {
 const newBuildings = [];
 for (const [area, buildings] of Object.entries(BUILDING_TREE)) {
 for (const building of buildings) {
 if (!this.state.city.unlocked_buildings.includes(building.id)) {
 const growthRequired = building.unlock_condition.growth_points || 0;
 if (this.state.city.areas[area] &&
 this.state.city.areas[area].growth_points >= growthRequired) {
 this.state.city.unlocked_buildings.push(building.id);
 this.state.city.areas[area].buildings.push(building.id);
 newBuildings.push(building);
 if (building.effect) {
 this.applyBuildingEffect(building.effect);
 }
 }
 }
 }
 }
 if (newBuildings.length > 0) {
 this.state.city.new_buildings_today = newBuildings;
 }
 }
 applyBuildingEffect(effect) {
 for (const [stat, value] of Object.entries(effect)) {
 if (this.state.city[stat] !== undefined) {
 this.state.city[stat] = Math.min(100, this.state.city[stat] + value * 10);
 }
 }
 }
 updateCityPhase() {
 const phase = getCityPhase(this.state.city.day);
 if (phase && phase.id !== this.state.city.phase) {
 this.state.city.phase = phase.id;
 }
 }
 updatePlayerLevel() {
 const newLevel = Math.floor(this.state.player.total_energy / 10) + 1;
 if (newLevel > this.state.player.level) {
 this.state.player.level = newLevel;
 }
 }
 checkUnlockTopics() {
 for (const [topicId, topic] of Object.entries(UNLOCKED_TOPICS)) {
 if (!this.state.topics[topicId]) {
 const condition = topic.unlock_condition;
 if (condition.type === 'city_level' &&
 this.state.city.unlocked_buildings.includes(condition.value)) {
 this.state.topics[topicId] = topic;
 }
 }
 }
 }
 drawSpeakingQuestion() {
 const availableTopics = Object.values(this.state.topics);
 const allQuestions = [];
 for (const topic of availableTopics) {
 for (const subtopic of Object.values(topic.subtopics)) {
 for (const question of subtopic.questions) {
 allQuestions.push({
 ...question,
 topic_id: topic.id,
 topic_name: topic.name,
 subtopic_id: subtopic.id,
 subtopic_name: subtopic.name
 });
 }
 }
 }
 if (allQuestions.length === 0)
 return null;
 const r = new Random(Date.now());
 const recentQuestions = this.state.behaviors
 .filter(b => b.type === 'speaking' && b.question_id)
 .slice(-7)
 .map(b => b.question_id);
 const available = allQuestions.filter(q => !recentQuestions.includes(q.id));
 const question = available.length > 0 ? r.choice(available) : r.choice(allQuestions);
 this.state.current_speaking_topic = question;
 return question;
 }
 addCustomTopic(name, subtopicName, questionText) {
 const topicId = `custom_${Date.now()}`;
 const subtopicId = `custom_sub_${Date.now()}`;
 const questionId = `custom_q_${Date.now()}`;
 const newTopic = {
 id: topicId,
 name,
 icon: 'Star',
 subtopics: {
 [subtopicId]: {
 id: subtopicId,
 name: subtopicName,
 questions: [{
 id: questionId,
 text: questionText,
 difficulty: 1,
 min_duration: 30,
 hints: [],
 tags: ['custom'],
 created_at: new Date().toISOString()
 }]
 }
 },
 created_at: new Date().toISOString()
 };
 this.state.custom_topics.push(newTopic);
 this.state.topics[topicId] = newTopic;
 this.save();
 return newTopic;
 }
 updateResidents() {
 for (const resident of this.state.residents) {
 resident.age += 0;
 this.updateResidentStats(resident);
 this.checkResidentLifeEvents(resident);
 }
 this.updateRelationships();
 this.generatePopulationGrowth();
 }
 updateResidentStats(resident) {
 const r = new Random(resident.seed);
 if (resident.age >= 65) {
 resident.stats.health = Math.max(30, resident.stats.health - r.range(0, 2));
 }
 else {
 resident.stats.health = Math.min(100, resident.stats.health + r.range(-1, 1));
 }
 resident.stats.happiness = Math.min(100, Math.max(0, resident.stats.happiness + r.range(-2, 2)));
 }
 checkResidentLifeEvents(resident) {
 const r = new Random(resident.seed);
 const age = resident.age;
 let possibleEvents = [];
 if (age >= 18 && age < 26) {
 possibleEvents = LIFE_EVENTS.young_adult;
 }
 else if (age >= 26 && age < 65) {
 possibleEvents = LIFE_EVENTS.adult;
 }
 else if (age >= 65) {
 possibleEvents = LIFE_EVENTS.elder;
 }
 const eventType = r.choice(possibleEvents);
 const existingEvents = resident.life_events.map(e => e.type);
 if (eventType && !existingEvents.includes(eventType) && r.next() < 0.02) {
 this.triggerLifeEvent(resident, eventType);
 }
 }
 triggerLifeEvent(resident, eventType) {
 const event = {
 day: this.state.city.day,
 type: eventType
 };
 switch (eventType) {
 case 'marriage':
 if (!resident.relationships.partner) {
 const eligible = this.state.residents.filter(r => r.id !== resident.id &&
 !r.relationships.partner &&
 Math.abs(r.age - resident.age) < 10);
 if (eligible.length > 0) {
 const r = new Random(resident.seed);
 const partner = r.choice(eligible);
 resident.relationships.partner = partner.id;
 partner.relationships.partner = resident.id;
 event.partner_name = partner.name;
 }
 }
 break;
 case 'have_child':
 if (resident.relationships.partner) {
 const childName = generateName(Date.now() + resident.id.length);
 event.child_name = childName.name;
 resident.relationships.children.push({ name: childName.name, day: this.state.city.day });
 }
 break;
 case 'retire':
 resident.occupation = 'retired';
 resident.occupationName = '退休';
 break;
 case 'promotion':
 resident.stats.wealth = Math.min(100, resident.stats.wealth + 10);
 break;
 case 'find_job':
 const newJob = new Random(resident.seed).choice(OCCUPATIONS);
 resident.occupation = newJob.id;
 resident.occupationName = newJob.name;
 break;
 }
 resident.life_events.push(event);
 this.generateLifeEventLetter(resident, event);
 }
 updateRelationships() {
 const r = new Random(Date.now());
 for (const resident of this.state.residents) {
 if (resident.relationships.friends.length < 5 && r.next() < 0.01) {
 const possibleFriends = this.state.residents.filter(r => r.id !== resident.id &&
 !resident.relationships.friends.includes(r.id));
 if (possibleFriends.length > 0) {
 const friend = r.choice(possibleFriends);
 resident.relationships.friends.push(friend.id);
 }
 }
 }
 }
 generatePopulationGrowth() {
 const growthRate = 0.05 + (this.state.city.areas.residential.buildings.length * 0.02);
 const r = new Random(Date.now());
 if (r.next() < growthRate && this.state.city.residents.length < 100) {
 const newResident = generateResident(Date.now(), this.state.city.day);
 this.state.residents.push(newResident);
 this.state.city.population = this.state.residents.length;
 }
 }
 generateLetters() {
 const newLetters = [];
 this.checkWishLetters(newLetters);
 this.checkGratitudeLetters(newLetters);
 this.checkCityUpdateLetters(newLetters);
 for (const letter of newLetters) {
 this.state.letters.push(letter);
 }
 this.save();
 }
 checkWishLetters(newLetters) {
 const r = new Random(Date.now());
 const allTemplates = [
 ...LETTER_TEMPLATES.wish_education,
 ...LETTER_TEMPLATES.wish_arts,
 ...LETTER_TEMPLATES.wish_infrastructure
 ];
 for (const template of allTemplates) {
 const condition = template.condition;
 let meetsCondition = true;
 if (condition.area && condition.growth_min) {
 const areaGrowth = this.state.city.areas[condition.area]?.growth_points || 0;
 meetsCondition = meetsCondition && areaGrowth >= condition.growth_min;
 }
 if (condition.building_not_exists) {
 meetsCondition = meetsCondition &&
 !this.state.city.unlocked_buildings.includes(condition.building_not_exists);
 }
 if (condition.population_min) {
 meetsCondition = meetsCondition &&
 this.state.city.population >= condition.population_min;
 }
 if (condition.building_exists) {
 meetsCondition = meetsCondition &&
 this.state.city.unlocked_buildings.includes(condition.building_exists);
 }
 if (meetsCondition && r.next() < 0.05) {
 const letter = this.createLetterFromTemplate(template);
 newLetters.push(letter);
 }
 }
 }
 checkGratitudeLetters(newLetters) {
 const r = new Random(Date.now());
 const templates = LETTER_TEMPLATES.gratitude;
 for (const template of templates) {
 const condition = template.condition;
 let meetsCondition = true;
 if (condition.happiness_min) {
 meetsCondition = meetsCondition && this.state.city.happiness >= condition.happiness_min;
 }
 if (condition.recent_building_added) {
 meetsCondition = meetsCondition && this.state.city.new_buildings_today.length > 0;
 }
 if (meetsCondition && r.next() < 0.03) {
 const letter = this.createLetterFromTemplate(template);
 newLetters.push(letter);
 }
 }
 }
 checkCityUpdateLetters(newLetters) {
 const r = new Random(Date.now());
 const templates = LETTER_TEMPLATES.city_update;
 for (const template of templates) {
 if (r.next() < 0.02) {
 const letter = this.createLetterFromTemplate(template);
 newLetters.push(letter);
 }
 }
 }
 generateLifeEventLetter(resident, event) {
 const templates = LETTER_TEMPLATES.life_event;
 const template = templates.find(t => t.condition.event_type === event.type);
 if (template) {
 const letter = this.createLetterFromTemplate(template, resident, event);
 this.state.letters.push(letter);
 }
 }
 createLetterFromTemplate(template, resident = null, event = null) {
 const r = new Random(Date.now());
 let senderName;
 let senderId;
 if (resident) {
 senderName = resident.name;
 senderId = resident.id;
 }
 else {
 const senderType = template.sender?.type;
 const fallbackName = template.sender?.fallback_name || '一位居民';
 if (senderType === 'random_resident') {
 const randomResident = r.choice(this.state.residents);
 senderName = randomResident.name;
 senderId = randomResident.id;
 }
 else if (senderType === 'any') {
 const randomResident = r.choice(this.state.residents);
 senderName = randomResident.name;
 senderId = randomResident.id;
 }
 else if (senderType === 'teacher' || senderType === 'professor_or_teacher') {
 const teachers = this.state.residents.filter(r => r.occupation === 'teacher' || r.occupation === 'professor');
 if (teachers.length > 0) {
 const teacher = r.choice(teachers);
 senderName = teacher.name;
 senderId = teacher.id;
 }
 else {
 senderName = fallbackName;
 senderId = null;
 }
 }
 else if (senderType === 'artist' || senderType === 'artist_or_any') {
 const artists = this.state.residents.filter(r => r.occupation === 'artist' || r.occupation === 'writer' || r.occupation === 'musician');
 if (artists.length > 0) {
 const artist = r.choice(artists);
 senderName = artist.name;
 senderId = artist.id;
 }
 else {
 senderName = fallbackName;
 senderId = null;
 }
 }
 else if (senderType === 'doctor_or_any') {
 const doctors = this.state.residents.filter(r => r.occupation === 'doctor' || r.occupation === 'nurse');
 if (doctors.length > 0) {
 const doctor = r.choice(doctors);
 senderName = doctor.name;
 senderId = doctor.id;
 }
 else {
 senderName = fallbackName;
 senderId = null;
 }
 }
 else if (senderType === 'businessman') {
 const businessmen = this.state.residents.filter(r => r.occupation === 'businessman' || r.occupation === 'shopkeeper');
 if (businessmen.length > 0) {
 const businessman = r.choice(businessmen);
 senderName = businessman.name;
 senderId = businessman.id;
 }
 else {
 senderName = fallbackName;
 senderId = null;
 }
 }
 else {
 senderName = fallbackName;
 senderId = null;
 }
 }
 const greeting = r.choice(template.template.greeting);
 const body = r.choice(template.template.body);
 const closing = r.choice(template.template.closing);
 let content = `${greeting}，\n\n${body}\n\n${closing}`;
 if (event && event.child_name) {
 content = content.replace('{child_name}', event.child_name);
 }
 if (event && event.partner_name) {
 content = content.replace('{partner_name}', event.partner_name);
 }
 return {
 id: `letter_${Date.now()}_${r.int(1000, 9999)}`,
 date: this.state.city.day,
 type: template.id.split('_')[0],
 sender: senderName,
 sender_id: senderId,
 content,
 read: false,
 template_id: template.id
 };
 }
 generateDailyEvents() {
 const events = [];
 const todayBehaviors = this.state.behaviors.filter(b => {
 const today = new Date().toISOString().split('T')[0];
 return b.date === today;
 });
 if (todayBehaviors.some(b => b.type === 'english')) {
 events.push('教育区的学生们正在努力学习');
 }
 if (todayBehaviors.some(b => b.type === 'speaking')) {
 events.push('语言角传来了讨论声');
 }
 if (todayBehaviors.some(b => b.type === 'creativity')) {
 events.push('艺术区出现了新的作品');
 }
 if (todayBehaviors.some(b => b.type === 'exercise')) {
 events.push('公园的人们正在运动');
 }
 this.state.city.daily_events = events;
 }
 endDay(sleepTime) {
 this.state.is_sleeping = true;
 setTimeout(() => {
 this.state.is_night = true;
 setTimeout(() => {
 this.state.city.day += 1;
 this.state.city.new_buildings_today = [];
 this.state.player.daily_energy = 0;
 this.updateCityPhase();
 this.updateResidents();
 this.generateLetters();
 this.generateDailyEvents();
 if (sleepTime <= this.state.player.sleep_target) {
 this.state.city.happiness = Math.min(100, this.state.city.happiness + 2);
 }
 this.state.is_night = false;
 this.state.is_sleeping = false;
 this.save();
 }, 3000);
 }, 2000);
 }
 simulateOfflineDays(days) {
 for (let i = 0; i < days; i++) {
 this.state.city.day += 1;
 this.updateCityPhase();
 this.updateResidents();
 if (Math.random() < 0.3) {
 this.generateLetters();
 }
 }
 this.save();
 }
 getUnreadLettersCount() {
 return this.state.letters.filter(l => !l.read).length;
 }
 markLetterAsRead(letterId) {
 const letter = this.state.letters.find(l => l.id === letterId);
 if (letter) {
 letter.read = true;
 this.save();
 }
 }
 getResidentById(id) {
 return this.state.residents.find(r => r.id === id);
 }
}
export const gameEngine = new GameEngine();
