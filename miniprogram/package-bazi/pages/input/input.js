const app = getApp()
const lunarUtil = require('../../../utils/lunar-util')

const shichenOptions = ['子时(23-1点)','丑时(1-3点)','寅时(3-5点)','卯时(5-7点)','辰时(7-9点)','巳时(9-11点)','午时(11-13点)','未时(13-15点)','申时(15-17点)','酉时(17-19点)','戌时(19-21点)','亥时(21-23点)']

const LUNAR_MONTH_NAMES = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月']
const LUNAR_DAY_NAMES = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
]

Page({
  data: {
    name: '',
    gender: '男',
    calendarType: 'solar',
    birthDate: '2000-01-01',
    birthHourIndex: 6,
    shichenOptions,
    birthPlace: '',
    profileLoaded: false,
    // 农历相关
    lunarYearRange: [],
    lunarYearIndex: 100,
    lunarMonthOptions: LUNAR_MONTH_NAMES,
    lunarMonthIndex: 0,
    lunarDayOptions: LUNAR_DAY_NAMES,
    lunarDayIndex: 0,
    isLeapMonth: false,
    hasLeapMonth: false
  },

  onShow() {
    this.loadProfile()
    this.initLunarData()
  },

  initLunarData() {
    const years = []
    for (let y = 1900; y <= 2100; y++) years.push(y)
    this.setData({ lunarYearRange: years })
    this.updateLunarDayOptions()
  },

  loadProfile() {
    if (this.data.profileLoaded) return
    const profile = app.getActiveProfile()
    if (profile) {
      const calendarType = profile.calendarType || 'solar'
      const updates = {
        name: profile.name || '',
        gender: profile.gender || '男',
        birthDate: profile.birthDate || '2000-01-01',
        birthHourIndex: profile.birthHourIndex != null ? profile.birthHourIndex : 6,
        birthPlace: profile.birthPlace || '',
        calendarType,
        profileLoaded: true
      }
      if (calendarType === 'lunar' && profile.lunarYear) {
        const years = this.data.lunarYearRange.length ? this.data.lunarYearRange : []
        const yIdx = years.indexOf(profile.lunarYear)
        updates.lunarYearIndex = yIdx >= 0 ? yIdx : 100
        updates.lunarMonthIndex = (profile.lunarMonth || 1) - 1
        updates.lunarDayIndex = (profile.lunarDay || 1) - 1
        updates.isLeapMonth = profile.isLeapMonth || false
      }
      this.setData(updates)
      this.updateLeapMonthStatus()
    }
  },

  onNameInput(e) { this.setData({ name: e.detail.value }) },
  onGenderChange(e) { this.setData({ gender: e.detail.value }) },
  onDateChange(e) { this.setData({ birthDate: e.detail.value }) },
  onHourChange(e) { this.setData({ birthHourIndex: e.detail.value }) },
  onPlaceInput(e) { this.setData({ birthPlace: e.detail.value }) },

  onCalendarTypeChange(e) {
    this.setData({ calendarType: e.detail.value })
  },

  onLunarYearChange(e) {
    this.setData({ lunarYearIndex: Number(e.detail.value) })
    this.updateLeapMonthStatus()
    this.updateLunarDayOptions()
  },

  onLunarMonthChange(e) {
    this.setData({ lunarMonthIndex: Number(e.detail.value) })
    this.updateLeapMonthStatus()
    this.updateLunarDayOptions()
  },

  onLunarDayChange(e) {
    this.setData({ lunarDayIndex: Number(e.detail.value) })
  },

  onLeapMonthChange(e) {
    this.setData({ isLeapMonth: e.detail.value === 'true' })
    this.updateLunarDayOptions()
  },

  updateLeapMonthStatus() {
    const { lunarYearRange, lunarYearIndex, lunarMonthIndex } = this.data
    const year = lunarYearRange[lunarYearIndex]
    const month = lunarMonthIndex + 1
    if (year) {
      const leap = lunarUtil.leapMonth(year)
      this.setData({ hasLeapMonth: leap === month })
    }
  },

  updateLunarDayOptions() {
    const { lunarYearRange, lunarYearIndex, lunarMonthIndex, isLeapMonth } = this.data
    const year = lunarYearRange[lunarYearIndex]
    const month = lunarMonthIndex + 1
    if (!year) return

    let days
    if (isLeapMonth && lunarUtil.leapMonth(year) === month) {
      days = lunarUtil.leapDays(year)
    } else {
      days = lunarUtil.lunarMonthDays(year, month)
    }
    const dayOptions = LUNAR_DAY_NAMES.slice(0, days)
    this.setData({
      lunarDayOptions: dayOptions,
      lunarDayIndex: Math.min(this.data.lunarDayIndex, days - 1)
    })
  },

  onSubmit() {
    const { name, gender, birthDate, birthHourIndex, birthPlace, calendarType } = this.data
    if (!name.trim()) { wx.showToast({ title: '请输入姓名', icon: 'none' }); return }

    let params
    if (calendarType === 'lunar') {
      // 农历转阳历
      const { lunarYearRange, lunarYearIndex, lunarMonthIndex, lunarDayIndex, isLeapMonth } = this.data
      const lunarY = lunarYearRange[lunarYearIndex]
      const lunarM = lunarMonthIndex + 1
      const lunarD = lunarDayIndex + 1
      if (!lunarY) { wx.showToast({ title: '请选择年份', icon: 'none' }); return }
      try {
        const solar = lunarUtil.lunarToSolar(lunarY, lunarM, lunarD, isLeapMonth)
        const solarDate = `${solar.year}-${String(solar.month).padStart(2,'0')}-${String(solar.day).padStart(2,'0')}`
        params = {
          name, gender, birthDate: solarDate, birthHourIndex, birthPlace,
          calendarType: 'lunar',
          lunarYear: lunarY, lunarMonth: lunarM, lunarDay: lunarD, isLeapMonth,
          lunarDateStr: `${lunarY}年${isLeapMonth ? '闰' : ''}${LUNAR_MONTH_NAMES[lunarM - 1]}${LUNAR_DAY_NAMES[lunarD - 1]}`
        }
      } catch (e) {
        wx.showToast({ title: '农历日期无效', icon: 'none' }); return
      }
    } else {
      params = { name, gender, birthDate, birthHourIndex, birthPlace, calendarType: 'solar' }
    }

    const encoded = encodeURIComponent(JSON.stringify(params))
    wx.navigateTo({ url: `/package-bazi/pages/result/result?data=${encoded}` })
  }
})
