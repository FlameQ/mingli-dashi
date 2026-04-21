const app = getApp()
Page({
  data: { params: {}, flyingStars: [], luckyDirs: [], unluckyDirs: [], shaQiChecks: [], advice: '', saved: false },
  onLoad(options) {
    if (options.data) {
      const params = JSON.parse(decodeURIComponent(options.data))
      const positions = ['北','西南','东','东南','中','西北','西','东北','南']
      const flyingStars = positions.map(p => ({ position: p, star: Math.floor(Math.random() * 9) + 1 }))
      const luckyNames = ['生气','天医','延年','伏位']
      const unluckyNames = ['绝命','五鬼','六煞','祸害']
      const luckyDirs = luckyNames.map((name, i) => ({ name, direction: positions[(Math.floor(Math.random() * 9))] }))
      const unluckyDirs = unluckyNames.map((name, i) => ({ name, direction: positions[(Math.floor(Math.random() * 9))] }))
      const shaQiChecks = params.areas.map(area => ({ area, status: Math.random() > 0.3 ? '良好' : '需注意', desc: Math.random() > 0.3 ? '布局合理，气场流通' : '建议调整布局以改善气场流通' }))
      const advice = `${params.type}坐${params.facing}朝向，当前为下元九运(2024-2043)。整体风水格局${Math.random()>0.5?'较为理想':'尚需调整'}。建议在${params.facing}方位放置风水摆件以增旺气场，保持室内通风采光充足。`
      this.setData({ params, flyingStars, luckyDirs, unluckyDirs, shaQiChecks, advice })
    }
  },
  onSave() {
    if (this.data.saved) return
    app.addToHistory({ type: '易经风水', summary: `${this.data.params.type}·${this.data.params.facing}向`, url: '/package-fengshui/pages/input/input' })
    this.setData({ saved: true })
    wx.showToast({ title: '已保存', icon: 'success' })
  },
  onRetry() { wx.navigateBack() }
})
