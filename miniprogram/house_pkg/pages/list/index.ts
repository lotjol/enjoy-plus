import Dialog from '@vant/weapp/dialog/dialog'

Page({
  onClosed(ev: any) {
    const { position, instance } = ev.detail

    if (position === 'right') {
      Dialog.confirm({
        message: '是否删除已绑定房屋？',
      })
        .then(() => {
          instance.close()
        })
        .catch(() => {
          instance.close()
        })
    }
  },

  goDetail() {
    wx.navigateTo({
      url: '/house_pkg/pages/detail/index',
    })
  },

  addHouse() {
    wx.navigateTo({
      url: '/house_pkg/pages/form/index',
    })
  },
})
