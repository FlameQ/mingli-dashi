const baziCalc = require('../../../utils/bazi-calculator')
const app = getApp()

Page({
  data: {
    loaded: false,
    name: '',
    pillars: {},
    dayMaster: '',
    dayMasterWx: '',
    strength: {},
    wuxingCount: {},
    fullShishen: {},
    naying: {},
    zodiac: '',
    xiyong: {},
    geju: {},
    personality: {},
    lifeDomains: {},
    luckyElements: {},
    dayunList: [],
    reading: {},
    saved: false
  },

  onLoad(options) {
    if (options.data) {
      this.calculate(JSON.parse(decodeURIComponent(options.data)))
    }
  },

  calculate(params) {
    const [y, m, d] = params.birthDate.split('-').map(Number)
    const hourMap = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]
    const hour = hourMap[params.birthHourIndex] || 12
    const result = baziCalc.calculateBazi(y, m, d, hour, params.gender)
    this.setData({
      loaded: true,
      name: params.name || '',
      ...result,
      params
    })
  },

  onSave() {
    if (this.data.saved) { wx.showToast({ title: '已保存', icon: 'none' }); return }
    const name = this.data.name || '某人'
    app.addToHistory({
      type: '八字排盘',
      summary: `${name} · ${this.data.zodiac} · ${this.data.geju.name}`,
      url: '/package-bazi/pages/input/input'
    })
    this.setData({ saved: true })
    wx.showToast({ title: '已保存到记录', icon: 'success' })
  },

  onRetry() { wx.navigateBack() }
})
