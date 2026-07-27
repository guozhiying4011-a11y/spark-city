export const FIRST_NAMES = {
  female: ['Emily', 'Sarah', 'Lisa', 'Anna', 'Emma', 'Olivia', 'Sophia', 'Mia', 'Isabella', 'Amelia', 'Charlotte', 'Harper', 'Ava', 'Ella', 'Grace'],
  male: ['David', 'Tom', 'Jack', 'Alex', 'Michael', 'William', 'James', 'Oliver', 'Benjamin', 'Lucas', 'Ethan', 'Henry', 'Jacob', 'Daniel', 'Matthew']
}

export const LAST_NAMES = ['Chen', 'Smith', 'Brown', 'Kim', 'Park', 'Lee', 'Johnson', 'Williams', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas']

export const OCCUPATIONS = [
  { id: 'teacher', name: '老师', category: 'education' },
  { id: 'doctor', name: '医生', category: 'infrastructure' },
  { id: 'artist', name: '艺术家', category: 'arts' },
  { id: 'businessman', name: '商人', category: 'economy' },
  { id: 'engineer', name: '工程师', category: 'infrastructure' },
  { id: 'student', name: '学生', category: 'education' },
  { id: 'farmer', name: '农民', category: 'economy' },
  { id: 'chef', name: '厨师', category: 'economy' },
  { id: 'writer', name: '作家', category: 'arts' },
  { id: 'musician', name: '音乐家', category: 'arts' },
  { id: 'nurse', name: '护士', category: 'infrastructure' },
  { id: 'pilot', name: '飞行员', category: 'infrastructure' },
  { id: 'professor', name: '教授', category: 'education' },
  { id: 'architect', name: '建筑师', category: 'infrastructure' },
  { id: 'shopkeeper', name: '店主', category: 'economy' }
]

export const TRAITS = [
  { id: 'reader', name: '爱阅读', effect: { education: 0.1 } },
  { id: 'early_riser', name: '早起者', effect: { health: 0.05 } },
  { id: 'introvert', name: '内向', effect: { happiness: -0.02 } },
  { id: 'extrovert', name: '外向', effect: { happiness: 0.05 } },
  { id: 'athletic', name: '运动型', effect: { health: 0.1 } },
  { id: 'creative', name: '有创造力', effect: { arts: 0.1 } },
  { id: 'ambitious', name: '有抱负', effect: { career: 0.1 } },
  { id: 'kind', name: '善良', effect: { happiness: 0.05 } },
  { id: 'curious', name: '好奇', effect: { education: 0.05 } },
  { id: 'hardworking', name: '勤奋', effect: { career: 0.05 } },
  { id: 'optimistic', name: '乐观', effect: { happiness: 0.1 } },
  { id: 'pessimistic', name: '悲观', effect: { happiness: -0.05 } },
  { id: 'adventurous', name: '爱冒险', effect: { health: 0.05 } },
  { id: 'family_oriented', name: '重视家庭', effect: { happiness: 0.05 } },
  { id: 'tech_savvy', name: '精通技术', effect: { tech: 0.1 } }
]

export const INTERESTS = ['reading', 'hiking', 'cats', 'music', 'painting', 'cooking', 'traveling', 'photography', 'sports', 'writing', 'gaming', 'gardening', 'dancing', 'learning', 'volunteering']

export const LIFE_EVENTS = {
  childhood: [],
  young_adult: ['go_to_college', 'find_first_job', 'move_out'],
  adult: ['find_job', 'promotion', 'marriage', 'have_child', 'buy_house', 'change_job'],
  elder: ['retire', 'grandchild']
}

export const RELATIONSHIP_TYPES = ['friend', 'partner', 'parent', 'child', 'sibling', 'colleague']
