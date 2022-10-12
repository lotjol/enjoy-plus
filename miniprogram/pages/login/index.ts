Page({
  data: {
    countDownVisible: true,
  },

  countDownChange(ev: any) {
    this.setData({
      timeData: ev.detail,
      countDownVisible: ev.detail.seconds !== 0,
    })
  },
})
