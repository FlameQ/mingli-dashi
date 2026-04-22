Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/home/home', text: '首页', icon: '⌂' },
      { pagePath: '/pages/category/category', text: '分类', icon: '⊞' },
      { pagePath: '/pages/history/history', text: '记录', icon: '▥' },
      { pagePath: '/pages/profile/profile', text: '我的', icon: '◎' }
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
