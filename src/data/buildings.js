export const BUILDING_TREE = {
  education: [
    {
      id: 'tent',
      name: '帐篷',
      icon: 'tent',
      level: 1,
      unlock_condition: { growth_points: 0 },
      description: '城市的起点，第一批居民的居所',
      energy_cost: 0
    },
    {
      id: 'school',
      name: '小学',
      icon: 'school',
      level: 2,
      unlock_condition: { growth_points: 10 },
      description: '孩子们开始学习知识',
      energy_cost: 5,
      effect: { population_growth: 0.1 }
    },
    {
      id: 'language_corner',
      name: '语言角',
      icon: 'languages',
      level: 3,
      unlock_condition: { growth_points: 25 },
      description: '居民开始学习外语',
      energy_cost: 8,
      effect: { international_growth: 0.15 }
    },
    {
      id: 'library',
      name: '图书馆',
      icon: 'library',
      level: 4,
      unlock_condition: { growth_points: 50 },
      description: '知识的殿堂，居民可以阅读更多书籍',
      energy_cost: 15,
      effect: { education_level: 0.2, happiness: 0.1 }
    },
    {
      id: 'international_school',
      name: '国际学校',
      icon: 'globe',
      level: 5,
      unlock_condition: { growth_points: 100 },
      description: '吸引外国学生和教师',
      energy_cost: 25,
      effect: { international_growth: 0.3, population_growth: 0.15 }
    },
    {
      id: 'university',
      name: '大学',
      icon: 'graduation-cap',
      level: 6,
      unlock_condition: { growth_points: 200 },
      description: '高等教育中心，培养专业人才',
      energy_cost: 50,
      effect: { research_growth: 0.4, education_level: 0.3 }
    },
    {
      id: 'research_center',
      name: '科研中心',
      icon: 'flask-conical',
      level: 7,
      unlock_condition: { growth_points: 400 },
      description: '前沿科技研究',
      energy_cost: 100,
      effect: { tech_level: 0.5, research_growth: 0.5 }
    }
  ],
  arts: [
    {
      id: 'street_art',
      name: '街头艺术',
      icon: 'paintbrush',
      level: 1,
      unlock_condition: { growth_points: 5 },
      description: '城市开始有艺术气息',
      energy_cost: 3
    },
    {
      id: 'studio',
      name: '画室',
      icon: 'palette',
      level: 2,
      unlock_condition: { growth_points: 20 },
      description: '艺术家开始创作',
      energy_cost: 10,
      effect: { arts_growth: 0.1 }
    },
    {
      id: 'gallery',
      name: '画廊',
      icon: 'frame',
      level: 3,
      unlock_condition: { growth_points: 45 },
      description: '展示艺术品，吸引参观者',
      energy_cost: 20,
      effect: { tourism: 0.2, happiness: 0.15 }
    },
    {
      id: 'theater',
      name: '剧院',
      icon: 'theater',
      level: 4,
      unlock_condition: { growth_points: 90 },
      description: '戏剧和表演艺术中心',
      energy_cost: 40,
      effect: { culture_level: 0.3, happiness: 0.2 }
    },
    {
      id: 'museum',
      name: '博物馆',
      icon: 'museum',
      level: 5,
      unlock_condition: { growth_points: 200 },
      description: '收藏和展示文化遗产',
      energy_cost: 80,
      effect: { tourism: 0.4, culture_level: 0.4 }
    }
  ],
  economy: [
    {
      id: 'market',
      name: '集市',
      icon: 'store',
      level: 1,
      unlock_condition: { growth_points: 8 },
      description: '居民开始交易',
      energy_cost: 4
    },
    {
      id: 'shop',
      name: '商店',
      icon: 'shopping-bag',
      level: 2,
      unlock_condition: { growth_points: 22 },
      description: '固定的商业场所',
      energy_cost: 12,
      effect: { wealth: 0.1 }
    },
    {
      id: 'mall',
      name: '商业街',
      icon: 'building-2',
      level: 3,
      unlock_condition: { growth_points: 55 },
      description: '多种商业业态聚集',
      energy_cost: 30,
      effect: { wealth: 0.2, employment: 0.15 }
    },
    {
      id: 'financial_center',
      name: '金融中心',
      icon: 'landmark',
      level: 4,
      unlock_condition: { growth_points: 120 },
      description: '吸引投资和金融机构',
      energy_cost: 60,
      effect: { wealth: 0.4, economy_growth: 0.3 }
    }
  ],
  infrastructure: [
    {
      id: 'road',
      name: '道路',
      icon: 'road',
      level: 1,
      unlock_condition: { growth_points: 3 },
      description: '连接城市各区域',
      energy_cost: 2
    },
    {
      id: 'park',
      name: '公园',
      icon: 'tree-pine',
      level: 2,
      unlock_condition: { growth_points: 15 },
      description: '居民休闲的场所',
      energy_cost: 8,
      effect: { happiness: 0.1, health: 0.05 }
    },
    {
      id: 'hospital',
      name: '医院',
      icon: 'hospital',
      level: 3,
      unlock_condition: { growth_points: 40 },
      description: '保障居民健康',
      energy_cost: 25,
      effect: { health: 0.2, population_growth: 0.1 }
    },
    {
      id: 'subway',
      name: '地铁',
      icon: 'train',
      level: 4,
      unlock_condition: { growth_points: 100 },
      description: '快速交通系统',
      energy_cost: 50,
      effect: { mobility: 0.3, employment: 0.2 }
    },
    {
      id: 'airport',
      name: '国际机场',
      icon: 'plane',
      level: 5,
      unlock_condition: { growth_points: 250 },
      description: '连接世界的门户',
      energy_cost: 120,
      effect: { international_growth: 0.5, tourism: 0.4 }
    }
  ],
  residential: [
    {
      id: 'house',
      name: '民居',
      icon: 'home',
      level: 1,
      unlock_condition: { growth_points: 5 },
      description: '居民的家',
      energy_cost: 3,
      effect: { population_growth: 0.05 }
    },
    {
      id: 'apartment',
      name: '公寓',
      icon: 'building',
      level: 2,
      unlock_condition: { growth_points: 20 },
      description: '高密度住宅',
      energy_cost: 10,
      effect: { population_growth: 0.15 }
    },
    {
      id: 'highrise',
      name: '高层住宅',
      icon: 'skyscraper',
      level: 3,
      unlock_condition: { growth_points: 60 },
      description: '现代化摩天大楼',
      energy_cost: 35,
      effect: { population_growth: 0.25, wealth: 0.1 }
    }
  ]
}

export const CITY_PHASES = [
  {
    id: 'wilderness',
    name: '荒地期',
    day_range: [1, 10],
    description: '只有帐篷和营地，第一批树苗',
    background: 'wilderness'
  },
  {
    id: 'village',
    name: '村落期',
    day_range: [11, 30],
    description: '小屋、农田、小学、第一个家庭',
    background: 'village'
  },
  {
    id: 'town',
    name: '城镇期',
    day_range: [31, 90],
    description: '街道、商店、公园、公交',
    background: 'town'
  },
  {
    id: 'city',
    name: '城市期',
    day_range: [91, 365],
    description: '高楼、地铁、大学、国际机场',
    background: 'city'
  },
  {
    id: 'metropolis',
    name: '都会期',
    day_range: [366, 730],
    description: '摩天楼、高铁、未来区、太空港在建',
    background: 'metropolis'
  },
  {
    id: 'singularity',
    name: '奇点期',
    day_range: [731, Infinity],
    description: '海底城市、空中花园、星际港口',
    background: 'singularity'
  }
]
