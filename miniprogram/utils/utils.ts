interface Utils {
  toast(title?: string): void
  formatDate(timestamp: number): string
}

/**
 * 封装一些常用的方法
 */
const utils: Utils = {
  /**
   * 用户消息反馈
   * @param title 文字提示的内容
   */
  toast(title = '数据加载失败...') {
    wx.showToast({
      title,
      mask: true,
      icon: 'none',
    })
  },
  /**
   * 处理日期显示格式：年/月/日
   * @param timestamp 时间戳
   * @returns
   */
  formatDate(timestamp: number) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map((item) => item.toString().padStart(2, '0')).join('/')
  },
}

// 挂载到 wx 对象上
wx.utils = utils

// 作为模块导出
export default utils

export type { Utils }
