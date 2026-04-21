const app = getApp()

Page({
  data: {
    profiles: [],
    activeProfileId: '',
    historyCount: 0,
    menuList: [
      { id: 'feedback', icon: '信', title: '意见反馈', desc: '帮助我们做得更好' },
      { id: 'about', icon: '识', title: '关于我们', desc: '了解命理大师' },
      { id: 'cache', icon: '清', title: '清除缓存', desc: '清理本地数据' }
    ]
  },

  onShow() {
    this.loadProfiles()
    const history = app.getHistory()
    this.setData({ historyCount: history.length })

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

  onMenuTap(e) {
    const { id } = e.currentTarget.dataset
    switch (id) {
      case 'feedback':
        wx.showToast({ title: '感谢您的关注', icon: 'none' })
        break
      case 'about':
        wx.showModal({
          title: '关于命理大师',
          content: '命理大师 v1.0.0\n\n集成八字排盘、奇门遁甲、紫微斗数、月老姻缘、塔罗占卜、六爻占卦、易经风水、佛学大师八大模块。\n\n仅供娱乐参考，不作为人生决策依据。',
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
