Page({
  data: {
    countDownVisible: true,
  },

  countDownChange(ev) {
    this.setData({
      timeData: ev.detail,
      countDownVisible: ev.detail.seconds !== 0,
    })
  },
})
