// 表单验证插件
import validate from 'wechat-validate'

// 记录短信验证码
let secret_code: string
// 获取全局实例
const app = getApp()
Page({
  behaviors: [validate],
  data: {
    mobile: '',
    code: '',
    redirectURL: '',
    countDownVisible: false,
  },
  rules: {
    mobile: [
      { required: true, message: '请填写手机号码!' },
      { pattern: /^1[3-8]\d{9}$/, message: '请填写正确的手机号码!' },
    ],
    code: [
      { required: true, message: '请填写短信验证码!' },
      { pattern: /^\d{6}$/, message: '请检查验证码是否正确!' },
    ],
  },
  onLoad(query: { redirectURL: string }) {
    // 获取地址参数（登录成功后跳转）
    const { redirectURL } = query
    // 保存当前页面的路径
    this.setData({ redirectURL })
  },

  // 登录/注册
  async login() {
    // 验证手机号和验证短信验证码是否合法
    if (!this.validate()) return

    // 用户填写的手机号和验证码
    const { mobile, code } = this.data
    // 调用接口登录/注册
    const res = await wx.http.post('/login', { mobile, code })
    // 校验数据是否合法
    if (res.code !== 10000) return wx.utils.toast('请检查验证码是否正确!')

    // 本地存储 token 和 refresh_token
    app.setToken(res.data.token, res.data.refresh_token)
    // 跳转至登录前的页面
    wx.redirectTo({
      url: this.data.redirectURL,
    })
  },

  // 获取短信验证码
  async getCode() {
    // 验证手机号是否合法
    const { valid, message } = this.validate('mobile')
    if (!valid) return wx.utils.toast(message)

    // 用户填写的手机号码
    const mobile = this.data.mobile.trim()
    // 调用接口请求发送短信验证码
    const { code, data } = await wx.http.get('/code', { mobile })
    // 检测接口返回的结果
    if (code !== 10000) return wx.utils.toast()

    // 发送验证码成功
    wx.utils.toast('发送成功, 请查收短信!')
    // 记录验证码为下一步复制准备
    secret_code = data.code
    // 开始倒计时
    this.setData({ countDownVisible: true })
  },

  // van-countdown 倒计时状态
  countDownChange(ev: any) {
    this.setData({
      timeData: ev.detail,
      countDownVisible: ev.detail.minutes === 1 || ev.detail.seconds > 0,
    })
  },

  // 复制验证码
  copyCode() {
    wx.setClipboardData({ data: secret_code })
  },
})

export {}
