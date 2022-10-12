// 引入 behaviors
import addHouse from './addHouse'

Page({
  behaviors: [addHouse],
  data: {
    name: '',
    gender: 1,
    mobile: '',
    idcardFrontUrl: '',
    idcardBackUrl: '',
  },

  onLoad({ point, building, room, id }) {
    if (point && building && building) {
      // 获取地址参数（房屋部分信息）
      return this.setData({ point, building, room })
    }

    // 根据id值判断是否为编辑房屋
    if (id) {
      // 查询房屋信息
      this.getHouseDetail(id)
      // 更新页面导航栏标题
      wx.setNavigationBarTitle({ title: '编辑房屋信息' })
    }
  },

  // 房屋信息详情
  async getHouseDetail(id: string) {
    // 请求数据接口
    const { code, data: houseDetail } = await wx.http.get('/room/' + id)

    // 校验数据是否合法
    if (code !== 10000) return wx.showToast({ title: '获取房屋信息失败!', icon: 'none' })

    // 渲染房屋信息数据
    this.setData({ ...houseDetail })
  },
})

export {}
