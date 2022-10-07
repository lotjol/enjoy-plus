Page({
  data: {
    isEmpty: false,
  },
  onShow() {
    // 获取报修列表
    this.getRepairList()
  },

  async getRepairList() {
    // 请求数据接口
    const {
      code,
      data: { rows: repairList },
    } = await wx.http.get('/repair', { current: 1, pageSize: 10 })
    // 检测接口调用的结果
    if (code !== 10000) return wx.showToast({ title: '获取报修列表失败!', icon: 'none' })
    // 渲染报修列表
    this.setData({ repairList, isEmpty: repairList.length === 0 })
  },

  // 页面跳转
  goDetail(ev: WechatMiniprogram.CustomEvent) {
    // 获取报修信息的id
    wx.navigateTo({
      url: `/repair_pkg/pages/detail/index?id=${ev.mark?.id}`,
    })
  },

  addRepair() {
    wx.navigateTo({
      url: '/repair_pkg/pages/form/index',
    })
  },
})
