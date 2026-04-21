Page({
  data: {
    categories: [
      {
        name: '命理推算',
        desc: '探知先天命格',
        modules: [
          { id: 'bazi', icon: '🎴', title: '八字排盘', desc: '四柱八字命理分析', url: '/package-bazi/pages/input/input', color: '#AA2116' },
          { id: 'qimen', icon: '🧭', title: '奇门遁甲', desc: '时家转盘奇门预测', url: '/package-qimen/pages/input/input', color: '#D4A017' },
          { id: 'ziwei', icon: '⭐', title: '紫微斗数', desc: '十二宫命盘详批', url: '/package-ziwei/pages/input/input', color: '#C93756' }
        ]
      },
      {
        name: '占卜问事',
        desc: '指引迷津方向',
        modules: [
          { id: 'tarot', icon: '🔮', title: '塔罗占卜', desc: '西方塔罗牌阵解读', url: '/package-tarot/pages/select/select', color: '#7B68AE' },
          { id: 'liuyao', icon: '☯️', title: '六爻占卦', desc: '周易六爻梅花易数', url: '/package-liuyao/pages/input/input', color: '#B36D61' }
        ]
      },
      {
        name: '生活风水',
        desc: '改善环境气场',
        modules: [
          { id: 'fengshui', icon: '🏠', title: '易经风水', desc: '阳宅办公室风水分析', url: '/package-fengshui/pages/input/input', color: '#6B9E3C' },
          { id: 'yinyuan', icon: '💕', title: '月老姻缘', desc: '八字合婚桃花运势', url: '/package-yinyuan/pages/input/input', color: '#F07050' }
        ]
      },
      {
        name: '修心养性',
        desc: '启迪人生智慧',
        modules: [
          { id: 'buddhism', icon: '🙏', title: '佛学大师', desc: '八位高僧智慧开示', url: '/package-buddhism/pages/chat/chat', color: '#D4A017' }
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
