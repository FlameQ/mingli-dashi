const dateUtil = require('../../utils/date-util')

Page({
  data: {
    modules: [
      { id: 'bazi', icon: '🎴', title: '八字排盘', desc: '输入生辰 · 解读命运', url: '/package-bazi/pages/input/input', color: '#AA2116' },
      { id: 'qimen', icon: '🧭', title: '奇门遁甲', desc: '时家转盘 · 预测吉凶', url: '/package-qimen/pages/input/input', color: '#D4A017' },
      { id: 'ziwei', icon: '⭐', title: '紫微斗数', desc: '命宫星曜 · 人生格局', url: '/package-ziwei/pages/input/input', color: '#C93756' },
      { id: 'yinyuan', icon: '💕', title: '月老姻缘', desc: '红线牵引 · 缘分天定', url: '/package-yinyuan/pages/input/input', color: '#F07050' },
      { id: 'tarot', icon: '🔮', title: '塔罗占卜', desc: '心灵之镜 · 洞见未来', url: '/package-tarot/pages/select/select', color: '#7B68AE' },
      { id: 'liuyao', icon: '☯️', title: '六爻占卦', desc: '铜钱起卦 · 周易断事', url: '/package-liuyao/pages/input/input', color: '#B36D61' },
      { id: 'fengshui', icon: '🏠', title: '易经风水', desc: '阳宅布局 · 趋吉避凶', url: '/package-fengshui/pages/input/input', color: '#6B9E3C' },
      { id: 'buddhism', icon: '🙏', title: '佛学大师', desc: '高僧开示 · 智慧人生', url: '/package-buddhism/pages/chat/chat', color: '#D4A017' }
    ],
    dailyInfo: {},
    greeting: ''
  },

  onLoad() {
    this.generateDailyInfo()
    this.setGreeting()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  setGreeting() {
    const hour = new Date().getHours()
    let greeting = '夜深了，'
    if (hour >= 5 && hour < 8) greeting = '早安，'
    else if (hour >= 8 && hour < 12) greeting = '上午好，'
    else if (hour >= 12 && hour < 14) greeting = '中午好，'
    else if (hour >= 14 && hour < 18) greeting = '下午好，'
    else if (hour >= 18 && hour < 22) greeting = '晚上好，'
    this.setData({ greeting })
  },

  generateDailyInfo() {
    const now = new Date()
    const yearGz = dateUtil.getYearGanZhi(now.getFullYear())
    const zodiac = dateUtil.getZodiac(now.getFullYear())
    const shichen = dateUtil.getShichenName(now.getHours())

    const yiItems = ['祭祀', '祈福', '求嗣', '出行', '嫁娶', '纳采', '开市', '交易', '入宅', '安葬']
    const jiItems = ['动土', '破土', '修造', '开仓', '掘井', '开渠', '安床', '造桥', '乘船', '远行']

    const yiCount = 3 + Math.floor(Math.random() * 3)
    const jiCount = 2 + Math.floor(Math.random() * 3)

    const shuffledYi = yiItems.sort(() => Math.random() - 0.5).slice(0, yiCount)
    const shuffledJi = jiItems.sort(() => Math.random() - 0.5).slice(0, jiCount)

    this.setData({
      dailyInfo: {
        date: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`,
        yearGz,
        zodiac,
        shichen,
        yi: shuffledYi,
        ji: shuffledJi
      }
    })
  },

  onModuleTap(e) {
    const { url } = e.currentTarget.dataset
    wx.navigateTo({ url })
  },

  onPullDownRefresh() {
    this.generateDailyInfo()
    wx.stopPullDownRefresh()
  }
})
