Page({
  // 记录房屋id（不需要渲染页面）
  house_id: '',

  data: {
    dialogVisible: false,
  },

  onLoad() {
    // 获取房屋列表
    this.getHouseList()
  },

  async getHouseList() {
    // 请求数据接口
    const { code } = await wx.http.get('/room')
    // 校验数据是否合法
    if (code !== 10000) return wx.showToast({ title: '获取数据失败, 请稍候重试!', icon: 'none' })

    // 渲染房屋列表
    // this.setData()
  },

  // 删除房屋
  deleteHouse() {
    console.log(this.house_id + '请求接口删除数据')
  },

  swipeClose(ev: any) {
    const { instance } = ev.detail
    // 显示 Dialog 对话框
    this.setData({ dialogVisible: true })
    // 待删除的房屋id
    this.house_id = ev.mark.id
    // swiper-cell 滑块关闭
    instance.close()
  },

  dialogClose(ev: any) {
    // 选择了确认后删除房屋
    if (ev.detail === 'confirm') this.deleteHouse()
  },

  // 页面跳转
  goDetail(ev: WechatMiniprogram.CustomEvent) {
    wx.navigateTo({
      url: `/house_pkg/pages/detail/index?id=${ev.mark?.id}`,
    })
  },

  // 页面跳转
  addHouse() {
    wx.navigateTo({
      url: '/house_pkg/pages/locate/index',
    })
  },
})
