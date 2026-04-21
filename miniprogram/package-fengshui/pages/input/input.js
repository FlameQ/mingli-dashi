Page({
  data: {
    houseTypes: ['住宅','办公室','商铺'], selectedType: '住宅',
    facings: ['东','南','西','北','东南','东北','西南','西北'], selectedFacing: '南',
    buildYear: '2000',
    areas: [{name:'大门',checked:false},{name:'卧室',checked:false},{name:'厨房',checked:false},{name:'卫生间',checked:false},{name:'客厅',checked:true},{name:'书房',checked:false},{name:'阳台',checked:false}]
  },
  onSelectType(e) { this.setData({ selectedType: e.currentTarget.dataset.type }) },
  onSelectFacing(e) { this.setData({ selectedFacing: e.currentTarget.dataset.facing }) },
  onYearChange(e) { this.setData({ buildYear: e.detail.value }) },
  onAreaChange(e) {
    const idx = e.currentTarget.dataset.idx
    const areas = this.data.areas.slice()
    areas[idx].checked = !areas[idx].checked
    this.setData({ areas })
  },
  onSubmit() {
    const { selectedType, selectedFacing, buildYear, areas } = this.data
    const selectedAreas = areas.filter(a => a.checked).map(a => a.name)
    if (selectedAreas.length === 0) { wx.showToast({ title: '请选择至少一个区域', icon: 'none' }); return }
    const params = encodeURIComponent(JSON.stringify({ type: selectedType, facing: selectedFacing, buildYear, areas: selectedAreas }))
    wx.navigateTo({ url: `/package-fengshui/pages/result/result?data=${params}` })
  }
})
