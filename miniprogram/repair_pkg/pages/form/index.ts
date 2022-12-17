import validate from 'wechat-validate'

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
  behaviors: [validate],
  data: {
    id: '',
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

  rules: {
    houseId: [
      {
        required: true,
        message: '请选择房屋信息!',
      },
    ],
    repairItemId: [
      {
        required: true,
        message: '请选择维修项目!',
      },
    ],
    mobile: [
      {
        required: true,
        message: '访客手机号不能为空!',
      },
      {
        pattern: /^1[3-8]\d{9}$/,
        message: '请填写正确的手机号码!',
      },
    ],
    appointment: [
      {
        required: true,
        message: '请选择预约日期!',
      },
    ],
    description: [
      {
        required: true,
        message: '请填写问题描述!',
      },
    ],
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

  afterRead(ev: any) {
    const { file } = ev.detail
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: wx.http.baseURL + '/upload',
      filePath: file.url,
      name: 'file',
      header: {
        Authorization: getApp().token,
      },
      success: (res) => {
        // 转换 json 数据
        const data = JSON.parse(res.data)
        // 上传完成需要更新 fileList
        const { attachment = [] } = this.data

        attachment.push({ ...data.data })

        this.setData({ attachment })
      },
    })
  },

  async submitForm() {
    // 逐个验证表单的数据
    if (!this.validate()) return

    const { id, houseId, repairItemId, appointment, mobile, description, attachment } = this.data
    // 请求数据接口
    const { code } = await wx.http.post('/repair', {
      id,
      houseId,
      repairItemId,
      appointment,
      mobile,
      description,
      attachment,
    })
    // 检测接口请求的结果
    if (code !== 10000) return wx.utils.toast('在线报修失败!')
    // 跳转到表单列表页面
    wx.redirectTo({
      url: '/repair_pkg/pages/list/index',
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
