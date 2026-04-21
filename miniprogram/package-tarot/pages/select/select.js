Page({
  data: {
    spreads: [{id:'single',name:'单牌',count:1,desc:'一言中的，快速指引'},{id:'three',name:'三牌时间线',count:3,desc:'过去·现在·未来'},{id:'celtic',name:'凯尔特十字',count:10,desc:'全方位深度解读'}],
    selectedSpread: 'three',
    question: ''
  },
  onSelectSpread(e) { this.setData({ selectedSpread: e.currentTarget.dataset.id }) },
  onQuestionInput(e) { this.setData({ question: e.detail.value }) },
  onSubmit() {
    const { selectedSpread, question } = this.data
    if (!question.trim()) { wx.showToast({ title: '请输入您的疑问', icon: 'none' }); return }
    const params = encodeURIComponent(JSON.stringify({ spread: selectedSpread, question }))
    wx.navigateTo({ url: `/package-tarot/pages/reading/reading?data=${params}` })
  }
})
