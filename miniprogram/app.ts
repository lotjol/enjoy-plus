// app.ts

import './utils/http'

interface AppOption {
  token?: string
}

wx.cloud.init({
  env: 'enjoy-plus-2gvtgtlpd358838c',
})

App<AppOption>({
  onLaunch() {
    // 获取本地存储的 token 判断登录状态
    wx.getStorage({
      key: 'token',
      success: ({ data: token }) => {
        this.token = token
      },
      fail() {},
    })
  },
})
