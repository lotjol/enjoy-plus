Page({
  data: {
    sex: '1',
    name: '',
    code: '',
    mobile: '',
    idcardFrontUrl: '',
    idcardBackUrl: '',
    point: '',
  },

  onLoad({ point, building, room, id }: any) {
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

  verifyCode() {
    // 正则验证短信验证码
    const reg = /^\d{6}$/
    const valid = reg.test(this.data.code)

    // 验证结果提示
    if (!valid) wx.showToast({ title: '请填写6位数字验证码!', icon: 'none' })
    // 返回验证结果
    return valid
  },

  async uploadPicture(ev: WechatMiniprogram.CustomEvent) {
    // 上传身份证照片的类别
    const type = ev.mark?.type

    try {
      // 选择图片
      const res = await wx.chooseMedia({ count: 1, mediaType: ['image'], sizeType: ['compressed'] })
      // 保存并预览图片地址
      this.setData({
        [type]: res.tempFiles[0].tempFilePath,
      })
    } catch {
      wx.showToast({ title: '选择照片失败, 重新选择!', icon: 'none' })
    }
  },

  verifyPicture() {
    // 图片地址不能为空
    const valid = !!this.data.idcardBackUrl && !!this.data.idcardFrontUrl

    // 验证结果提示
    if (!valid) wx.showToast({ title: '请上传身份证照片!', icon: 'none' })
    // 返回验证结果
    return valid
  },

  // 房屋信息详情
  async getHouseDetail(id: string) {
    // 请求数据接口
    const { code } = await wx.http.get('/room/' + id)

    // 校验数据是否合法
    if (code !== 10000) return wx.showToast({ title: '获取房屋信息失败!', icon: 'none' })

    // 渲染房屋信息数据
    this.setData({ id })
  },

  async getCode() {
    // 验证手机号码
    if (!this.verifyMobile()) return

    // 用户填写的手机号码
    const mobile = this.data.mobile.trim()
    // 调用接口请求发送短信验证码
    const { code, data } = await wx.http.get('/code', { mobile })

    // 验证是否发送成功
    if (code !== 10000) {
      wx.showToast({ title: '发送失败, 请稍后重试!', icon: 'none' })
    } else {
      wx.showToast({ title: '发送成功, 请查收短信!', icon: 'none' })
      // 真机调试面板中查看
      console.log('===>>>' + data.code + '<<<===')

      // 倒计时...
    }
  },

  async submitForm() {
    // 逐个验证表单的数据
    if (!this.verifyName()) return
    if (!this.verifyMobile()) return
    if (!this.verifyCode()) return
    if (!this.verifyPicture()) return

    // 处理接口所需的数据
    const { point: cell, ...data } = this.data
    // 请求数据接口
    await wx.http.post('/room', { cell, ...data })

    // 成功后跳转至房屋列表
  },
})

export {}
