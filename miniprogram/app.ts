// app.ts

import './utils/http'

interface AppOption {
  token?: string
  refresh_token?: string
  getToken(key: string): void
}

wx.cloud.init({
  env: 'enjoy-plus-2gvtgtlpd358838c',
})

App<AppOption>({
  onLaunch() {
    // 获取本地存储的 token 判断登录状态
    this.getToken('token')
    this.getToken('refresh_token')
  },

  getToken(key) {
    wx.getStorage({
      key,
      success: ({ data }) => {
        this[key] = data
      },
      fail() {},
    })
  },
})
