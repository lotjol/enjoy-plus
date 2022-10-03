interface userInfo {
  id: string
  avatar: string
  nickName: string
}

Page({
  auth: false,
  data: {
    userInfo: <userInfo>{},
  },
  onShow() {
    // 获取登录用户信息
    wx.getStorage({
      key: 'token',
      success: () => {
        this.getUserInfo()
      },
      fail: (err) => {
        console.log(err)
      },
    })
  },

  // 用户信息接口
  async getUserInfo() {
    // 请求数据接口
    const { code, data: userInfo } = await wx.http.get<userInfo>('/userInfo')
    // 校验数据是否合法
    if (code !== 10000) return wx.showToast({ title: '数据加载失败, 请稍后重试!', icon: 'none' })
    // 设置数据，更新渲染
    this.setData({ userInfo })
    // 本地缓存用户信息
    wx.setStorage({ key: 'userInfo', data: userInfo })
  },
})

export {}
