App({
  onLaunch() {
    const profiles = wx.getStorageSync('profiles') || []
    const activeProfileId = wx.getStorageSync('activeProfileId') || ''
    const history = wx.getStorageSync('history') || []
    const expertMode = wx.getStorageSync('expertMode') || false
    this.globalData.profiles = profiles
    this.globalData.activeProfileId = activeProfileId
    this.globalData.history = history
    this.globalData.expertMode = expertMode
  },

  globalData: {
    userInfo: null,
    profiles: [],
    activeProfileId: '',
    history: [],
    settings: {},
    expertMode: false
  },

  // Profile CRUD
  getProfiles() {
    return this.globalData.profiles
  },

  getActiveProfile() {
    return this.globalData.profiles.find(p => p.id === this.globalData.activeProfileId) || null
  },

  addProfile(profile) {
    const id = 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6)
    const item = {
      id,
      name: profile.name || '',
      gender: profile.gender || '男',
      birthDate: profile.birthDate || '',
      birthHourIndex: profile.birthHourIndex != null ? profile.birthHourIndex : 6,
      birthPlace: profile.birthPlace || '',
      zodiac: '',
      createdAt: Date.now()
    }
    // Calculate zodiac from birthDate
    if (item.birthDate) {
      const year = parseInt(item.birthDate.split('-')[0])
      if (year) {
        const shengxiao = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
        item.zodiac = shengxiao[(year - 4) % 12]
      }
    }
    this.globalData.profiles.push(item)
    if (this.globalData.profiles.length === 1) {
      this.globalData.activeProfileId = id
      wx.setStorageSync('activeProfileId', id)
    }
    wx.setStorageSync('profiles', this.globalData.profiles)
    return item
  },

  updateProfile(id, updates) {
    const idx = this.globalData.profiles.findIndex(p => p.id === id)
    if (idx === -1) return false
    Object.assign(this.globalData.profiles[idx], updates)
    // Recalculate zodiac
    if (updates.birthDate) {
      const year = parseInt(updates.birthDate.split('-')[0])
      if (year) {
        const shengxiao = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
        this.globalData.profiles[idx].zodiac = shengxiao[(year - 4) % 12]
      }
    }
    wx.setStorageSync('profiles', this.globalData.profiles)
    return true
  },

  deleteProfile(id) {
    this.globalData.profiles = this.globalData.profiles.filter(p => p.id !== id)
    if (this.globalData.activeProfileId === id) {
      this.globalData.activeProfileId = this.globalData.profiles.length > 0 ? this.globalData.profiles[0].id : ''
      wx.setStorageSync('activeProfileId', this.globalData.activeProfileId)
    }
    wx.setStorageSync('profiles', this.globalData.profiles)
  },

  setActiveProfile(id) {
    this.globalData.activeProfileId = id
    wx.setStorageSync('activeProfileId', id)
  },

  // History
  addToHistory(record) {
    const item = {
      id: 'r_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6),
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

  getHistory() { return this.globalData.history },
  clearHistory() { this.globalData.history = []; wx.removeStorageSync('history') },
  removeFromHistory(id) {
    this.globalData.history = this.globalData.history.filter(item => item.id !== id)
    wx.setStorageSync('history', this.globalData.history)
  },

  formatTime(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const h = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${min}`
  }
})
