export const DEFAULT_TOPICS = {
  daily_life: {
    id: 'daily_life',
    name: '日常生活',
    icon: 'Home',
    subtopics: {
      shopping: {
        id: 'shopping',
        name: '购物',
        questions: [
          {
            id: 'q001',
            text: '介绍一次印象深刻的购物经历',
            difficulty: 1,
            min_duration: 30,
            hints: ['你买了什么？', '在哪里买的？', '为什么印象深刻？'],
            tags: ['narrative', 'personal']
          },
          {
            id: 'q002',
            text: '你更喜欢线上还是线下购物？为什么？',
            difficulty: 1,
            min_duration: 30,
            hints: ['你的偏好是？', '原因是什么？', '有例子吗？'],
            tags: ['opinion', 'comparison']
          },
          {
            id: 'q003',
            text: '描述你最喜欢的购物地点',
            difficulty: 1,
            min_duration: 30,
            hints: ['在哪里？', '有什么特色？', '你为什么喜欢？'],
            tags: ['descriptive', 'place']
          }
        ]
      },
      food: {
        id: 'food',
        name: '美食',
        questions: [
          {
            id: 'q004',
            text: '你最喜欢的家乡菜是什么？怎么做的？',
            difficulty: 1,
            min_duration: 30,
            hints: ['菜名是？', '主要食材？', '做法步骤？'],
            tags: ['descriptive', 'process']
          },
          {
            id: 'q005',
            text: '描述你最喜欢的餐厅',
            difficulty: 1,
            min_duration: 30,
            hints: ['在哪里？', '主打什么菜？', '为什么喜欢？'],
            tags: ['descriptive', 'place']
          },
          {
            id: 'q006',
            text: '你喜欢自己做饭还是出去吃？为什么？',
            difficulty: 1,
            min_duration: 30,
            hints: ['你的偏好？', '原因？', '举例说明？'],
            tags: ['opinion', 'personal']
          }
        ]
      },
      travel: {
        id: 'travel',
        name: '旅行',
        questions: [
          {
            id: 'q007',
            text: '介绍你去过的最难忘的地方',
            difficulty: 2,
            min_duration: 45,
            hints: ['在哪里？', '做了什么？', '为什么难忘？'],
            tags: ['narrative', 'place']
          },
          {
            id: 'q008',
            text: '如果可以去任何地方，你想去哪里？为什么？',
            difficulty: 2,
            min_duration: 45,
            hints: ['目的地？', '为什么选这里？', '想做什么？'],
            tags: ['hypothetical', 'creative']
          },
          {
            id: 'q009',
            text: '描述一次有趣的旅行经历',
            difficulty: 2,
            min_duration: 45,
            hints: ['发生了什么？', '在哪里？', '感受如何？'],
            tags: ['narrative', 'personal']
          }
        ]
      }
    }
  },
  career: {
    id: 'career',
    name: '职场',
    icon: 'Briefcase',
    subtopics: {
      interview: {
        id: 'interview',
        name: '面试',
        questions: [
          {
            id: 'q010',
            text: '如何向面试官介绍你自己？',
            difficulty: 2,
            min_duration: 45,
            hints: ['姓名和背景', '相关经验', '为什么适合这个职位'],
            tags: ['professional', 'self-introduction']
          },
          {
            id: 'q011',
            text: '你的优点和缺点是什么？',
            difficulty: 2,
            min_duration: 45,
            hints: ['举例说明优点', '如何改进缺点'],
            tags: ['professional', 'self-reflection']
          }
        ]
      },
      work: {
        id: 'work',
        name: '工作',
        questions: [
          {
            id: 'q012',
            text: '描述你的理想工作',
            difficulty: 2,
            min_duration: 45,
            hints: ['什么行业？', '什么职位？', '为什么理想？'],
            tags: ['professional', 'hypothetical']
          },
          {
            id: 'q013',
            text: '你如何处理工作压力？',
            difficulty: 2,
            min_duration: 45,
            hints: ['压力来源？', '应对方法？', '效果如何？'],
            tags: ['professional', 'personal']
          }
        ]
      }
    }
  },
  hobbies: {
    id: 'hobbies',
    name: '兴趣爱好',
    icon: 'Heart',
    subtopics: {
      reading: {
        id: 'reading',
        name: '阅读',
        questions: [
          {
            id: 'q014',
            text: '介绍你最喜欢的一本书',
            difficulty: 1,
            min_duration: 30,
            hints: ['书名？', '主要内容？', '为什么喜欢？'],
            tags: ['descriptive', 'personal']
          },
          {
            id: 'q015',
            text: '你更喜欢电子书还是纸质书？为什么？',
            difficulty: 1,
            min_duration: 30,
            hints: ['你的偏好？', '原因？', '举例？'],
            tags: ['opinion', 'comparison']
          }
        ]
      },
      music: {
        id: 'music',
        name: '音乐',
        questions: [
          {
            id: 'q016',
            text: '介绍你最喜欢的歌手或乐队',
            difficulty: 1,
            min_duration: 30,
            hints: ['名字？', '风格？', '为什么喜欢？'],
            tags: ['descriptive', 'personal']
          },
          {
            id: 'q017',
            text: '音乐对你来说意味着什么？',
            difficulty: 2,
            min_duration: 45,
            hints: ['情感表达？', '放松方式？', '记忆载体？'],
            tags: ['opinion', 'personal']
          }
        ]
      },
      sports: {
        id: 'sports',
        name: '运动',
        questions: [
          {
            id: 'q018',
            text: '介绍你最喜欢的运动',
            difficulty: 1,
            min_duration: 30,
            hints: ['什么运动？', '怎么玩？', '为什么喜欢？'],
            tags: ['descriptive', 'personal']
          },
          {
            id: 'q019',
            text: '你多久运动一次？',
            difficulty: 1,
            min_duration: 30,
            hints: ['频率？', '项目？', '感受？'],
            tags: ['personal', 'routine']
          }
        ]
      }
    }
  },
  education: {
    id: 'education',
    name: '教育',
    icon: 'GraduationCap',
    subtopics: {
      school: {
        id: 'school',
        name: '学校',
        questions: [
          {
            id: 'q020',
            text: '描述你的学校生活',
            difficulty: 1,
            min_duration: 30,
            hints: ['最喜欢的科目？', '课外活动？', '朋友？'],
            tags: ['descriptive', 'personal']
          },
          {
            id: 'q021',
            text: '你认为学校应该教什么？',
            difficulty: 2,
            min_duration: 45,
            hints: ['学科？', '技能？', '价值观？'],
            tags: ['opinion', 'educational']
          }
        ]
      },
      learning: {
        id: 'learning',
        name: '学习',
        questions: [
          {
            id: 'q022',
            text: '你是如何学习英语的？',
            difficulty: 2,
            min_duration: 45,
            hints: ['方法？', '资源？', '挑战？'],
            tags: ['process', 'personal']
          },
          {
            id: 'q023',
            text: '你想学什么新技能？为什么？',
            difficulty: 2,
            min_duration: 45,
            hints: ['技能名称？', '应用场景？', '学习计划？'],
            tags: ['hypothetical', 'personal']
          }
        ]
      }
    }
  }
}

export const UNLOCKED_TOPICS = {
  science: {
    id: 'science',
    name: '科学与探索',
    icon: 'FlaskConical',
    unlock_condition: { type: 'city_level', value: 'university' },
    subtopics: {
      space: {
        id: 'space',
        name: '太空',
        questions: [
          {
            id: 'q050',
            text: '如果可以去火星，你会带什么？为什么？',
            difficulty: 3,
            min_duration: 60,
            hints: ['三样物品', '为什么选它们', '在火星有什么用'],
            tags: ['hypothetical', 'creative']
          },
          {
            id: 'q051',
            text: '你认为人类应该探索太空吗？为什么？',
            difficulty: 3,
            min_duration: 60,
            hints: ['资源探索？', '科学发现？', '人类未来？'],
            tags: ['opinion', 'scientific']
          }
        ]
      }
    }
  },
  art: {
    id: 'art',
    name: '艺术表达',
    icon: 'Palette',
    unlock_condition: { type: 'city_level', value: 'gallery' },
    subtopics: {
      creativity: {
        id: 'creativity',
        name: '创造力',
        questions: [
          {
            id: 'q060',
            text: '描述你最喜欢的艺术作品',
            difficulty: 3,
            min_duration: 60,
            hints: ['类型？', '作者？', '为什么喜欢？'],
            tags: ['descriptive', 'artistic']
          },
          {
            id: 'q061',
            text: '你有什么艺术才能？',
            difficulty: 2,
            min_duration: 45,
            hints: ['绘画？音乐？写作？', '如何学习的？', '作品？'],
            tags: ['personal', 'artistic']
          }
        ]
      }
    }
  },
  international: {
    id: 'international',
    name: '国际事务',
    icon: 'Globe',
    unlock_condition: { type: 'city_level', value: 'airport' },
    subtopics: {
      travel_abroad: {
        id: 'travel_abroad',
        name: '国际旅行',
        questions: [
          {
            id: 'q070',
            text: '你想去哪个国家旅游？为什么？',
            difficulty: 2,
            min_duration: 45,
            hints: ['国家？', '文化？', '景点？'],
            tags: ['hypothetical', 'international']
          },
          {
            id: 'q071',
            text: '描述一次跨文化交流的经历',
            difficulty: 3,
            min_duration: 60,
            hints: ['在哪里？', '交流对象？', '收获？'],
            tags: ['narrative', 'international']
          }
        ]
      }
    }
  }
}
