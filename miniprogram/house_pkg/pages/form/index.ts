// 表单验证插件
import validate from 'wechat-validate'

Page({
  behaviors: [validate],
  data: {
    name: '',
    gender: 1,
    mobile: '',
    idcardFrontUrl: '',
    idcardBackUrl: '',
  },

  rules: {
    name: [
      {
        required: true,
        message: '业主姓名不能为空!',
      },
      {
        pattern: /^[\u4e00-\u9fa5]{2,5}$/,
        message: '请填写真实中文姓名!',
      },
    ],
    mobile: [
      {
        required: true,
        message: '业主电话不能为空!',
      },
      {
        pattern: /^1[3-8]\d{9}$/,
        message: '请填写正确的手机号码!',
      },
    ],
    idcardBackUrl: [{ required: true, message: '请上传身份证人像面!' }],
    idcardFrontUrl: [{ required: true, message: '请上传身份证国徽面!' }],
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
    // 验证表单数据
    if (!this.validate()) return

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
