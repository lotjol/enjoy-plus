Page({
  data: {
    isLogin: !!getApp().token,
    encryptedData: '',
    url: '',
  },
  onLoad({ id, encrypt }: any) {
    // 查看通行证
    this.getPassport(id)
    this.getPassport2(encrypt)
  },

  async getPassport(id?: string) {
    if (!id) return
    // 请求数据接口
    const { code, data: passport } = await wx.http.get('/visitor/' + id)
    // 检测接口调用的结果
    if (code !== 10000) return wx.showToast({ title: '获取通行证失败!', icon: 'none' })

    // 渲染通行证
    this.setData({ ...passport })
  },

  async getPassport2(encrypt: string) {
    if (!encrypt) return
    const { code, data: passport } = await wx.http.get('/visitor/share/' + encrypt)

    // 检测接口调用的结果
    if (code !== 10000) return wx.showToast({ title: '获取通行证失败!', icon: 'none' })

    // 渲染通行证
    this.setData({ ...passport })
  },

  onShareAppMessage() {
    return {
      title: '查看通行证',
      path: '/visitor_pkg/pages/passport/index?encrypt=' + this.data.encryptedData,
      imageUrl: 'https://enjoy-plus.oss-cn-beijing.aliyuncs.com/images/share_poster.png',
    }
  },

  async saveQRCode() {
    try {
      // 读取网络图片信息
      const { path } = await wx.getImageInfo({
        src: this.data.url,
      })

      // 保存图片到本地
      await wx.saveImageToPhotosAlbum({
        filePath: path,
      })

      // 提示信息
      wx.showToast({ title: '已将二维码保存到相册!', icon: 'none' })
    } catch {
      console.log('...')
    }
  },
})
