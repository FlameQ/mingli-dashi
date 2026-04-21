const app = getApp()

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    historyCount: 0,
    menuList: [
      { id: 'info', icon: '👤', title: '个人信息', desc: '设置你的出生信息' },
      { id: 'coin', icon: '🪙', title: '算命币', desc: '充值管理', badge: 'HOT' },
      { id: 'feedback', icon: '💬', title: '意见反馈', desc: '帮助我们做得更好' },
      { id: 'about', icon: '📖', title: '关于我们', desc: '了解命理大师' },
      { id: 'cache', icon: '🗑️', title: '清除缓存', desc: '清理本地数据' }
    ]
  },

  onShow() {
    const history = app.getHistory()
    this.setData({ historyCount: history.length })

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  onGetUserInfo() {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo
      }
    })
  },

  onMenuTap(e) {
    const { id } = e.currentTarget.dataset
    switch (id) {
      case 'info':
        wx.showToast({ title: '功能开发中', icon: 'none' })
        break
      case 'coin':
        wx.showToast({ title: '功能开发中', icon: 'none' })
        break
      case 'feedback':
        wx.showToast({ title: '感谢您的关注', icon: 'none' })
        break
      case 'about':
        wx.showModal({
          title: '关于命理大师',
          content: '命理大师 v1.0.0\n\n集成八字排盘、奇门遁甲、紫微斗数、月老姻缘、塔罗占卜、六爻占卦、易经风水、佛学大师八大模块。\n\n仅供娱乐参考，不作为人生决策依据。',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#AA2116'
        })
        break
      case 'cache':
        wx.showModal({
          title: '清除缓存',
          content: '确定要清除所有本地缓存数据吗？',
          confirmColor: '#AA2116',
          success: (res) => {
            if (res.confirm) {
              wx.clearStorageSync()
              app.globalData.history = []
              this.setData({ historyCount: 0 })
              wx.showToast({ title: '已清除', icon: 'success' })
            }
          }
        })
        break
    }
  }
})
