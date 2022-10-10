export default Behavior({
  data: {
    houseId: '',
    name: '',
    gender: 1,
    mobile: '',
    visitDate: '请选择预约日期',
  },

  methods: {
    verifyHouse() {
      const valid = this.data.houseId !== ''
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
      const valid = reg.test(this.data.name.trim())
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
      if (code !== 10000) return wx.showToast({ title: '添加访客失败!', icon: 'none' })

      // 查看通行证
      wx.navigateTo({
        url: '/visitor_pkg/pages/passport/index?id=' + data.id,
      })
    },
  },
})
