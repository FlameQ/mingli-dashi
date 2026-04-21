const app = getApp()
const MAJOR_ARCANA = ['愚者','魔术师','女祭司','皇后','皇帝','教皇','恋人','战车','力量','隐者','命运之轮','正义','吊人','死神','节制','恶魔','塔','星星','月亮','太阳','审判','世界']
const POSITIONS = { single: ['指引'], three: ['过去','现在','未来'], celtic: ['现状','障碍','基础','过去','目标','未来','自我','环境','希望','结果'] }

Page({
  data: { params: {}, cards: [], reading: '', saved: false },
  onLoad(options) {
    if (options.data) {
      const params = JSON.parse(decodeURIComponent(options.data))
      const count = params.spread === 'single' ? 1 : params.spread === 'three' ? 3 : 10
      const positions = POSITIONS[params.spread]
      const cards = []
      const used = new Set()
      for (let i = 0; i < count; i++) {
        let idx
        do { idx = Math.floor(Math.random() * 22) } while (used.has(idx))
        used.add(idx)
        cards.push({ name: MAJOR_ARCANA[idx], position: positions[i], isReversed: Math.random() > 0.6 })
      }
      const reading = `塔罗牌为你揭示的指引：${cards.map(c => `${c.position}的「${c.name}」(${c.isReversed?'逆位':'正位'})`).join('，')}。综合来看，${params.question ? '关于你的疑问，' : ''}当前局势正处于变化之中。建议保持开放的心态，倾听内心的声音，未来会在适当的时候给你答案。`
      this.setData({ params, cards, reading })
    }
  },
  onSave() {
    if (this.data.saved) return
    app.addToHistory({ type: '塔罗占卜', summary: this.data.cards.map(c => c.name).join('·'), url: '/package-tarot/pages/select/select' })
    this.setData({ saved: true })
    wx.showToast({ title: '已保存', icon: 'success' })
  },
  onRetry() { wx.navigateBack() }
})
