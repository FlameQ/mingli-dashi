const app = getApp()
const shichenOptions = ['子时(23-1点)','丑时(1-3点)','寅时(3-5点)','卯时(5-7点)','辰时(7-9点)','巳时(9-11点)','午时(11-13点)','未时(13-15点)','申时(15-17点)','酉时(17-19点)','戌时(19-21点)','亥时(21-23点)']

Page({
  data: {
    isEdit: false,
    profileId: '',
    name: '',
    gender: '男',
    birthDate: '',
    birthHourIndex: 6,
    birthPlace: '',
    shichenOptions
  },
  onLoad(options) {
    if (options.id) {
      const profile = app.globalData.profiles.find(p => p.id === options.id)
      if (profile) {
        this.setData({
          isEdit: true,
          profileId: profile.id,
          name: profile.name,
          gender: profile.gender,
          birthDate: profile.birthDate,
          birthHourIndex: profile.birthHourIndex,
          birthPlace: profile.birthPlace
        })
      }
    }
  },
  onNameInput(e) { this.setData({ name: e.detail.value }) },
  onGenderChange(e) { this.setData({ gender: e.detail.value }) },
  onDateChange(e) { this.setData({ birthDate: e.detail.value }) },
  onHourChange(e) { this.setData({ birthHourIndex: Number(e.detail.value) }) },
  onPlaceInput(e) { this.setData({ birthPlace: e.detail.value }) },
  onSave() {
    const { name, gender, birthDate, birthHourIndex, birthPlace } = this.data
    if (!name.trim()) { wx.showToast({ title: '请输入姓名', icon: 'none' }); return }
    if (!birthDate) { wx.showToast({ title: '请选择出生日期', icon: 'none' }); return }
    const profileData = { name: name.trim(), gender, birthDate, birthHourIndex, birthPlace }
    if (this.data.isEdit) {
      app.updateProfile(this.data.profileId, profileData)
      wx.showToast({ title: '已更新', icon: 'success' })
    } else {
      app.addProfile(profileData)
      wx.showToast({ title: '已添加', icon: 'success' })
    }
    setTimeout(() => wx.navigateBack(), 500)
  },
  onDelete() {
    if (!this.data.isEdit) return
    wx.showModal({
      title: '确认删除',
      content: `确定要删除「${this.data.name}」的档案吗？`,
      confirmColor: '#88ADA6',
      success: (res) => {
        if (res.confirm) {
          app.deleteProfile(this.data.profileId)
          wx.navigateBack()
        }
      }
    })
  }
})
