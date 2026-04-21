Component({
  properties: {
    icon: { type: String, value: '卦' },
    title: { type: String, value: '' },
    desc: { type: String, value: '' },
    url: { type: String, value: '' },
    color: { type: String, value: '#88ADA6' }
  },

  methods: {
    onTap() {
      if (this.data.url) {
        wx.navigateTo({ url: this.data.url })
      }
    }
  }
})
