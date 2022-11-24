Page({
  onShow() {
    // 本地获取用户信息
    this.setData({ userInfo: wx.getStorageSync('userInfo') })
  },

  getUserAvatar(ev: WechatMiniprogram.CustomEvent) {
    // 获取临时用户头像地址
    this.updateUserAvatar(ev.detail.avatarUrl)
  },

  getUserNickName(ev: WechatMiniprogram.CustomEvent) {
    // 获取用户的昵称
    this.updateNickName(ev.detail.value)
  },

  async updateNickName(nickName: string) {
    // 请求数据接口
    const { code } = await wx.http.put('/userInfo', { nickName })
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast('更新用户信息失败!')
  },

  updateUserAvatar(avatarUrl: string) {
    // 调用接口上传图片
    wx.uploadFile({
      url: wx.http.baseURL + '/upload',
      filePath: avatarUrl,
      name: 'file',
      header: {
        Authorization: getApp().token,
      },
      formData: {
        type: 'avatar',
      },
      success: (res) => {
        // 转换 json 数据
        const data = JSON.parse(res.data)
        // 检测接口调用结果
        if (data.code !== 10000) return wx.utils.toast('更新头像失败!')
        // 保存并预览图片地址
        this.setData({ 'userInfo.avatar': data.data.url })
      },
    })
  },
})

export {}
