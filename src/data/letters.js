export const LETTER_TEMPLATES = {
  wish_education: [
    {
      id: 'wish_library_001',
      condition: {
        area: 'education',
        growth_min: 40,
        building_not_exists: 'library'
      },
      template: {
        greeting: ['亲爱的城市守护者', '您好', '致城市的建设者'],
        body: [
          '最近我们学校的学生越来越多，大家都希望能有一座图书馆。',
          '孩子们经常问我什么时候能有更多书可以借阅。',
          '我注意到很多居民都喜欢阅读，如果能建一座图书馆就太好了。'
        ],
        closing: ['期待您能看到我们的愿望。', '希望城市越来越好。', '感谢您为城市所做的一切。']
      },
      sender: { type: 'teacher', fallback_name: '一位小学老师' }
    },
    {
      id: 'wish_school_001',
      condition: {
        area: 'education',
        growth_min: 5,
        building_not_exists: 'school'
      },
      template: {
        greeting: ['亲爱的城市守护者'],
        body: [
          '孩子们需要一个学习的地方。',
          '我们希望能有一所学校，让孩子们可以系统地学习知识。',
          '教育是城市发展的基础，不是吗？'
        ],
        closing: ['期待您的回应。']
      },
      sender: { type: 'any', fallback_name: '几位关心教育的居民' }
    },
    {
      id: 'wish_university_001',
      condition: {
        area: 'education',
        growth_min: 150,
        building_not_exists: 'university'
      },
      template: {
        greeting: ['尊敬的守护者'],
        body: [
          '城市发展得很快，年轻人们渴望更高等的教育。',
          '如果能建一所大学，我们的城市就能培养更多专业人才。',
          '这将是城市迈向现代化的重要一步。'
        ],
        closing: ['期待城市的未来。']
      },
      sender: { type: 'professor_or_teacher', fallback_name: '一位资深教师' }
    }
  ],
  wish_arts: [
    {
      id: 'wish_gallery_001',
      condition: {
        area: 'arts',
        growth_min: 35,
        building_not_exists: 'gallery'
      },
      template: {
        greeting: ['您好', '致城市的创造者'],
        body: [
          '最近街头出现了很多美丽的涂鸦和艺术作品。',
          '我在想，如果我们能有一座美术馆，该有多好。',
          '很多居民都有创作的热情，也许我们需要一个展示的空间。',
          '艺术能让城市更有灵魂。'
        ],
        closing: ['期待城市的艺术氛围越来越浓。']
      },
      sender: { type: 'artist_or_any', fallback_name: '一位热爱艺术的居民' }
    },
    {
      id: 'wish_theater_001',
      condition: {
        area: 'arts',
        growth_min: 70,
        building_not_exists: 'theater'
      },
      template: {
        greeting: ['亲爱的守护者'],
        body: [
          '城市的文化生活需要更多的舞台。',
          '我们希望能有一座剧院，可以上演戏剧、音乐会和各种表演。',
          '这将成为城市文化的新地标。'
        ],
        closing: ['感谢您一直以来的支持。']
      },
      sender: { type: 'artist', fallback_name: '一位表演者' }
    }
  ],
  wish_infrastructure: [
    {
      id: 'wish_hospital_001',
      condition: {
        area: 'infrastructure',
        growth_min: 30,
        population_min: 20,
        building_not_exists: 'hospital'
      },
      template: {
        greeting: ['尊敬的守护者'],
        body: [
          '随着城市人口的增长，我们需要更好的医疗设施。',
          '建一座医院是保障居民健康的重要措施。',
          '希望您能考虑我们的需求。'
        ],
        closing: ['期待您的决定。']
      },
      sender: { type: 'doctor_or_any', fallback_name: '一位关心社区的居民' }
    },
    {
      id: 'wish_park_001',
      condition: {
        area: 'infrastructure',
        growth_min: 10,
        building_not_exists: 'park'
      },
      template: {
        greeting: ['您好'],
        body: [
          '城市越来越忙碌了，我们需要一个放松的地方。',
          '一个公园会让居民们有地方散步、锻炼、享受自然。',
          '绿色空间对城市来说很重要。'
        ],
        closing: ['希望您能理解我们的愿望。']
      },
      sender: { type: 'any', fallback_name: '几位喜欢自然的居民' }
    },
    {
      id: 'wish_airport_001',
      condition: {
        area: 'infrastructure',
        growth_min: 200,
        building_not_exists: 'airport'
      },
      template: {
        greeting: ['尊敬的守护者'],
        body: [
          '城市已经发展到了一个新的阶段。',
          '我们需要一座国际机场来连接世界。',
          '这将吸引更多游客和投资，让城市更加国际化。',
          '是时候让世界看到我们的城市了。'
        ],
        closing: ['期待城市走向世界。']
      },
      sender: { type: 'businessman', fallback_name: '一位企业家' }
    }
  ],
  gratitude: [
    {
      id: 'thanks_general_001',
      condition: {
        days_since_last_letter: 5,
        happiness_min: 60
      },
      template: {
        greeting: ['亲爱的城市守护者'],
        body: [
          '最近城市变化真的很大，大家都觉得生活越来越方便了。',
          '谢谢您为我们创造这么好的环境。',
          '我真的很喜欢现在的生活，希望城市继续成长。',
          '每天醒来都能看到新的变化，这种感觉真好。'
        ],
        closing: ['祝您一切顺利。', '感谢您的付出。']
      },
      sender: { type: 'random_resident' }
    },
    {
      id: 'thanks_building_001',
      condition: {
        recent_building_added: true,
        happiness_min: 70
      },
      template: {
        greeting: ['亲爱的守护者'],
        body: [
          '听说我们要建一座新建筑了，大家都很兴奋！',
          '这个城市因为您的努力而变得越来越好。',
          '我们会珍惜这一切，努力生活。'
        ],
        closing: ['由衷地感谢您。']
      },
      sender: { type: 'random_resident' }
    }
  ],
  life_event: [
    {
      id: 'event_baby_001',
      condition: { event_type: 'baby_born' },
      template: {
        sender_is_parent: true,
        body: [
          '我们很高兴地告诉您，我们的孩子 {child_name} 出生了！',
          '感谢这座城市给了我们安家的地方，希望孩子能在这里健康成长。',
          '看着城市一天天变好，我们对未来充满期待。'
        ],
        closing: ['愿城市永远繁荣。']
      }
    },
    {
      id: 'event_marriage_001',
      condition: { event_type: 'marriage' },
      template: {
        sender_is_partner: true,
        body: [
          '我和 {partner_name} 结婚了！',
          '我们选择在这座城市开始新的生活，因为这里让我们感到幸福和安全。',
          '感谢您创造了这么美好的城市。'
        ],
        closing: ['祝城市越来越好。']
      }
    },
    {
      id: 'event_new_job_001',
      condition: { event_type: 'new_job' },
      template: {
        sender_is_self: true,
        body: [
          '我找到了新工作！',
          '城市的发展给了我们更多机会，我很幸运能在这里生活和工作。',
          '我会继续努力，为城市贡献自己的力量。'
        ],
        closing: ['感谢这座城市。']
      }
    },
    {
      id: 'event_retirement_001',
      condition: { event_type: 'retirement' },
      template: {
        sender_is_self: true,
        body: [
          '我退休了。回首这些年，看着城市从一片荒地变成现在的样子，感慨万千。',
          '感谢您一直以来的守护，让我们能在这座城市安享晚年。',
          '希望下一代能继续见证城市的成长。'
        ],
        closing: ['祝福城市的未来。']
      }
    }
  ],
  city_update: [
    {
      id: 'update_population_001',
      condition: {
        population_increase: 10,
        days_since_last_letter: 3
      },
      template: {
        greeting: ['您好'],
        body: [
          '最近城市又迎来了新居民！',
          '越来越多的人选择在这里安家，城市变得越来越热闹了。',
          '我们需要更多的住房和基础设施来迎接他们。'
        ],
        closing: ['期待城市继续发展。']
      },
      sender: { type: 'any', fallback_name: '一位社区志愿者' }
    },
    {
      id: 'update_international_001',
      condition: {
        international_growth: 0.2,
        building_exists: 'language_corner'
      },
      template: {
        greeting: ['亲爱的守护者'],
        body: [
          '语言角越来越热闹了！',
          '很多居民开始学习外语，甚至有外国朋友来交流。',
          '我们的城市正在变得越来越国际化。'
        ],
        closing: ['为城市的进步感到骄傲。']
      },
      sender: { type: 'teacher', fallback_name: '语言角的一位志愿者' }
    }
  ]
}
