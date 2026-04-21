const app = getApp()

Page({
  data: {
    history: [],
    isEmpty: false
  },

  onShow() {
    this.loadHistory()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  loadHistory() {
    const history = app.getHistory()
    this.setData({
      history: this.groupByDate(history),
      isEmpty: history.length === 0
    })
  },

  groupByDate(history) {
    const groups = {}
    history.forEach(item => {
      const date = item.date ? item.date.split(' ')[0] : '未知日期'
      if (!groups[date]) groups[date] = []
      groups[date].push(item)
    })
    return Object.entries(groups).map(([date, items]) => ({ date, items }))
  },

  onDeleteItem(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      confirmColor: '#88ADA6',
      success: (res) => {
        if (res.confirm) {
          app.removeFromHistory(id)
          this.loadHistory()
        }
      }
    })
  },

  onClearAll() {
    if (this.data.isEmpty) return
    wx.showModal({
      title: '清空记录',
      content: '确定要清空所有占卜记录吗？此操作不可恢复。',
      confirmColor: '#88ADA6',
      success: (res) => {
        if (res.confirm) {
          app.clearHistory()
          this.setData({ history: [], isEmpty: true })
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  },

  onViewDetail(e) {
    const { item } = e.currentTarget.dataset
    if (item.url) {
      wx.navigateTo({ url: item.url })
    }
  }
})
