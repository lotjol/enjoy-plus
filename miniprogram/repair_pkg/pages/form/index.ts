interface House {
  id: string
  name: string
}

interface Repair {
  id: string
  name: string
}

interface Attachment {
  id: string
  url: string
}

Page({
  data: {
    houseList: [] as House[],
    repairItems: [] as Repair[],
    houseInfo: '',
    repairItemName: '',
    houseLayerVisible: false,
    repairLayerVisible: false,
    dateLayerVisible: false,
    currentDate: new Date().getTime(),
    minDate: Date.now(),
    houseId: '',
    repairItemId: '',
    mobile: '',
    description: '',
    appointment: '',
    attachment: [] as Attachment[],
  },

  onLoad({ id }: any) {
    // 获取房屋列表
    this.getHouseList()
    // 获取维修项目列表
    this.getRepairItems()

    if (id) this.getRepairDetail(id)
  },

  async getHouseList() {
    // 请求数据接口
    const { code, data: houseList } = await wx.http.get('/house')
    // 检测接口调用结果
    if (code !== 10000) return wx.showToast({ title: '获取房屋列表失败!', icon: 'none' })

    // 当前如果没有审核通过的房屋
    if (houseList.length === 0) houseList.push({ name: '暂无可报修房屋', disabled: true })

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

  selectHouse(ev: any) {
    const { id: houseId, name: houseInfo } = ev.detail
    this.setData({ houseId, houseInfo })
  },

  selectRepairItem(ev: any) {
    const { id: repairItemId, name: repairItemName } = ev.detail
    this.setData({ repairItemId, repairItemName })
  },

  selectDate(ev: any) {
    this.setData({
      dateLayerVisible: false,
      appointment: wx.utils.formatDate(ev.detail),
    })
  },

  openHouseLayer() {
    this.setData({ houseLayerVisible: true })
  },

  closeHouseLayer() {
    this.setData({ houseLayerVisible: false })
  },

  openRepairLayer() {
    this.setData({ repairLayerVisible: true })
  },

  closeRepairLayer() {
    this.setData({ repairLayerVisible: false })
  },

  openDateLayer() {
    this.setData({ dateLayerVisible: true })
  },

  closeDateLayer() {
    this.setData({ dateLayerVisible: false })
  },
})
