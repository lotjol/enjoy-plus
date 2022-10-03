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
      // 登录状态
      const isLogin = !!getApp().token
      // 记录登录状态
      this.setData({ isLogin })
    },
  },
})
