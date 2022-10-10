// app.ts

import './utils/http'

interface AppOption {
  token?: string
}

// 重写 Page 函数，检测用户登录状态
const oldPage = Page
Page = function (options) {
  // 默认 auth 为 true
  options = Object.assign({ auth: true }, options)

  // 重写前保存原始 onLoad 生命周期函数
  const oldOnLoad = options.onLoad
  const oldOnShow = options.onShow

  // 重写onLoad生命周期函数
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

    // 用户自定义的 onLoad
    if (oldOnLoad) oldOnLoad.call(this, query)
  }

  // 重写onShow生命周期函数
  options.onShow = function () {
    if (options.auth && !wx.getStorageSync('token')) return
    if (oldOnShow) oldOnShow.call(this)
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
      fail: (err) => {
        console.log(err)
      },
    })
  },
})
