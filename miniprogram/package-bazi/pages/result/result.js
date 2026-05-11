const baziCalc = require('../../../utils/bazi-calculator')
const lunarUtil = require('../../../utils/lunar-util')
const dateUtil = require('../../../utils/date-util')
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
    saved: false,
    shishenDetail: {},
    dizhiRelations: [],
    shensha: [],
    nayingDetail: [],
    changsheng: {},
    liunian: {},
    solarDateStr: '',
    lunarDateStr: '',
    lunarGanzhi: ''
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

    // 计算阳历和农历日期字符串
    const solarDateStr = dateUtil.formatSolarDate ? `${y}年${m}月${d}日` : params.birthDate
    let lunarDateStr = ''
    let lunarGanzhi = ''
    try {
      const lunar = lunarUtil.solarToLunar(y, m, d)
      lunarDateStr = lunarUtil.formatLunarDate(lunar.lunarY, lunar.lunarM, lunar.lunarD, lunar.isLeapMonth)
      lunarGanzhi = lunarUtil.getLunarYearGanZhi(lunar.lunarY)
    } catch (e) {
      lunarDateStr = '计算失败'
    }
    // 如果用户输入了农历日期，优先使用
    if (params.calendarType === 'lunar' && params.lunarDateStr) {
      lunarDateStr = params.lunarDateStr
    }

    // 转换十神统计为可遍历数组
    const shishenCountArr = result.shishenDetail && result.shishenDetail.count
      ? Object.entries(result.shishenDetail.count).map(([key, value]) => ({ key, value }))
      : []

    this.setData({
      loaded: true,
      name: params.name || '',
      pillars: result.pillars,
      dayMaster: result.dayMaster,
      dayMasterWx: result.dayMasterWx,
      strength: result.strength,
      wuxingCount: result.wuxingCount,
      fullShishen: result.fullShishen,
      naying: result.naying,
      zodiac: result.zodiac,
      xiyong: result.xiyong,
      geju: result.geju,
      personality: result.personality,
      lifeDomains: result.lifeDomains,
      luckyElements: result.luckyElements,
      dayunList: result.dayunList,
      reading: result.reading,
      shishenDetail: {
        details: result.shishenDetail ? result.shishenDetail.details : [],
        count: shishenCountArr
      },
      dizhiRelations: result.dizhiRelations || [],
      shensha: result.shensha || [],
      nayingDetail: result.nayingDetail || [],
      changsheng: result.changsheng || {},
      liunian: result.liunian || {},
      solarDateStr,
      lunarDateStr,
      lunarGanzhi,
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
