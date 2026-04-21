const baziCalc = require('../../../utils/bazi-calculator')
const app = getApp()

Page({
  data: {
    pillars: {},
    dayMaster: '',
    dayMasterWx: '',
    strength: {},
    wuxingCount: {},
    shishen: {},
    naying: {},
    zodiac: '',
    reading: {},
    saved: false
  },
  onLoad(options) {
    if (options.data) {
      const params = JSON.parse(decodeURIComponent(options.data))
      const [y, m, d] = params.birthDate.split('-').map(Number)
      const hourMap = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]
      const hour = hourMap[params.birthHourIndex] || 12
      const result = baziCalc.calculateBazi(y, m, d, hour, params.gender)
      const reading = baziCalc.generateBaziReading(result)
      this.setData({ ...result, reading, params })
    }
  },
  onSave() {
    if (this.data.saved) { wx.showToast({ title: '已保存', icon: 'none' }); return }
    app.addToHistory({ type: '八字排盘', summary: this.data.reading.summary.substring(0, 30) + '...', url: `/package-bazi/pages/input/input` })
    this.setData({ saved: true })
    wx.showToast({ title: '已保存到记录', icon: 'success' })
  },
  onRetry() { wx.navigateBack() }
})
