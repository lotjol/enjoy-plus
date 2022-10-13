// 记录短信验证码
let hole_code: string
let clickable = true

// 获取全局实例
const app = getApp()

Page({
  data: {
    mobile: '',
    code: '',
    redirectURL: '',
    countDownVisible: false,
  },
  onLoad(query) {
    // 获取地址参数（登录成功后跳转）
    const { redirectURL } = query
    // 保存当前页面的路径
    this.setData({ redirectURL })
  },

  // 登录/注册
  async login() {
    // 验证手机号是否合法
    if (!this.verifyMobile()) return
    // 验证短信验证码是否合法
    if (!this.verifyCode()) return

    // 用户填写的手机号和验证码
    const { mobile, code } = this.data

    // 调用接口登录/注册
    const res = await wx.http.post('/login', { mobile, code })
    // 校验数据是否合法
    if (res.code !== 10000) return wx.showToast({ title: '请检查验证码是否正确!', icon: 'none' })

    // 本地存储 token 和 refresh_token
    wx.setStorageSync('token', 'Bearer ' + res.data.token)
    wx.setStorageSync('refresh_token', 'Bearer ' + res.data.refreshToken)

    // 更新全局 token 和 refresh_token
    app.token = 'Bearer ' + res.data.token
    app.refresh_token = 'Bearer ' + res.data.refreshToken

    // 跳转至登录前的页面
    wx.redirectTo({
      url: this.data.redirectURL,
    })
  },

  // 获取短信验证码
  async getCode() {
    // 验证手机号是否合法
    if (!this.verifyMobile()) return

    if (!clickable) return
    clickable = false

    this.setData({ disabled: true })

    // 用户填写的手机号码
    const mobile = this.data.mobile.trim()
    // 调用接口请求发送短信验证码
    const { code, data } = await wx.http.get('/code', { mobile })

    clickable = true

    // 验证是否发送成功
    if (code !== 10000) {
      wx.showToast({ title: '发送失败, 请稍后重试!', icon: 'none' })
    } else {
      wx.showToast({ title: '发送成功, 请查收短信!', icon: 'none' })
      // 保存短信验证码用于内部测试
      hole_code = data.code

      this.setData({ countDownVisible: true })
    }
  },

  countDownChange(ev: any) {
    this.setData({
      timeData: ev.detail,
      countDownVisible: ev.detail.minutes === 1 || ev.detail.seconds > 0,
    })
  },

  copyCode() {
    wx.setClipboardData({ data: hole_code })
  },

  // 验证手机号
  verifyMobile() {
    // 定义正则表达式验证手机号码（简单验证）
    const reg = /^[1][3-8][0-9]{9}$/
    // 用户填写的手机号
    const mobile = this.data.mobile
    // 正则验证码
    const valid = reg.test(mobile.trim())
    // 验证结果提示
    if (!valid) wx.showToast({ title: '请填写正确的手机号码!', icon: 'none' })
    // 返回验证结果
    return valid
  },

  // 验证短信验证码
  verifyCode() {
    // 定义正则表达式验证短信验证码
    const reg = /^\d{6}$/
    // 用户填写的短信验证码
    const code = this.data.code
    // 正则验证
    const valid = reg.test(code.trim()) // 验证对果提示
    // 验证结果提示
    if (!valid) wx.showToast({ title: '请检查验证码是否正确!', icon: 'none' })

    // 返回验证结果
    return valid
  },
})

export {}
