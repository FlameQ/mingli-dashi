const app = getApp()
const GUA_NAMES = ['乾','坤','屯','蒙','需','讼','师','比','小畜','履','泰','否','同人','大有','谦','豫','随','蛊','临','观','噬嗑','贲','剥','复','无妄','大畜','颐','大过','坎','离','咸','恒','遁','大壮','晋','明夷','家人','睽','蹇','解','损','益','夬','姤','萃','升','困','井','革','鼎','震','艮','渐','归妹','丰','旅','巽','兑','涣','节','中孚','小过','既济','未济']

Page({
  data: { params: {}, guaName: '', yaos: [], reading: '', saved: false },
  onLoad(options) {
    if (options.data) {
      const params = JSON.parse(decodeURIComponent(options.data))
      const guaName = GUA_NAMES[Math.floor(Math.random() * 64)]
      const yaos = []
      for (let i = 0; i < 6; i++) {
        const isYang = Math.random() > 0.5
        const isMoving = Math.random() > 0.8
        yaos.push({ line: isYang ? '━━━━━' : '━ ━ ━', type: isYang ? '阳' : '阴', isMoving, position: 6 - i, label: `第${6-i}爻` })
      }
      const movingYao = yaos.find(y => y.isMoving)
      const reading = `${params.method}得卦「${guaName}」，${movingYao ? `${movingYao.label}动，` : ''}卦象显示此事${Math.random()>0.5?'有利可图':'需谨慎行事'}。${params.question ? '建议顺时而动，不可强求。' : ''}`
      this.setData({ params, guaName, yaos, reading })
    }
  },
  onSave() {
    if (this.data.saved) return
    app.addToHistory({ type: '六爻占卦', summary: `卦名：${this.data.guaName}`, url: '/package-liuyao/pages/input/input' })
    this.setData({ saved: true })
    wx.showToast({ title: '已保存', icon: 'success' })
  },
  onRetry() { wx.navigateBack() }
})
