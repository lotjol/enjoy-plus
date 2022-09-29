Page({
  data: {
    noticeDetail: {},
  },

  onLoad({ id }) {
    // 获取通知详情
    this.getNoticeDetail(id)
  },

  async getNoticeDetail(id: string | undefined) {
    // id 不合法
    if (!id) return
    // 请求数据接口
    const { code, data: noticeDetail } = await wx.http.get(`/announcement/${id}`)
    // 验证数据的合法性
    if (code !== 10000) return wx.showToast({ title: '数据加载失败...' })
    // 更新数据，重新渲染
    this.setData({ noticeDetail })
  },
})
