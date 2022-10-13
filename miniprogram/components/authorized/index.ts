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
      const currentPage = pageStack[pageStack.length - 1]

      // 登录状态
      const isLogin = !!getApp().token

      // 记录登录状态
      this.setData({ isLogin })

      if (!isLogin) {
        // 重写页面生命周期使用不执行任何操作
        currentPage.onLoad = () => {}
        currentPage.onShow = () => {}

        // 取出当前页面路径，登录成功能跳转到该页面
        const redirectURL = currentPage.route

        // 引导用户到登录页面
        wx.redirectTo({
          url: `/pages/login/index?redirectURL=/${redirectURL}`,
        })
      }
    },
  },
})
