Page({
  data: { methods: ['时间起卦','数字起卦','硬币起卦'], selectedMethod: 0, question: '', numbers: [0,0,0], coinStep: 0, coinResults: [] },
  onMethodChange(e) { this.setData({ selectedMethod: Number(e.detail.value) }) },
  onQuestionInput(e) { this.setData({ question: e.detail.value }) },
  onNumberInput(e) { const idx = e.currentTarget.dataset.idx; const nums = this.data.numbers.slice(); nums[idx] = Number(e.detail.value); this.setData({ numbers: nums }) },
  onCoinFlip() {
    const results = []; for (let i = 0; i < 3; i++) results.push(Math.random() > 0.5 ? '正' : '反')
    const step = this.data.coinStep
    const coinResults = this.data.coinResults.concat([{ step: step + 1, results, value: results.filter(r=>r==='正').length }])
    this.setData({ coinStep: step + 1, coinResults })
  },
  onSubmit() {
    const { selectedMethod, question, numbers, coinResults } = this.data
    if (!question.trim()) { wx.showToast({ title: '请输入问题', icon: 'none' }); return }
    if (selectedMethod === 1 && numbers.some(n => n <= 0 || n > 999)) { wx.showToast({ title: '请输入1-999的数字', icon: 'none' }); return }
    if (selectedMethod === 2 && coinResults.length < 6) { wx.showToast({ title: '请完成6次投掷', icon: 'none' }); return }
    const params = encodeURIComponent(JSON.stringify({ method: this.data.methods[selectedMethod], question, numbers, coinResults }))
    wx.navigateTo({ url: `/package-liuyao/pages/result/result?data=${params}` })
  }
})
