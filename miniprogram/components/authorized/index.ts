// components/authorized/index.ts
Component({
  options: {
    // 隐藏组件名
    virtualHost: true,
  },

  data: {
    isLogin: false,
  },

  lifetimes: {
    attached() {
      // 读取当前历史栈
      const pageStack = getCurrentPages()
      // 取出当前页面路径，登录成功能跳转到该页面
      const redirectURL = pageStack[pageStack.length - 1].route

      // 登录状态
      const isLogin = !!getApp().token
      // 记录登录状态
      this.setData({ isLogin })

      // 用户未登录
      if (!isLogin) {
        wx.redirectTo({
          url: `/pages/login/index?redirectURL=/${redirectURL}`,
        })
      }
    },
  },
})
