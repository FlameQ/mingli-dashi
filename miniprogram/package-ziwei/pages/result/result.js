const app = getApp()
const PALACES = ['命宫','兄弟宫','夫妻宫','子女宫','财帛宫','疾厄宫','迁移宫','交友宫','事业宫','田宅宫','福德宫','父母宫']
const MAIN_STARS = ['紫微','天机','太阳','武曲','天同','廉贞','天府','太阴','贪狼','巨门','天相','天梁','七杀','破军']
const SIHUA = ['化禄','化权','化科','化忌']

Page({
  data: { mingGong: '', palaces: [], keyReadings: [], saved: false },
  onLoad(options) {
    if (options.data) {
      const params = JSON.parse(decodeURIComponent(options.data))
      const palaces = PALACES.map((name, i) => {
        const starCount = 1 + Math.floor(Math.random() * 3)
        const stars = []
        for (let s = 0; s < starCount; s++) {
          stars.push(MAIN_STARS[Math.floor(Math.random() * MAIN_STARS.length)])
        }
        return { name, stars: [...new Set(stars)], position: i }
      })
      const keyReadings = [
        { palace: '命宫', desc: '命宫主星为' + palaces[0].stars.join('、') + '，性格坚毅，具有领导才能，适合从事管理工作。' },
        { palace: '事业宫', desc: '事业宫主星为' + palaces[8].stars.join('、') + '，事业方向明晰，中年后有较大发展空间。' },
        { palace: '财帛宫', desc: '财帛宫主星为' + palaces[4].stars.join('、') + '，财运平稳，理财宜保守。' },
        { palace: '夫妻宫', desc: '夫妻宫主星为' + palaces[2].stars.join('、') + '，感情方面需要耐心经营。' }
      ]
      this.setData({ params, palaces, keyReadings, mingGong: palaces[0].stars.join('、') })
    }
  },
  onSave() {
    if (this.data.saved) return
    app.addToHistory({ type: '紫微斗数', summary: `命宫：${this.data.mingGong}`, url: '/package-ziwei/pages/input/input' })
    this.setData({ saved: true })
    wx.showToast({ title: '已保存', icon: 'success' })
  },
  onRetry() { wx.navigateBack() }
})
