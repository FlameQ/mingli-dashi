const app = getApp()
const dateUtil = require('../../utils/date-util')

Page({
  data: {
    modules: [
      { id: 'bazi', icon: '命', title: '八字排盘', desc: '四柱八字 · 命理推演', url: '/package-bazi/pages/input/input' },
      { id: 'qimen', icon: '遁', title: '奇门遁甲', desc: '时家转盘 · 预测吉凶', url: '/package-qimen/pages/input/input' },
      { id: 'ziwei', icon: '星', title: '紫微斗数', desc: '命宫星曜 · 人生格局', url: '/package-ziwei/pages/input/input' },
      { id: 'yinyuan', icon: '缘', title: '月老姻缘', desc: '红线牵引 · 缘分天定', url: '/package-yinyuan/pages/input/input' },
      { id: 'tarot', icon: '牌', title: '塔罗占卜', desc: '心灵之镜 · 洞见未来', url: '/package-tarot/pages/select/select' },
      { id: 'liuyao', icon: '卦', title: '六爻占卦', desc: '铜钱起卦 · 周易断事', url: '/package-liuyao/pages/input/input' },
      { id: 'fengshui', icon: '风', title: '易经风水', desc: '阳宅布局 · 趋吉避凶', url: '/package-fengshui/pages/input/input' },
      { id: 'buddhism', icon: '禅', title: '佛学大师', desc: '高僧开示 · 智慧人生', url: '/package-buddhism/pages/chat/chat' }
    ],
    dailyInfo: {},
    greeting: '',
    profiles: [],
    activeProfileId: '',
    hasProfiles: false
  },

  onLoad() {
    this.generateDailyInfo()
    this.setGreeting()
    this.loadProfiles()
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
    this.setData({
      profiles,
      activeProfileId: activeId,
      hasProfiles: profiles.length > 0
    })
  },

  onProfileTap(e) {
    const id = e.currentTarget.dataset.id
    app.setActiveProfile(id)
    this.setData({ activeProfileId: id })
  },

  onAddProfile() {
    wx.navigateTo({ url: '/pages/profile-edit/profile-edit' })
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
