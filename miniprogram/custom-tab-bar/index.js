Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/home/home', text: '首页', icon: '首' },
      { pagePath: '/pages/category/category', text: '分类', icon: '类' },
      { pagePath: '/pages/history/history', text: '记录', icon: '录' },
      { pagePath: '/pages/profile/profile', text: '我的', icon: '我' }
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
