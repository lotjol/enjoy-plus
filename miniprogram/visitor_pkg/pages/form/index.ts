import validate from 'wechat-validate'

interface House {
  id: string
  name: string
}

Page({
  behaviors: [validate],
  data: {
    houseList: [] as House[],
    houseInfo: '',
    houseId: '',
    name: '',
    gender: 1,
    mobile: '',
    visitDate: '',
    dateLayerVisible: false,
    houseLayerVisible: false,
    currentDate: 0,
    minDate: Date.now(),
    maxDate: Date.now() + 3600 * 24 * 3 * 1000,
  },

  rules: {
    houseId: [{ required: true, message: '请选择房屋信息!' }],
    name: [
      {
        required: true,
        message: '访客姓名不能为空!',
      },
      {
        pattern: /^[\u4e00-\u9fa5]{2,5}$/,
        message: '请填写真实中文姓名!',
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
    visitDate: [
      {
        required: true,
        message: '请选择到访日期!',
      },
    ],
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
    if (code !== 10000) return wx.utils.toast('获取房屋列表失败!')
    // 当前如果没有审核通过的房屋
    if (houseList.length === 0) houseList.push({ name: '暂无可访问房屋', disabled: true })
    // 渲染房屋列表
    this.setData({ houseList })
  },

  async submitForm() {
    // 逐个验证表单的数据
    if (!this.validate()) return

    // 待提交的数据
    const { houseId, name, gender, mobile, visitDate } = this.data

    // 请求接口
    const { code, data } = await wx.http.post('/visitor', { houseId, name, gender, mobile, visitDate })
    // 检测接口调用结果
    if (code !== 10000) return wx.utils.toast('添加访客失败!')

    // 查看通行证
    wx.navigateTo({
      url: '/visitor_pkg/pages/passport/index?id=' + data.id,
    })
  },

  selectHouse(ev: any) {
    const { id: houseId, name: houseInfo } = ev.detail
    this.setData({ houseId, houseInfo })
  },

  selectDate(ev: any) {
    this.setData({
      dateLayerVisible: false,
      currentDate: ev.detail,
      visitDate: wx.utils.formatDate(ev.detail),
    })
  },
  // 房屋组件
  openHouseLayer() {
    this.setData({ houseLayerVisible: true })
  },

  closeHouseLayer() {
    this.setData({ houseLayerVisible: false })
  },

  // 时间组件
  openDateLayer() {
    this.setData({ dateLayerVisible: true })
  },

  closeDateLayer() {
    this.setData({ dateLayerVisible: false })
  },
})

export {}
