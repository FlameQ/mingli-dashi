const app = getApp()

Page({
  data: {
    profiles: [],
    activeProfileId: '',
    historyCount: 0,
    versionTapCount: 0,
    isUnlocked: false,
    menuList: [
      { id: 'feedback', icon: '信', title: '意见反馈', desc: '帮助我们做得更好' },
      { id: 'about', icon: '识', title: '关于我们', desc: '了解国学智慧' },
      { id: 'cache', icon: '清', title: '清除缓存', desc: '清理本地数据' }
    ]
  },

  onShow() {
    this.loadProfiles()
    const history = app.getHistory()
    const isUnlocked = app.globalData.expertMode || false
    this.setData({ historyCount: history.length, isUnlocked })

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  loadProfiles() {
    const profiles = app.getProfiles()
    const activeProfileId = app.globalData.activeProfileId
    this.setData({ profiles, activeProfileId })
  },

  onAddProfile() {
    wx.navigateTo({ url: '/pages/profile-edit/profile-edit' })
  },

  onEditProfile(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: '/pages/profile-edit/profile-edit?id=' + id })
  },

  onSetActive(e) {
    const { id } = e.currentTarget.dataset
    app.setActiveProfile(id)
    this.setData({ activeProfileId: id })
    wx.showToast({ title: '已切换', icon: 'success' })
  },

  onDeleteProfile(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定要删除此档案吗？',
      confirmColor: '#88ADA6',
      success: (res) => {
        if (res.confirm) {
          app.deleteProfile(id)
          this.loadProfiles()
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },

  onVersionTap() {
    const now = Date.now()
    if (!this._lastTapTime || now - this._lastTapTime > 3000) {
      this._tapCount = 1
    } else {
      this._tapCount = (this._tapCount || 0) + 1
    }
    this._lastTapTime = now

    if (this._tapCount >= 5) {
      this._tapCount = 0
      const newMode = !app.globalData.expertMode
      app.globalData.expertMode = newMode
      wx.setStorageSync('expertMode', newMode)
      this.setData({ isUnlocked: newMode })
      wx.showToast({
        title: newMode ? '专业模式已开启' : '已恢复基础模式',
        icon: 'none',
        duration: 1500
      })
    }
  },

  onMenuTap(e) {
    const { id } = e.currentTarget.dataset
    switch (id) {
      case 'feedback':
        wx.showToast({ title: '感谢您的关注', icon: 'none' })
        break
      case 'about':
        wx.showModal({
          title: '关于国学智慧',
          content: '国学智慧 v1.0.0\n\n集成四柱八字、奇门探秘、紫微星象、传统婚俗、塔罗牌义、周易六爻、易经智慧、禅修心语八大国学模块。\n\n弘扬中华传统文化，传承国学经典智慧。',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#88ADA6'
        })
        break
      case 'cache':
        wx.showModal({
          title: '清除缓存',
          content: '确定要清除所有本地缓存数据吗？',
          confirmColor: '#88ADA6',
          success: (res) => {
            if (res.confirm) {
              wx.clearStorageSync()
              app.globalData.history = []
              app.globalData.profiles = []
              app.globalData.activeProfileId = ''
              this.setData({ historyCount: 0, profiles: [], activeProfileId: '' })
              wx.showToast({ title: '已清除', icon: 'success' })
            }
          }
        })
        break
    }
  }
})
