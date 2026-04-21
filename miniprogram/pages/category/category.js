Page({
  data: {
    categories: [
      {
        name: '命理推算',
        desc: '探知先天命格',
        modules: [
          { id: 'bazi', icon: '卜', title: '八字排盘', desc: '四柱八字命理分析', url: '/package-bazi/pages/input/input' },
          { id: 'qimen', icon: '遁', title: '奇门遁甲', desc: '时家转盘奇门预测', url: '/package-qimen/pages/input/input' },
          { id: 'ziwei', icon: '星', title: '紫微斗数', desc: '十二宫命盘详批', url: '/package-ziwei/pages/input/input' }
        ]
      },
      {
        name: '占卜问事',
        desc: '指引迷津方向',
        modules: [
          { id: 'tarot', icon: '牌', title: '塔罗占卜', desc: '西方塔罗牌阵解读', url: '/package-tarot/pages/select/select' },
          { id: 'liuyao', icon: '卦', title: '六爻占卦', desc: '周易六爻梅花易数', url: '/package-liuyao/pages/input/input' }
        ]
      },
      {
        name: '生活风水',
        desc: '改善环境气场',
        modules: [
          { id: 'fengshui', icon: '风', title: '易经风水', desc: '阳宅办公室风水分析', url: '/package-fengshui/pages/input/input' },
          { id: 'yinyuan', icon: '缘', title: '月老姻缘', desc: '八字合婚桃花运势', url: '/package-yinyuan/pages/input/input' }
        ]
      },
      {
        name: '修心养性',
        desc: '启迪人生智慧',
        modules: [
          { id: 'buddhism', icon: '禅', title: '佛学大师', desc: '八位高僧智慧开示', url: '/package-buddhism/pages/chat/chat' }
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
