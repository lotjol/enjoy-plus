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

// 引入 behaviors
import deleteHouse from './deleteHouse'

Page({
  behaviors: [deleteHouse],
  data: {
    houseList: [] as House[],
  },

  onLoad() {
    // 获取房屋列表
    this.getHouseList()
  },

  async getHouseList() {
    // 请求数据接口
    const { code, data: houseList } = await wx.http.get('/room')
    // 校验数据是否合法
    if (code !== 10000) return wx.showToast({ title: '获取数据失败, 请稍候重试!', icon: 'none' })
    // 渲染房屋列表
    this.setData({
      houseList,
      isEmpty: houseList.length === 0,
    })
  },

  // 页面跳转
  goDetail(ev: WechatMiniprogram.CustomEvent) {
    wx.navigateTo({
      url: `/house_pkg/pages/detail/index?id=${ev.mark?.id}`,
    })
  },

  // 页面跳转
  addHouse() {
    if (this.data.houseList.length >= 5) return wx.showToast({ title: '最多添加5条房屋信息!', icon: 'none' })
    // 跳转到路径
    wx.navigateTo({
      url: '/house_pkg/pages/locate/index',
    })
  },
})
