Page({
  data: {
    name: '',
    gender: 1,
    mobile: '',
    idcardFrontUrl: '',
    idcardBackUrl: '',
  },

  onLoad({ point, building, room, id }: any) {
    if (point && building && building) {
      // 获取地址参数（房屋部分信息）
      return this.setData({ point, building, room })
    }
    // @ts-ignore
    // 查询房屋信息
    this.getHouseDetail(id)
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

  verifyPicture() {
    // 图片地址不能为空
    const valid = !!this.data.idcardBackUrl && !!this.data.idcardFrontUrl
    // 验证结果提示
    if (!valid) wx.utils.toast('请上传身份证照片!')
    // 返回验证结果
    return valid
  },

  async uploadPicture(ev: WechatMiniprogram.CustomEvent) {
    // 上传身份证照片的类别
    const type = ev.mark?.type

    try {
      // 选择图片
      const media = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sizeType: ['compressed'],
      })

      // 调用接口上传图片
      wx.uploadFile({
        url: wx.http.baseURL + '/upload',
        filePath: media.tempFiles[0].tempFilePath,
        name: 'file',
        header: {
          Authorization: getApp().token,
        },
        success: (res) => {
          // 转换 json 数据
          const data = JSON.parse(res.data)
          // 检测接口调用结果
          if (data.code !== 10000) return wx.utils.toast('上传图片失败!')
          // 保存并预览图片地址
          this.setData({
            [type]: data.data.url,
          })
        },
      })
    } catch {
      // wx.showToast({ title: '选择照片失败, 重新选择!', icon: 'none' })
    }
  },

  removePicture(ev: WechatMiniprogram.CustomEvent) {
    // 移除图片的类型（身份证正面或反面）
    const type = ev.mark?.type
    this.setData({ [type]: '' })
  },

  async submitForm() {
    // 逐个验证表单的数据
    if (!this.verifyName()) return
    if (!this.verifyMobile()) return
    if (!this.verifyPicture()) return

    // 处理请求需要的数据
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __webviewId__, status, ...formData } = this.data
    // 请求数据接口
    const { code } = await wx.http.post('/room', formData)
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast('添加房屋失败!')
    // 成功后跳转至房屋列表
    wx.navigateBack({
      delta: 4,
    })
  },

  // 房屋信息详情
  async getHouseDetail(id: string) {
    if (!id) return
    // 更新页面导航栏标题
    wx.setNavigationBarTitle({ title: '编辑房屋信息' })

    // 请求数据接口
    const { code, data: houseDetail } = await wx.http.get('/room/' + id)
    // 校验数据是否合法
    if (code !== 10000) return wx.utils.toast('获取房屋信息失败!')
    // 渲染房屋信息数据
    this.setData({ ...houseDetail })
  },
})
