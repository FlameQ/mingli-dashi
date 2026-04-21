Page({
  data: {
    masters: [
      {id:'huineng',name:'慧能',school:'禅宗',desc:'顿悟成佛',icon:'🧘'},
      {id:'yinguang',name:'印光',school:'净土宗',desc:'念佛往生',icon:'🙏'},
      {id:'xuyun',name:'虚云',school:'禅宗',desc:'苦修实证',icon:'🏔️'},
      {id:'xuanzang',name:'玄奘',school:'唯识宗',desc:'万法唯识',icon:'📚'},
      {id:'fazang',name:'法藏',school:'华严宗',desc:'一即一切',icon:'💎'},
      {id:'kumarajiva',name:'鸠摩罗什',school:'三论宗',desc:'中观般若',icon:'🔮'},
      {id:'zhiyi',name:'智顗',school:'天台宗',desc:'一心三观',icon:'🌌'},
      {id:'ouyi',name:'藕益',school:'净土宗',desc:'教宗天台',icon:'🌸'}
    ],
    selectedMaster: '',
    question: ''
  },
  onSelectMaster(e) { this.setData({ selectedMaster: e.currentTarget.dataset.id }) },
  onQuestionInput(e) { this.setData({ question: e.detail.value }) },
  onSubmit() {
    const { selectedMaster, question } = this.data
    if (!selectedMaster) { wx.showToast({ title: '请选择一位大师', icon: 'none' }); return }
    if (!question.trim()) { wx.showToast({ title: '请输入您的问题', icon: 'none' }); return }
    const params = encodeURIComponent(JSON.stringify({ masterId: selectedMaster, question }))
    wx.navigateTo({ url: `/package-buddhism/pages/result/result?data=${params}` })
  }
})
