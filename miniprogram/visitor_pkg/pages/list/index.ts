Page({
  data: {
    isEmpty: false,
  },
  onLoad() {
    // 获取访客列表
    this.getVistorList()
  },

  async getVistorList() {
    // 请求数据接口
    const {
      code,
      data: { rows: visitorList },
    } = await wx.http.get('/visitor', { current: 1, pageSize: 10 })
    // 检测接口调用结果
    if (code !== 10000) return wx.showToast({ title: '获取访客列表失败!', icon: 'none' })
    // 渲染访客列表
    this.setData({ visitorList, isEmpty: visitorList.length === 0 })
  },

  // 查看通行证
  goPassport(ev: WechatMiniprogram.CustomEvent) {
    // 失效的通知证无法查看
    if (ev.mark?.status === 0) return wx.showToast({ title: '通行证已经失效!', icon: 'none' })
    // 跳转页面
    wx.navigateTo({
      url: '/visitor_pkg/pages/passport/index?id=' + ev.mark?.id,
    })
  },
})
