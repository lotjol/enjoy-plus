import http from 'wechat-http'

// 配置接口基础路径
http.baseURL = 'https://live-api.itheima.net'

// 配置请求拦截器
http.intercept.request = (options) => {
  // 获取全局实例中存储的 token
  const { token } = getApp()
  // 指定默认的头信息，方便日后扩展
  const defaultHeader: AnyObject = {}
  // 添加 token 头信息
  if (token) defaultHeader.Authorization = token
  // 将用户自定义的头信息和公共的头信息合并
  options.header = Object.assign({}, defaultHeader, options.header)
  // 返回处理后的请求参数
  return options
}

// 配置响应拦截器
http.intercept.response = async ({ statusCode, data, config }) => {
  if (statusCode === 401) {
    // refreshToken 过期的情形
    if (config.url.includes('/refreshToken')) {
      // 读取当前历史栈
      const pageStack = getCurrentPages()
      // 取出当前页面路径，登录成功能跳转到该页面
      const currentPage = pageStack[pageStack.length - 1]
      // 取出当前页面路径，登录成功能跳转到该页面
      const redirectURL = currentPage.route

      // 引导用户到登录页面
      return wx.redirectTo({
        url: `/pages/login/index?redirectURL=/${redirectURL}`,
      })
    }

    // 获取应用实例
    const app = getApp()

    // 不存在 refresh_token 时，没有必要去刷新
    if (!app.refresh_token) return
    // 使用 refreshToken 更新 token
    const { data } = await http({
      url: '/refreshToken',
      method: 'POST',
      header: {
        Authorization: app.refresh_token,
      },
    })

    // 更新 token 和 refresh_token
    app.setToken(data.token, data.refresh_token)

    // 重新发起请求
    return http(
      Object.assign(config, {
        // 传递新的 token
        header: {
          Authorization: app.token,
        },
      })
    )
  }

  return data
}

// 挂载到全局对象
wx.http = http

// 作为模块导出
export default http
