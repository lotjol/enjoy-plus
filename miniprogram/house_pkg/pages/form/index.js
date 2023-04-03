// \u4e00-\u9fa5] 中文验证规则

Page({
  data: {
    idcardFrontUrl: '/static/images/avatar_1.jpg',
    idcardBackUrl: '/static/images/avatar_2.jpg',
  },
  goList() {
    wx.reLaunch({
      url: '/house_pkg/pages/list/index',
    })
  },
  removePicture(ev) {
    // 移除图片的类型（身份证正面或反面）
    const type = ev.mark?.type
    this.setData({ [type]: '' })
  },
})
