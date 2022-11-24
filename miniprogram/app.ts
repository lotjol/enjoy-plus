import './utils/utils'
import './utils/http'

interface AppOption {
  token?: string
  refresh_token?: string
  getToken(key: 'token' | 'refresh_token'): void
  setToken(token: string, refresh_token: string): void
}

// 初始化云开发环境
// wx.cloud.init({
//   env: 'enjoy-plus-2gvtgtlpd358838c',
// })

App<AppOption>({
  onLaunch() {
    // 获取本地存储的 token
    this.getToken('token')
    this.getToken('refresh_token')
  },
  /**
   * @param key 指定要读取的 token 类型
   */
  getToken(key) {
    this[key] = wx.getStorageSync(key)
  },
  /**
   *
   * @param token {string} 记录用户登录状态
   * @param refresh_token 刷新用户登录状态
   */
  setToken(token, refresh_token) {
    token = 'Bearer ' + token
    refresh_token = 'Bearer ' + refresh_token
    // 本地存储中记录token和refresh_token
    wx.setStorageSync('token', token)
    wx.setStorageSync('refresh_token', refresh_token)
    // 全局实例中列新 token 和 refresh_token
    this.token = token
    this.refresh_token = refresh_token
  },
})
