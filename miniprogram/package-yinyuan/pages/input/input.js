const app = getApp()

Page({
  data: {
    modes: [
      {name:'八字合婚',icon:'💕',desc:'双方八字配对分析'},
      {name:'生肖配对',icon:'🧧',desc:'十二生肖缘分测试'},
      {name:'桃花文化',icon:'🌸',desc:'了解传统桃花文化'},
      {name:'红线测算',icon:'❤️',desc:'缘分指数测算'}
    ],
    selectedMode: '',
    myBirthDate: '2000-01-01',
    partnerBirthDate: '2000-01-01',
    showPartner: false,
    profileLoaded: false
  },

  onShow() {
    this.loadProfile()
  },

  loadProfile() {
    if (this.data.profileLoaded) return
    const profile = app.getActiveProfile()
    if (profile && profile.birthDate) {
      this.setData({
        myBirthDate: profile.birthDate,
        profileLoaded: true
      })
    }
  },

  onSelectMode(e) {
    const mode = e.currentTarget.dataset.name
    this.setData({ selectedMode: mode, showPartner: mode === '八字合婚' || mode === '生肖配对' })
  },
  onMyDateChange(e) { this.setData({ myBirthDate: e.detail.value }) },
  onPartnerDateChange(e) { this.setData({ partnerBirthDate: e.detail.value }) },
  onSubmit() {
    const { selectedMode, myBirthDate, partnerBirthDate } = this.data
    if (!selectedMode) { wx.showToast({ title: '请选择测算方式', icon: 'none' }); return }
    const params = encodeURIComponent(JSON.stringify({ mode: selectedMode, myBirthDate, partnerBirthDate }))
    wx.navigateTo({ url: `/package-yinyuan/pages/result/result?data=${params}` })
  }
})
