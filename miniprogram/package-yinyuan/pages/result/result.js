const app = getApp()
Page({
  data: { params: {}, score: 0, reading: '', advice: '', saved: false },
  onLoad(options) {
    if (options.data) {
      const params = JSON.parse(decodeURIComponent(options.data))
      const score = 70 + Math.floor(Math.random() * 28)
      const readings = [
        `你们之间有${score}%的缘分指数！月老红线相连，彼此间有着深厚的缘分基础。双方在价值观和生活方式上有较高的契合度。`,
        `缘分天注定，你们的匹配度为${score}%。前世五百次的回眸才换来今生的相遇，珍惜眼前人。`
      ]
      const advice = score > 85 ? '感情运势良好，建议多沟通、多理解，共同经营这段缘分。' : '缘分需要双方共同培养，保持真诚与耐心，静待花开。'
      this.setData({ params, score, reading: readings[Math.floor(Math.random()*readings.length)], advice })
    }
  },
  onSave() {
    if (this.data.saved) return
    app.addToHistory({ type: '月老姻缘', summary: `缘分指数${this.data.score}%`, url: '/package-yinyuan/pages/input/input' })
    this.setData({ saved: true })
    wx.showToast({ title: '已保存', icon: 'success' })
  },
  onRetry() { wx.navigateBack() }
})
