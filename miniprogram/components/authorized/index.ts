// components/authorized/index.ts
Component({
  options: {
    // 隐藏组件名
    virtualHost: true,
  },

  data: {
    isLogin: !!wx.getStorageSync('token'),
  },

  lifetimes: {
    created() {
      // 读取当前历史栈
      const pageStack = getCurrentPages()
      // 取出当前页面路径，登录成功能跳转到该页面
      const redirectURL = pageStack[pageStack.length - 1].route

      // 用户未登录
      if (!this.data.isLogin) {
        wx.redirectTo({
          url: `/pages/login/index?redirectURL=${redirectURL}`,
        })
      }
    },
  },
})
