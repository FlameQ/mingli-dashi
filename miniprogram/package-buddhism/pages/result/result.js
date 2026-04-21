const app = getApp()
const TEACHINGS = {
  huineng: { name:'慧能', school:'禅宗', content:'菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。万事万物，皆由心生。心若执着，便生烦恼；心若放下，便是解脱。', citation:'《六祖坛经》CBETA T2008.48', practice:'日常可修习观心法门，时时觉察自己的念头，不随之流转。' },
  yinguang: { name:'印光', school:'净土宗', content:'念佛之人，必须孝养父母，奉事师长，慈心不杀，修十善业。信愿持名，求生净土，是为此生第一要务。', citation:'《印光法师文钞》CBETA X62n1182', practice:'每日定课念佛，至少一千声。行住坐卧皆可默念。' },
  xuyun: { name:'虚云', school:'禅宗', content:'修行无别修，只要识路头。路头若识得，生死一齐休。参禅念佛，本是一理。法门虽多，归元无二。', citation:'《虚云和尚法汇》', practice:'建议每日静坐半小时，专注呼吸，观照当下。' },
  xuanzang: { name:'玄奘', school:'唯识宗', content:'万法唯识，三界唯心。外境非有，内识非无。若能了达唯识之理，便能于一切法中得大自在。', citation:'《成唯识论》CBETA T1585.31', practice:'观察日常起心动念，思维"是谁在感知这一切"。' },
  fazang: { name:'法藏', school:'华严宗', content:'一即一切，一切即一。理事无碍，事事无碍。于一毛孔中，悉见无量佛。于一微尘中，转大法轮。', citation:'《华严经探玄记》CBETA T1733.35', practice:'日常观想一花一世界，体会事事无碍的华严境界。' },
  kumarajiva: { name:'鸠摩罗什', school:'三论宗', content:'因缘所生法，我说即是空。亦名为假名，亦是中道义。一切诸法，本性空寂，无生无灭。', citation:'《中论》CBETA T1564.30', practice:'日常观照缘起性空，思维一切现象都是因缘和合。' },
  zhiyi: { name:'智顗', school:'天台宗', content:'一念三千，介尔有心，即具三千。心佛众生，三无差别。止观双运，定慧等学。', citation:'《摩诃止观》CBETA T1911.46', practice:'修习天台止观法门，先止后观，定慧双修。' },
  ouyi: { name:'藕益', school:'净土宗', content:'教宗天台，行归净土。深信因果，发菩提心。持戒念佛，求生西方。万善同归，皆成佛道。', citation:'《灵峰宗论》', practice:'以天台教理为指导，以念佛求生净土为归宿。' }
}

Page({
  data: { master: {}, question: '', saved: false },
  onLoad(options) {
    if (options.data) {
      const params = JSON.parse(decodeURIComponent(options.data))
      const master = TEACHINGS[params.masterId] || TEACHINGS.huineng
      this.setData({ master, question: params.question })
    }
  },
  onSave() {
    if (this.data.saved) return
    app.addToHistory({ type: '佛学大师', summary: `${this.data.master.name}开示`, url: '/package-buddhism/pages/chat/chat' })
    this.setData({ saved: true })
    wx.showToast({ title: '已保存', icon: 'success' })
  },
  onRetry() { wx.navigateBack() }
})
