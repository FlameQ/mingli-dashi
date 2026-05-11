Page({
  data: {
    categories: [
      {
        name: '传统历法',
        desc: '探索四柱八字奥秘',
        modules: [
          { id: 'bazi', icon: '历', title: '四柱八字', desc: '传统干支历法分析', url: '/package-bazi/pages/input/input' },
          { id: 'qimen', icon: '奇', title: '奇门探秘', desc: '古代兵法策略智慧', url: '/package-qimen/pages/input/input' },
          { id: 'ziwei', icon: '星', title: '紫微星象', desc: '传统星象文化研究', url: '/package-ziwei/pages/input/input' }
        ]
      },
      {
        name: '经典研读',
        desc: '品读中西经典文化',
        modules: [
          { id: 'tarot', icon: '牌', title: '塔罗牌义', desc: '西方塔罗符号解读', url: '/package-tarot/pages/select/select' },
          { id: 'liuyao', icon: '爻', title: '周易六爻', desc: '易经六爻哲学学习', url: '/package-liuyao/pages/input/input' }
        ]
      },
      {
        name: '传统文化',
        desc: '传承中华文明智慧',
        modules: [
          { id: 'fengshui', icon: '易', title: '易经智慧', desc: '周易哲学思想学习', url: '/package-fengshui/pages/input/input' },
          { id: 'yinyuan', icon: '缘', title: '传统婚俗', desc: '中华传统婚姻文化', url: '/package-yinyuan/pages/input/input' }
        ]
      },
      {
        name: '修心养性',
        desc: '启迪人生智慧',
        modules: [
          { id: 'buddhism', icon: '禅', title: '禅修心语', desc: '禅宗智慧与冥想', url: '/package-buddhism/pages/chat/chat' }
        ]
      }
    ]
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  onModuleTap(e) {
    const { url } = e.currentTarget.dataset
    wx.navigateTo({ url })
  }
})
