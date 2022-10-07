// 封装 ----------------------------------------------------------

interface Http {
  <T>(params: WechatMiniprogram.RequestOption, options?: { showLoading: boolean }): Promise<T>
  /**
   * 配置接口基础路径
   */
  baseURL?: string
  /**
   * 请求状态配置，同wx.showLoading
   */
  loading: WechatMiniprogram.ShowLoadingOption
  intercept: {
    request(result: WechatMiniprogram.RequestOption): WechatMiniprogram.RequestOption
    response(response: RequestSuccessResult): any
  }
  get<T = any>(url: string, data?: any): Promise<{ code: number; message: string; data: T }>
  post<T = any>(url: string, data?: any): Promise<{ code: number; message: string; data: T }>
  put<T = any>(url: string, data?: any): Promise<{ code: number; message: string; data: T }>
  delete<T = any>(url: string, data?: any): Promise<{ code: number; message: string; data: T }>
}

type RequestSuccessResult = WechatMiniprogram.RequestSuccessCallbackResult<{
  code: number
  message: string
  data: any
}>

// 记录 loading 的状态
const loadingQueue: string[] = []

const http: Http = <T>(params: WechatMiniprogram.RequestOption, options = { showLoading: true }): Promise<T> => {
  // 处理基础路径
  if (!params.url.startsWith('http') && http.baseURL) {
    params.url = http.baseURL + params.url
  }

  // 调用拦截器处理请求数据
  params = http.intercept.request(params)

  // 记录请求开始的次量
  loadingQueue.push('loading')

  // 是否显示加载 loading
  if (options.showLoading && loadingQueue.length) wx.showLoading(http.loading)

  // 包装 Promise 对象
  return new Promise((resolve, reject) => {
    // 调用小程序 api
    wx.request({
      ...params,
      success: (result: RequestSuccessResult) => {
        // 调用拦截器处理响应数据
        resolve(http.intercept.response(result))
      },
      fail: reject,
      complete: () => {
        // 记录结束的请求数量
        loadingQueue.pop()

        // 关闭加载提示框
        if (!loadingQueue.length) wx.hideLoading()
      },
    })
  })
}

http.loading = {
  title: '正在加载...',
  mask: true,
}

http.intercept = {
  request: (params) => params,
  response: (result) => result,
}

http.get = <T = any>(url: string, data?: any) => {
  return http<{ code: number; message: string; data: T }>({ url, data, method: 'GET' })
}

http.post = <T = any>(url: string, data?: any) => {
  return http<{ code: number; message: string; data: T }>({ url, data, method: 'POST' })
}

http.put = <T = any>(url: string, data?: any) => {
  return http<{ code: number; message: string; data: T }>({ url, data, method: 'PUT' })
}

http.delete = <T = any>(url: string, data?: any) => {
  return http<{ code: number; message: string; data: T }>({ url, data, method: 'DELETE' })
}

// 配置开始 ----------------------------------------------------------

http.baseURL = 'https://live-api.itheima.net'

http.intercept.request = (params) => {
  // 读取本地存储的 token
  const token = getApp().token
  if (token) {
    // 添加 Authorization 头信息
    params.header = Object.assign({}, params.header, {
      Authorization: token,
    })
  }

  return params
}

http.intercept.response = ({ data }) => {
  if (data.code === 401) {
    // wx.navigateTo({ url: '/pages/login/index' })
  }
  return data
}

// 挂载到全局对象
wx.http = http

export { Http }
export default http
