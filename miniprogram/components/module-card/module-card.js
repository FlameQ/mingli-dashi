Component({
  properties: {
    icon: { type: String, value: '🎴' },
    title: { type: String, value: '' },
    desc: { type: String, value: '' },
    url: { type: String, value: '' },
    color: { type: String, value: '#AA2116' }
  },

  methods: {
    onTap() {
      if (this.data.url) {
        wx.navigateTo({ url: this.data.url })
      }
    }
  }
})
