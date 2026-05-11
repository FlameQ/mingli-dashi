const app = getApp()
const dateUtil = require('../../utils/date-util')
const liuyaoData = require('../../utils/liuyao-data')

Page({
  data: {
    params: {},
    analysis: null,
    saved: false,
    activeTab: 0,
    tabs: ['卦象总览', '六爻详解', '断卦分析']
  },

  onLoad(options) {
    if (!options.data) return
    const params = JSON.parse(decodeURIComponent(options.data))
    this.setData({ params })

    // 获取日干索引用于六神排列
    const now = new Date()
    const dayGZ = dateUtil.getDayGanZhi(now.getFullYear(), now.getMonth() + 1, now.getDate())
    const dayGanIdx = dateUtil.TIANGAN.indexOf(dayGZ[0])

    // 构建六爻数据
    const lines = (params.coinResults || []).map(r => ({
      yang: r.yang,
      isMoving: r.isMoving,
      lineType: r.lineType
    }))

    if (lines.length === 6) {
      const analysis = liuyaoData.analyzeHexagram(lines, dayGanIdx, params.question)
      this.setData({ analysis })
    }
  },

  onTabChange(e) {
    this.setData({ activeTab: Number(e.currentTarget.dataset.idx) })
  },

  onSave() {
    if (this.data.saved) return
    const a = this.data.analysis
    app.addToHistory({
      type: '周易六爻',
      summary: `${a.guaName}卦 · ${this.data.params.method}`,
      url: '/package-liuyao/pages/input/input'
    })
    this.setData({ saved: true })
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  onRetry() { wx.navigateBack() }
})
