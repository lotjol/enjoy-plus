// app.ts

import './utils/http'

interface AppOption {
  token?: string
}

// 重写 Page 函数，检测用户登录状态
let oldPage = Page
Page = function (options) {
  // 默认 auth 为 true
  options = Object.assign({ auth: true }, options)

  // 重写前保存原始 onLoad 生命周期函数
  let oldOnLoad = options.onLoad
  // 重写生命周期函数
  options.onLoad = function (query) {
    if (options.auth && !wx.getStorageSync('token')) {
      // 读取当前历史栈
      const pageStack = getCurrentPages()
      // 取出当前页面路径，登录成功能跳转到该页面
      const redirectURL = pageStack[pageStack.length - 1].route
      // 用户未登录
      wx.redirectTo({
        url: `/pages/login/index?redirectURL=/${redirectURL}`,
      })

      //
      return
    }

    if (oldOnLoad) oldOnLoad.call(this, query)
  }

  return oldPage(options)
}

App<AppOption>({
  onLaunch() {
    // 获取本地存储的 token 判断登录状态
    wx.getStorage({
      key: 'token',
      success: ({ data: token }) => {
        this.token = token
      },
      fail: () => {},
    })
  },
})
