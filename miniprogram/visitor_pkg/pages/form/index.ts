interface House {
  id: string
  name: string
}

Page({
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
    maxDate: Date.now() + 172800000,
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

  verifyHouse() {
    const valid = this.data.houseId !== ''
    // 验证结果提示
    if (!valid) wx.utils.toast('请选择房屋信息!')
    // 返回验证结果
    return valid
  },

  // 验证业主姓名（必须为汉字）
  verifyName() {
    // 正则表达式
    const reg = /^[\u4e00-\u9fa5]{2,5}$/
    // 验证业主姓名
    const valid = reg.test(this.data.name.trim())
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写真实中文姓名!')
    // 返回验证结果
    return valid
  },

  verifyMobile() {
    // 验证手机号
    const reg = /^1[3-8]\d{9}$/
    const valid = reg.test(this.data.mobile)
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写正确的手机号码!')
    // 返回验证结果
    return valid
  },

  async submitForm() {
    // 逐个验证表单的数据
    if (!this.verifyHouse()) return
    if (!this.verifyName()) return
    if (!this.verifyMobile()) return

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
