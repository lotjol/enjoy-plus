interface House {
  id: string
  name: string
}

// 引入 behavior
import behavior from './behavior'
import addVisitor from './addVisitor'

Page({
  behaviors: [behavior, addVisitor],
  data: {
    houseList: [] as House[],
    houseInfo: '请选择房屋信息',
  },

  onLoad() {
    // 获取房屋列表
    this.getHouseList()
  },

  // 房屋列表
  async getHouseList() {
    // 请求数据接口
    const { code, data: houseList } = await wx.http.get('/house')
    // 检测接口调用结果
    if (code !== 10000) return wx.showToast({ title: '获取房屋列表失败!', icon: 'none' })
    // 渲染房屋列表
    this.setData({ houseList })
  },
})

export {}
