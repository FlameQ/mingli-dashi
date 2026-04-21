const shichenOptions = ['子时(23-1点)','丑时(1-3点)','寅时(3-5点)','卯时(5-7点)','辰时(7-9点)','巳时(9-11点)','午时(11-13点)','未时(13-15点)','申时(15-17点)','酉时(17-19点)','戌时(19-21点)','亥时(21-23点)']

Page({
  data: {
    name: '',
    gender: '男',
    birthDate: '2000-01-01',
    birthHourIndex: 6,
    shichenOptions,
    birthPlace: ''
  },
  onNameInput(e) { this.setData({ name: e.detail.value }) },
  onGenderChange(e) { this.setData({ gender: e.detail.value }) },
  onDateChange(e) { this.setData({ birthDate: e.detail.value }) },
  onHourChange(e) { this.setData({ birthHourIndex: e.detail.value }) },
  onPlaceInput(e) { this.setData({ birthPlace: e.detail.value }) },
  onSubmit() {
    const { name, gender, birthDate, birthHourIndex, birthPlace } = this.data
    if (!name.trim()) { wx.showToast({ title: '请输入姓名', icon: 'none' }); return }
    const params = encodeURIComponent(JSON.stringify({ name, gender, birthDate, birthHourIndex, birthPlace }))
    wx.navigateTo({ url: `/package-bazi/pages/result/result?data=${params}` })
  }
})
