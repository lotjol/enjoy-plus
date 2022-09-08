import Dialog from '@vant/weapp/dialog/dialog'

Page({
  swipeClosed(ev: any) {
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
})
