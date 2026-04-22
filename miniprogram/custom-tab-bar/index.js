Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/home/home', text: '首页', icon: 'home' },
      { pagePath: '/pages/category/category', text: '分类', icon: 'category' },
      { pagePath: '/pages/history/history', text: '记录', icon: 'history' },
      { pagePath: '/pages/profile/profile', text: '我的', icon: 'profile' }
    ]
  },

  methods: {
    switchTab(e) {
      const { index, path } = e.currentTarget.dataset
      this.setData({ selected: index })
      wx.switchTab({ url: path })
    }
  }
})
