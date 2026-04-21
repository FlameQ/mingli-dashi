Page({
  data: {
    types: [{name:'事业',icon:'💼'},{name:'财运',icon:'💰'},{name:'感情',icon:'💕'},{name:'健康',icon:'🏥'},{name:'其他',icon:'❓'}],
    selectedType: '事业',
    questionGoal: '',
    queryTime: '',
    city: ''
  },
  onLoad() {
    const now = new Date()
    this.setData({ queryTime: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}` })
  },
  onSelectType(e) { this.setData({ selectedType: e.currentTarget.dataset.name }) },
  onGoalInput(e) { this.setData({ questionGoal: e.detail.value }) },
  onTimeChange(e) { this.setData({ queryTime: e.detail.value }) },
  onCityInput(e) { this.setData({ city: e.detail.value }) },
  onSubmit() {
    const { selectedType, questionGoal, queryTime, city } = this.data
    if (!questionGoal.trim()) { wx.showToast({ title: '请输入您的疑问', icon: 'none' }); return }
    const params = encodeURIComponent(JSON.stringify({ type: selectedType, goal: questionGoal, time: queryTime, city }))
    wx.navigateTo({ url: `/package-qimen/pages/result/result?data=${params}` })
  }
})
