interface Attachment {
  id: string
  url: string
}

// 添加房屋报修
export default Behavior({
  data: {
    houseId: '',
    repairItemId: '',
    mobile: '',
    description: '',
    appointment: '请选择上门维修日期',
    attachment: [] as Attachment[],
  },
  methods: {
    verifyHouse() {
      const valid = this.data.houseId !== ''
      // 验证结果提示
      if (!valid) wx.showToast({ title: '请选择房屋信息!', icon: 'none' })
      // 返回验证结果
      return valid
    },

    verifyRepair() {
      const valid = this.data.repairItemId !== ''
      // 验证结果提示
      if (!valid) wx.showToast({ title: '请选择维修项目!', icon: 'none' })
      // 返回验证结果
      return valid
    },

    verifyMobile() {
      // 验证手机号
      const reg = /^[1][3-8][0-9]{9}$/
      const valid = reg.test(this.data.mobile.trim())
      // 验证结果提示
      if (!valid) wx.showToast({ title: '请填写正确的手机号码!', icon: 'none' })
      // 返回验证结果
      return valid
    },

    verifyDate() {
      // 验证日期格式
      const reg = /^\d{4}\/\d{2}\/\d{2}$/
      const valid = reg.test(this.data.appointment)
      // 验证结果提示
      if (!valid) wx.showToast({ title: '请选择预约日期!', icon: 'none' })
      // 返回验证结果
      return valid
    },

    verifyDescription() {
      // 验证报修项目描述
      const valid = this.data.description.trim() !== ''
      // 验证结果提示
      if (!valid) wx.showToast({ title: '请填写问题描述!', icon: 'none' })
      // 返回验证结果
      return valid
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
      if (!this.verifyHouse()) return
      if (!this.verifyRepair()) return
      if (!this.verifyMobile()) return
      if (!this.verifyDate()) return
      if (!this.verifyDescription()) return

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
      if (code !== 10000) return wx.showToast({ title: '在线报修失败!', icon: 'none' })
      // 跳转到表单列表页面
      wx.redirectTo({
        url: '/repair_pkg/pages/list/index',
      })
    },
  },
})
