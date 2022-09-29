Page({
  data: {
    notices: [],
  },
  onLoad() {
    // 获取通知列表
    this.getNotices()
  },

  // 通知列表接口
  async getNotices() {
    // 请求数据接口
    const { code, data: notices } = await wx.http.get('/announcement')
    // 验证数据是否合法
    if (code !== 10000) return wx.showToast({ title: '数据加载失败...' })
    // 更新数据，重新渲染
    this.setData({ notices })
  },
})
