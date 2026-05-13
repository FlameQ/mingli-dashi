const app = getApp()

Page({
  data: {
    isUnlocked: false,
    categories: [],
    safeCategories: [
      {
        name: '国学经典',
        desc: '品读中华文化瑰宝',
        modules: [
          { id: 'shici', icon: '诗', title: '诗词赏析', desc: '唐诗宋词元曲品鉴' },
          { id: 'shufa', icon: '书', title: '书法鉴赏', desc: '历代名家书法赏析' },
          { id: 'guqin', icon: '琴', title: '古琴雅韵', desc: '传统古琴音乐欣赏' }
        ]
      },
      {
        name: '传统艺术',
        desc: '传承中华艺术之美',
        modules: [
          { id: 'guohua', icon: '画', title: '国画艺术', desc: '水墨丹青绘画鉴赏' },
          { id: 'qidao', icon: '棋', title: '棋道智慧', desc: '围棋象棋策略智慧' },
          { id: 'hanfu', icon: '服', title: '汉服之美', desc: '传统服饰文化鉴赏' }
        ]
      },
      {
        name: '养生文化',
        desc: '中医养生健康之道',
        modules: [
          { id: 'chadao', icon: '茶', title: '茶道文化', desc: '传统茶艺茶道学习' },
          { id: 'zhongyi', icon: '医', title: '中医养生', desc: '传统中医养生知识' }
        ]
      }
    ],
    expertCategories: [
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
    const isUnlocked = app.globalData.expertMode || false
    this.setData({
      isUnlocked,
      categories: isUnlocked ? this.data.expertCategories : this.data.safeCategories
    })

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  onModuleTap(e) {
    const { url } = e.currentTarget.dataset
    if (!url) {
      wx.showToast({ title: '功能开发中，敬请期待', icon: 'none' })
      return
    }
    wx.navigateTo({ url })
  }
})
