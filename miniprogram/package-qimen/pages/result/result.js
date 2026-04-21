const app = getApp()
const STARS = ['天蓬','天任','天冲','天辅','天英','天芮','天柱','天心','天禽']
const DOORS = ['休门','生门','伤门','杜门','景门','死门','惊门','开门','中门']
const GODS = ['值符','腾蛇','太阴','六合','白虎','玄武','九地','九天','']
const STEMS = ['戊','己','庚','辛','壬','癸','丁','丙','乙']

Page({
  data: { params: {}, dunType: '', juNumber: 0, palaces: [], reading: '', saved: false },
  onLoad(options) {
    if (options.data) {
      const params = JSON.parse(decodeURIComponent(options.data))
      const isYang = Math.random() > 0.5
      const juNumber = Math.floor(Math.random() * 9) + 1
      const palaces = []
      const positions = ['坎(北)','坤(西南)','震(东)','巽(东南)','中宫','乾(西北)','兑(西)','艮(东北)','离(南)']
      for (let i = 0; i < 9; i++) {
        palaces.push({ position: positions[i], skyStem: STEMS[Math.floor(Math.random()*9)], earthStem: STEMS[Math.floor(Math.random()*9)], star: STARS[i], door: DOORS[i], god: GODS[Math.floor(Math.random()*8)] })
      }
      const readings = [
        `此局${isYang?'阳':'阴'}遁${juNumber}局，${params.type}方面：用神居于${palaces[0].position}，${palaces[0].star}临${palaces[0].door}，主事有转机。建议把握${isYang?'东':'西'}方方位的机遇，行事宜稳重。`,
        `时家转盘${isYang?'阳':'阴'}遁${juNumber}局。${params.type}问事，天盘${palaces[1].skyStem}加地盘${palaces[1].earthStem}，格局尚可。${palaces[1].door}司权，宜顺势而为。`
      ]
      this.setData({ params, dunType: isYang?'阳遁':'阴遁', juNumber, palaces, reading: readings[Math.floor(Math.random()*readings.length)] })
    }
  },
  onSave() {
    if (this.data.saved) return
    app.addToHistory({ type: '奇门遁甲', summary: `${this.data.dunType}${this.data.juNumber}局`, url: '/package-qimen/pages/input/input' })
    this.setData({ saved: true })
    wx.showToast({ title: '已保存', icon: 'success' })
  },
  onRetry() { wx.navigateBack() }
})
