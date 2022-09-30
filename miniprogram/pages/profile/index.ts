Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
  },

  getUserAvatar(ev: WechatMiniprogram.CustomEvent) {
    this.updateUserInfo({ avatar: ev.detail.avatarUrl })
  },

  getUserNickName(ev: any) {
    this.updateUserInfo({ nickName: ev.detail })
  },

  updateUserInfo(userInfo: { avatar?: string; nickName?: string }) {
    wx.uploadFile({
      url: 'https://live-api.itheima.net/userInfo',
      name: 'avatar',
      filePath: userInfo.avatar as string,
      formData: { nickName: userInfo.nickName },
    })
  },
})

export {}
