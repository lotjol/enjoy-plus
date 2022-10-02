// 处理时的格式为 年/月/日
import formatDate from '../../../utils/format-date'

// 引入 behavior
import behavior from './behavior'

Page({
  behaviors: [behavior],
  data: {
    houseList: [
      { id: '1', name: '北京西三旗花园1号楼 101' },
      { id: '2', name: '北京西三旗花园1号楼 102' },
    ] as { id: string; name: string }[],
    roomName: '请选择房屋信息',

    roomId: '',
    name: '',
    sex: '1',
    mobile: '',
    visitDate: formatDate(Date.now()),
  },

  onLoad() {
    // 获取房屋列表
    // this.getHouseList()
  },

  verifyRoom() {
    const valid = this.data.roomId !== ''

    // 验证结果提示
    if (!valid) wx.showToast({ title: '请选择房屋信息!', icon: 'none' })
    // 返回验证结果
    return valid
  },

  // 验证业主姓名（必须为汉字）
  verifyName() {
    // 正则表达式
    const reg = /^[\u4e00-\u9fa5]{2,5}$/
    // 验证业主姓名
    const valid = reg.test(this.data.name)

    // 验证结果提示
    if (!valid) wx.showToast({ title: '请填写真实中文姓名!', icon: 'none' })
    // 返回验证结果
    return valid
  },

  verifyMobile() {
    // 验证手机号
    const reg = /^[1][3-8][0-9]{9}$/
    const valid = reg.test(this.data.mobile)

    // 验证结果提示
    if (!valid) wx.showToast({ title: '请填写正确的手机号码!', icon: 'none' })
    // 返回验证结果
    return valid
  },

  // 房屋列表
  getHouseList() {
    // wx.http.get('')
  },

  submitForm() {
    // 逐个验证表单的数据
    if (!this.verifyRoom()) return
    if (!this.verifyName()) return
    if (!this.verifyMobile()) return
  },
})

export {}
