interface House {
  id: string
  name: string
  gender: 0 | 1
  mobile: string
  status: 1 | 2 | 3
  point: string
  building: string
  room: string
}

// 记录当前要删除的房屋 id 和索引
let house_id: string
let house_index: number

Page({
  data: {
    dialogVisible: false,
    houseList: [] as House[],
  },

  onShow() {
    // 获取房屋列表
    this.getHouseList()
  },

  async getHouseList() {
    // 请求数据接口
    const { code, data: houseList } = await wx.http.get('/room')
    // 校验数据是否合法
    if (code !== 10000) return wx.utils.toast('获取数据失败, 请稍候重试!')
    // 渲染房屋列表
    this.setData({ houseList, isEmpty: houseList.length === 0 })
  },

  // 删除房屋
  async deleteHouse() {
    // 请求数据接口
    const { code } = await wx.http.delete('/room/' + house_id)
    // 检测接口调用结果
    if (code !== 10000) return wx.utils.toast('删除房屋失败!')

    // 更新房屋列表
    this.data.houseList.splice(house_index, 1)
    this.setData({
      houseList: this.data.houseList,
      isEmpty: this.data.houseList.length === 0,
    })
  },

  swipeClose(ev: any) {
    const { instance } = ev.detail
    // 显示 Dialog 对话框
    this.setData({ dialogVisible: true })

    // 待删除的房屋id和索引
    house_id = ev.mark.id
    house_index = ev.mark.index
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
    // 每个用户最多有5个房屋
    if (this.data.houseList.length >= 5) return wx.utils.toast('最多添加5条房屋信息!')
    // 跳转到路径
    wx.navigateTo({
      url: '/house_pkg/pages/locate/index',
    })
  },
})

export {}
