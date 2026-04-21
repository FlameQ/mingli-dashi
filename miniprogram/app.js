App({
  onLaunch() {
    const history = wx.getStorageSync('history') || []
    this.globalData.history = history

    const settings = wx.getStorageSync('settings') || { theme: 'warm' }
    this.globalData.settings = settings
  },

  globalData: {
    userInfo: null,
    history: [],
    settings: {}
  },

  addToHistory(record) {
    const item = {
      id: this.generateId(),
      timestamp: Date.now(),
      date: this.formatTime(new Date()),
      ...record
    }
    this.globalData.history.unshift(item)
    if (this.globalData.history.length > 100) {
      this.globalData.history = this.globalData.history.slice(0, 100)
    }
    wx.setStorageSync('history', this.globalData.history)
    return item.id
  },

  getHistory() {
    return this.globalData.history
  },

  clearHistory() {
    this.globalData.history = []
    wx.removeStorageSync('history')
  },

  removeFromHistory(id) {
    this.globalData.history = this.globalData.history.filter(item => item.id !== id)
    wx.setStorageSync('history', this.globalData.history)
  },

  generateId() {
    return 'r_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6)
  },

  formatTime(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  }
})
