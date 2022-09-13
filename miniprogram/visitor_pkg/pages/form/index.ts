Page({
  data: {
    dateLayerVisible: false,
  },
  selectDate() {
    this.setData({
      dateLayerVisible: true,
    })
  },
  closeDateLayer() {
    this.setData({
      dateLayerVisible: false,
    })
  },
  goPassport() {
    wx.navigateTo({
      url: '/visitor_pkg/pages/passport/index',
    })
  },
})
