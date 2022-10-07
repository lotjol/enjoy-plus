interface House {
  id: string
  name: string
}

interface Repair {
  id: string
  name: string
}

// 引入 behavior
import behavior from './behavior'
import addRepair from './addRepair'

Page({
  behaviors: [behavior, addRepair],
  data: {
    houseList: [] as House[],
    repairItems: [
      { id: '1001', name: '水路卫浴' },
      { id: '1002', name: '电路灯具' },
      { id: '1003', name: '管道疏通' },
      { id: '1004', name: '开锁换锁' },
    ] as Repair[],
    houseName: '请选择房屋信息',
    repairItemName: '请选择维修项目',
  },

  onLoad({ id }: any) {
    // 获取房屋列表
    this.getHouseList()
    // 获取维修项目列表
    // this.getRepairItems()

    if (id) this.getRepairDetail(id)
  },

  async getHouseList() {
    // 请求数据接口
    const { code, data: houseList } = await wx.http.get('/house')
    // 检测接口调用结果
    if (code !== 10000) return wx.showToast({ title: '获取房屋列表失败!', icon: 'none' })
    // 渲染房屋列表
    this.setData({ houseList })
  },

  async getRepairItems() {
    // 请求数据接口
    const { code, data: repairItems } = await wx.http.get('/repairItem')
    // 检测接口调用结果
    if (code !== 10000) return wx.showToast({ title: '获取维修项目失败!', icon: 'none' })
    // 渲染房屋列表
    this.setData({ repairItems })
  },

  async getRepairDetail(id: string) {
    // 请求数据接口
    const { code, data: repairDetail } = await wx.http.get('/repair/' + id)
    // 检测接口调用结果
    if (code !== 10000) return wx.showToast({ title: '获取报修信息失败!', icon: 'none' })
    // 渲染报修信息
    this.setData({ ...repairDetail })
  },
})
