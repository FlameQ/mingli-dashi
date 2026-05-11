const dateUtil = require('../../utils/date-util')

Page({
  data: {
    selectedMethod: 0,
    methods: [
      { id: 'coin', name: '铜钱演卦', icon: '◉', desc: '三铜钱演六爻' },
      { id: 'time', name: '时间演卦', icon: '◷', desc: '依此时辰演卦' },
      { id: 'number', name: '数字演卦', icon: '#', desc: '输入三个数字' }
    ],
    question: '',
    numbers: [0, 0, 0],
    // 铜钱演卦
    coinStep: 0,
    coinResults: [],
    coins: [0, 0, 0],
    isFlipping: false,
    showCoinArea: false,
    // 时间演卦
    timeInfo: '',
    // 数字演卦
    numberError: ''
  },

  onQuestionInput(e) { this.setData({ question: e.detail.value }) },

  onSelectMethod(e) {
    const idx = Number(e.currentTarget.dataset.idx)
    this.setData({ selectedMethod: idx, showCoinArea: idx === 0, coinStep: 0, coinResults: [], coins: [0, 0, 0], numberError: '' })
    if (idx === 1) this.generateTimeInfo()
  },

  generateTimeInfo() {
    const now = new Date()
    const shichen = dateUtil.getShichenName(now.getHours())
    const dayGZ = dateUtil.getDayGanZhi(now.getFullYear(), now.getMonth() + 1, now.getDate())
    this.setData({ timeInfo: `${now.getMonth() + 1}月${now.getDate()}日 ${shichen}（${dayGZ}日）` })
  },

  onNumberInput(e) {
    const idx = e.currentTarget.dataset.idx
    const nums = this.data.numbers.slice()
    nums[idx] = Number(e.detail.value)
    this.setData({ numbers: nums, numberError: '' })
  },

  // ===== 铜钱演卦 =====
  onTossCoin() {
    if (this.data.isFlipping || this.data.coinStep >= 6) return
    this.setData({ isFlipping: true })

    const coins = [
      Math.random() < 0.5 ? 3 : 2,
      Math.random() < 0.5 ? 3 : 2,
      Math.random() < 0.5 ? 3 : 2
    ]
    const sum = coins[0] + coins[1] + coins[2]
    let lineType, isMoving, yang
    if (sum === 6) { lineType = '老阴'; isMoving = true; yang = false }
    else if (sum === 7) { lineType = '少阳'; isMoving = false; yang = true }
    else if (sum === 8) { lineType = '少阴'; isMoving = false; yang = false }
    else { lineType = '老阳'; isMoving = true; yang = true }

    setTimeout(() => {
      const result = {
        step: this.data.coinStep + 1,
        coins: [...coins],
        sum,
        lineType,
        isMoving,
        yang,
        value: coins.filter(c => c === 3).length
      }
      const coinResults = [...this.data.coinResults, result]
      this.setData({
        coinResults,
        coinStep: this.data.coinStep + 1,
        coins,
        isFlipping: false
      })
    }, 1200)
  },

  onResetCoins() {
    this.setData({ coinStep: 0, coinResults: [], coins: [0, 0, 0], isFlipping: false })
  },

  // ===== 提交演卦 =====
  onSubmit() {
    const { selectedMethod, question, numbers, coinResults, methods } = this.data
    if (!question.trim()) {
      wx.showToast({ title: '请输入心中的疑问', icon: 'none' })
      return
    }

    let params = { method: methods[selectedMethod].name, question }

    if (selectedMethod === 0) {
      // 铜钱演卦
      if (coinResults.length < 6) {
        wx.showToast({ title: '请完成6次掷卦', icon: 'none' })
        return
      }
      params.coinResults = coinResults
    } else if (selectedMethod === 1) {
      // 时间演卦 - 自动生成6爻
      params.coinResults = this.generateTimeLines()
    } else if (selectedMethod === 2) {
      // 数字演卦
      if (numbers.some(n => n <= 0 || n > 999)) {
        this.setData({ numberError: '请输入1-999之间的数字' })
        return
      }
      params.coinResults = this.generateNumberLines(numbers)
    }

    wx.navigateTo({ url: `/package-liuyao/pages/result/result?data=${encodeURIComponent(JSON.stringify(params))}` })
  },

  generateTimeLines() {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + 1
    const d = now.getDate()
    const h = now.getHours()
    const shichenIdx = dateUtil.getShichenIndex(h)
    const total = y + m + d + shichenIdx + 1
    const upperVal = total % 8
    const lowerVal = (total + shichenIdx) % 8
    const movingIdx = total % 6
    const results = []
    for (let i = 0; i < 6; i++) {
      const isUpper = i >= 3
      const triVal = isUpper ? upperVal : lowerVal
      const bit = (triVal >> (isUpper ? (i - 3) : i)) & 1
      const isMoving = i === movingIdx
      const yang = bit === 1
      let lineType
      if (yang && isMoving) lineType = '老阳'
      else if (yang) lineType = '少阳'
      else if (isMoving) lineType = '老阴'
      else lineType = '少阴'
      const sum = yang ? (isMoving ? 9 : 7) : (isMoving ? 6 : 8)
      results.push({ step: i + 1, coins: [sum > 7 ? 3 : 2, sum > 7 ? 3 : 2, sum > 7 ? 2 : 2], sum, lineType, isMoving, yang, value: sum > 7 ? 2 : 1 })
    }
    return results
  },

  generateNumberLines(nums) {
    const n1 = nums[0], n2 = nums[1], n3 = nums[2]
    const results = []
    for (let i = 0; i < 6; i++) {
      const seed = (n1 * (i + 1) + n2 * 7 + n3 * 13 + i * 31) % 100
      const yang = seed >= 50
      const isMoving = (seed % 10) < 2
      let lineType
      if (yang && isMoving) lineType = '老阳'
      else if (yang) lineType = '少阳'
      else if (isMoving) lineType = '老阴'
      else lineType = '少阴'
      const sum = yang ? (isMoving ? 9 : 7) : (isMoving ? 6 : 8)
      results.push({ step: i + 1, coins: [sum > 7 ? 3 : 2, sum > 7 ? 3 : 2, sum > 7 ? 2 : 2], sum, lineType, isMoving, yang, value: sum > 7 ? 2 : 1 })
    }
    return results
  }
})
