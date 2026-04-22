const app = getApp()
const dateUtil = require('../../utils/date-util')

// ===== 64 Hexagram Data =====
const GUA_NAMES = ['乾','坤','屯','蒙','需','讼','师','比','小畜','履','泰','否','同人','大有','谦','豫','随','蛊','临','观','噬嗑','贲','剥','复','无妄','大畜','颐','大过','坎','离','咸','恒','遁','大壮','晋','明夷','家人','睽','蹇','解','损','益','夬','姤','萃','升','困','井','革','鼎','震','艮','渐','归妹','丰','旅','巽','兑','涣','节','中孚','小过','既济','未济']

const GUA_FORTUNES = {
  '乾': '天行健，君子以自强不息。今日宜积极进取，把握机遇。',
  '坤': '地势坤，君子以厚德载物。今日宜沉稳守成，以柔克刚。',
  '屯': '万事起头难，但生机已现。今日宜耐心等待，不宜冒进。',
  '蒙': '蒙以养正，圣功也。今日宜虚心学习，求教于人。',
  '需': '守正待时，耐心等待。今日宜从容不迫，厚积薄发。',
  '讼': '争端之象，宜退不宜进。今日宜以和为贵，避免争执。',
  '师': '众志成城，团队之力。今日宜借助他人之力，共谋大事。',
  '比': '亲比相辅，贵在真诚。今日宜与人合作，广结善缘。',
  '小畜': '积小成大，蓄势待发。今日宜量入为出，积少成多。',
  '履': '如履薄冰，小心行事。今日宜谨慎低调，步步为营。',
  '泰': '天地交泰，万物通达。今日大吉，宜大胆行动。',
  '否': '天地不交，闭塞之象。今日宜韬光养晦，静待转机。',
  '同人': '志同道合，众擎易举。今日宜社交合作，广纳良言。',
  '大有': '大有丰收，光明在前。今日宜分享成果，广施恩惠。',
  '谦': '谦逊有礼，谦受益。今日宜低调做人，必有贵人。',
  '豫': '愉悦安乐，顺其自然。今日宜放松心情，享受当下。',
  '随': '随机应变，顺势而为。今日宜灵活调整计划。',
  '蛊': '整治积弊，拨乱反正。今日宜解决问题，化解隐患。',
  '临': '居高临下，亲临指导。今日宜亲力亲为，身先士卒。',
  '观': '观天察地，审时度势。今日宜冷静观察，三思后行。',
  '噬嗑': '明辨是非，决断果敢。今日宜果断处理棘手之事。',
  '贲': '文饰之美，修饰得当。今日宜注重形象，以美服人。',
  '剥': '剥落之象，不宜冒进。今日宜守成为上，蛰伏等待。',
  '复': '否极泰来，生机重现。今日宜重整旗鼓，从头再来。',
  '无妄': '无妄之行，顺其自然。今日宜脚踏实地，不可妄动。',
  '大畜': '蓄养贤能，厚积薄发。今日宜学习积累，提升自我。',
  '颐': '颐养身心，注意调养。今日宜注重健康，休养生息。',
  '大过': '大过之变，非常之时。今日宜果断抉择，不可犹豫。',
  '坎': '险阻重重，行路艰难。今日宜小心谨慎，步步为营。',
  '离': '光明附丽，前途光明。今日宜积极向上，追求理想。',
  '咸': '感应相通，心心相印。今日宜敞开心扉，真诚沟通。',
  '恒': '持之以恒，久久为功。今日宜坚持到底，不轻言放弃。',
  '遁': '退避三舍，韬光养晦。今日宜以退为进，保存实力。',
  '大壮': '气势如虹，正当壮盛。今日宜勇敢行动，但不可鲁莽。',
  '晋': '晋升之象，前途似锦。今日宜积极争取，展现才华。',
  '明夷': '光明受阻，暂时隐忍。今日宜韬光养晦，等待时机。',
  '家人': '家庭和睦，相亲相爱。今日宜关注家人，享受温情。',
  '睽': '背离之象，各执己见。今日宜换位思考，化解分歧。',
  '蹇': '行路艰难，前有险阻。今日宜迂回而行，另辟蹊径。',
  '解': '解除困境，雨过天晴。今日宜抓紧时机，化解积难。',
  '损': '有舍有得，先损后益。今日宜舍小取大，着眼长远。',
  '益': '增益进取，顺风顺水。今日宜积极行动，大胆开拓。',
  '夬': '决断果敢，当机立断。今日宜果断决策，不可拖延。',
  '姤': '偶遇之缘，不期而遇。今日宜随缘而遇，珍惜当下。',
  '萃': '汇聚之象，群英荟萃。今日宜广纳人才，凝聚力量。',
  '升': '步步高升，前途无量。今日宜稳扎稳打，逐步攀升。',
  '困': '困境之中，守正待时。今日宜忍耐坚持，必有转机。',
  '井': '源源不断，利济众人。今日宜无私奉献，广种善因。',
  '革': '变革之象，除旧布新。今日宜大胆革新，打破常规。',
  '鼎': '鼎新之象，吉祥如意。今日宜开创新局，施展抱负。',
  '震': '雷声震动，警醒自省。今日宜居安思危，未雨绸缪。',
  '艮': '止而不动，静待其变。今日宜修身养性，静心等待。',
  '渐': '循序渐进，稳步前行。今日宜按部就班，不可急躁。',
  '归妹': '归妹之象，宜慎抉择。今日宜三思而行，不可冲动。',
  '丰': '丰盛之极，满载而归。今日宜把握丰收，分享喜悦。',
  '旅': '旅途在外，小心谨慎。今日宜低调行事，注意安全。',
  '巽': '柔顺谦逊，随风而行。今日宜灵活应变，借势而为。',
  '兑': '喜悦之象，和乐融融。今日宜与人分享，广结善缘。',
  '涣': '涣散之象，宜聚不宜散。今日宜凝心聚力，共克时艰。',
  '节': '节制有度，适可而止。今日宜量力而行，不可过度。',
  '中孚': '诚信为本，以诚待人。今日宜真诚守信，必有回报。',
  '小过': '小有过越，宜小不宜大。今日宜做小事，积小胜为大胜。',
  '既济': '万事已成，功成告捷。今日宜巩固成果，防微杜渐。',
  '未济': '事尚未成，仍需努力。今日宜总结反思，为下一步蓄力。'
}

// King Wen hexagram lookup: HEXAGRAM_TABLE[upperTrigram * 8 + lowerTrigram] = King Wen number (1-indexed)
// Trigram index by binary value: 坤(000)=0, 震(001)=1, 坎(010)=2, 兑(011)=3, 艮(100)=4, 离(101)=5, 巽(110)=6, 乾(111)=7
const HEXAGRAM_TABLE = [
  2, 16, 8, 45, 23, 35, 20, 12,   // upper=坤
  24, 51, 3, 17, 27, 21, 42, 25,  // upper=震
  7, 40, 29, 47, 4, 64, 59, 6,   // upper=坎
  19, 54, 60, 58, 41, 38, 61, 10, // upper=兑
  15, 62, 39, 31, 52, 56, 53, 33, // upper=艮
  36, 55, 63, 49, 22, 30, 37, 13, // upper=离
  46, 32, 48, 28, 18, 50, 57, 44, // upper=巽
  11, 34, 5, 43, 26, 14, 9, 1     // upper=乾
]

Page({
  data: {
    moduleGroups: [
      {
        id: 'mingli',
        title: '命理推演',
        modules: [
          { id: 'bazi', icon: '☯', title: '八字排盘', url: '/package-bazi/pages/input/input' },
          { id: 'ziwei', icon: '★', title: '紫微斗数', url: '/package-ziwei/pages/input/input' }
        ]
      },
      {
        id: 'zhanbu',
        title: '占卜问卦',
        modules: [
          { id: 'qimen', icon: '☲', title: '奇门遁甲', url: '/package-qimen/pages/input/input' },
          { id: 'liuyao', icon: '☰', title: '六爻占卦', url: '/package-liuyao/pages/input/input' },
          { id: 'tarot', icon: '◆', title: '塔罗占卜', url: '/package-tarot/pages/select/select' }
        ]
      },
      {
        id: 'yunshi',
        title: '生活运势',
        modules: [
          { id: 'yinyuan', icon: '♡', title: '月老姻缘', url: '/package-yinyuan/pages/input/input' },
          { id: 'fengshui', icon: '≈', title: '易经风水', url: '/package-fengshui/pages/input/input' },
          { id: 'buddhism', icon: '☸', title: '佛学大师', url: '/package-buddhism/pages/chat/chat' }
        ]
      }
    ],
    dailyInfo: {},
    dailyGua: {},
    greeting: '',
    profiles: [],
    activeProfileId: '',
    hasProfiles: false,
    activeProfile: null,
    // Coin divination state
    showCoinModal: false,
    coinRound: 0,
    coinLines: [],
    coins: [0, 0, 0],
    isFlipping: false,
    hexagramResult: null
  },

  onLoad() {
    this.generateDailyInfo()
    this.generateDailyGua()
    this.setGreeting()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
    this.loadProfiles()
  },

  loadProfiles() {
    const profiles = app.getProfiles() || []
    const activeId = app.globalData.activeProfileId
    const activeProfile = profiles.find(p => p.id === activeId) || null
    this.setData({
      profiles,
      activeProfileId: activeId,
      hasProfiles: profiles.length > 0,
      activeProfile
    })
  },

  onProfileTap(e) {
    const id = e.currentTarget.dataset.id
    app.setActiveProfile(id)
    const activeProfile = this.data.profiles.find(p => p.id === id) || null
    this.setData({ activeProfileId: id, activeProfile })
  },

  onAddProfile() {
    wx.navigateTo({ url: '/pages/profile-edit/profile-edit' })
  },

  setGreeting() {
    const hour = new Date().getHours()
    let greeting = '夜深了'
    if (hour >= 5 && hour < 8) greeting = '早安'
    else if (hour >= 8 && hour < 12) greeting = '上午好'
    else if (hour >= 12 && hour < 14) greeting = '中午好'
    else if (hour >= 14 && hour < 18) greeting = '下午好'
    else if (hour >= 18 && hour < 22) greeting = '晚上好'
    this.setData({ greeting })
  },

  generateDailyInfo() {
    const now = new Date()
    const yearGz = dateUtil.getYearGanZhi(now.getFullYear())
    const zodiac = dateUtil.getZodiac(now.getFullYear())
    const shichen = dateUtil.getShichenName(now.getHours())

    const yiItems = ['祭祀', '祈福', '求嗣', '出行', '嫁娶', '纳采', '开市', '交易', '入宅', '安葬']
    const jiItems = ['动土', '破土', '修造', '开仓', '掘井', '开渠', '安床', '造桥', '乘船', '远行']

    const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
    const shuffle = (arr, s) => {
      const a = [...arr]
      for (let i = a.length - 1; i > 0; i--) {
        const j = ((s * (i + 1) + i * 31) % (i + 1) + (i + 1)) % (i + 1)
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }
    const yiCount = 3 + (seed % 3)
    const jiCount = 2 + (seed % 3)

    this.setData({
      dailyInfo: {
        date: `${now.getMonth() + 1}月${now.getDate()}日`,
        yearGz,
        zodiac,
        shichen,
        yi: shuffle(yiItems, seed).slice(0, yiCount),
        ji: shuffle(jiItems, seed + 1).slice(0, jiCount)
      }
    })
  },

  generateDailyGua() {
    const now = new Date()
    const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
    const index = seed % 64
    const guaName = GUA_NAMES[index]
    const reading = GUA_FORTUNES[guaName] || '今日卦象，宜静心观变，顺时而动。'

    const yaos = []
    for (let i = 0; i < 6; i++) {
      const lineSeed = (seed * (i + 1) + i * 7) % 100
      yaos.push({ line: lineSeed >= 50 ? '━━━━━' : '━ ━ ━' })
    }

    this.setData({
      dailyGua: { name: guaName, reading, yaos, date: `${now.getMonth() + 1}月${now.getDate()}日` }
    })
  },

  onModuleTap(e) {
    const { id } = e.currentTarget.dataset
    const profile = this.data.activeProfile

    if (id === 'bazi' && profile && profile.birthDate) {
      const params = encodeURIComponent(JSON.stringify({
        name: profile.name, gender: profile.gender,
        birthDate: profile.birthDate,
        birthHourIndex: profile.birthHourIndex != null ? profile.birthHourIndex : 6,
        birthPlace: profile.birthPlace || ''
      }))
      wx.navigateTo({ url: `/package-bazi/pages/result/result?data=${params}` })
      return
    }

    if (id === 'ziwei' && profile && profile.birthDate) {
      const params = encodeURIComponent(JSON.stringify({
        name: profile.name, gender: profile.gender,
        birthDate: profile.birthDate,
        birthHourIndex: profile.birthHourIndex != null ? profile.birthHourIndex : 6
      }))
      wx.navigateTo({ url: `/package-ziwei/pages/result/result?data=${params}` })
      return
    }

    let url = e.currentTarget.dataset.url
    if (!url) {
      for (const group of this.data.moduleGroups) {
        const mod = group.modules.find(m => m.id === id)
        if (mod) { url = mod.url; break }
      }
    }
    if (url) wx.navigateTo({ url })
  },

  // ===== Coin Divination (铜钱起卦法) =====
  onStartDivination() {
    this.setData({
      showCoinModal: true,
      coinRound: 0,
      coinLines: [],
      coins: [0, 0, 0],
      isFlipping: false,
      hexagramResult: null
    })
  },

  onTossCoins() {
    if (this.data.isFlipping || this.data.hexagramResult) return
    this.setData({ isFlipping: true })

    // Simulate 3 coin tosses: 字(heads)=3, 背(tails)=2
    const coins = [
      Math.random() < 0.5 ? 3 : 2,
      Math.random() < 0.5 ? 3 : 2,
      Math.random() < 0.5 ? 3 : 2
    ]

    const sum = coins[0] + coins[1] + coins[2]
    let lineType, lineSymbol, isMoving, yang

    if (sum === 6) {
      lineType = '老阴'; lineSymbol = '━ ━ ━'; isMoving = true; yang = false
    } else if (sum === 7) {
      lineType = '少阳'; lineSymbol = '━━━━━'; isMoving = false; yang = true
    } else if (sum === 8) {
      lineType = '少阴'; lineSymbol = '━ ━ ━'; isMoving = false; yang = false
    } else {
      lineType = '老阳'; lineSymbol = '━━━━━'; isMoving = true; yang = true
    }

    setTimeout(() => {
      const newLines = [...this.data.coinLines, {
        coins: [...coins], sum, lineType, lineSymbol, isMoving, yang,
        position: this.data.coinRound + 1
      }]
      const nextRound = this.data.coinRound + 1
      const isComplete = nextRound >= 6

      if (isComplete) {
        const hexagramResult = this.lookupHexagram(newLines)
        this.setData({
          coinLines: newLines, coinRound: nextRound,
          coins, isFlipping: false, hexagramResult
        })
      } else {
        this.setData({
          coinLines: newLines, coinRound: nextRound,
          coins, isFlipping: false
        })
      }
    }, 1200)
  },

  lookupHexagram(lines) {
    // Lower trigram = lines 0,1,2 (bottom to top); Upper = lines 3,4,5
    const lower = (lines[0].yang ? 1 : 0) + (lines[1].yang ? 2 : 0) + (lines[2].yang ? 4 : 0)
    const upper = (lines[3].yang ? 1 : 0) + (lines[4].yang ? 2 : 0) + (lines[5].yang ? 4 : 0)
    const kingWenNum = HEXAGRAM_TABLE[upper * 8 + lower]
    const guaIndex = kingWenNum - 1
    const guaName = GUA_NAMES[guaIndex]
    const reading = GUA_FORTUNES[guaName] || '卦象已成，宜静心观变，顺势而为。'
    const movingLines = lines.filter(l => l.isMoving).map(l => `第${l.position}爻${l.lineType}`)

    return { name: guaName, reading, movingLines, lines }
  },

  onCloseDivination() {
    this.setData({ showCoinModal: false })
  },

  onResetDivination() {
    this.setData({
      coinRound: 0, coinLines: [], coins: [0, 0, 0],
      isFlipping: false, hexagramResult: null
    })
  },

  onPullDownRefresh() {
    this.generateDailyInfo()
    this.generateDailyGua()
    this.loadProfiles()
    wx.stopPullDownRefresh()
  }
})
