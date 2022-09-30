// app.ts

import './utils/http'

interface AppOption {
  token?: string
}

App<AppOption>({
  onLaunch() {
    // 获取本地存储的 token 判断登录状态
    wx.getStorage({
      key: 'token',
      success: ({ data: token }) => {
        this.token = token
      },
    })
  },
})
