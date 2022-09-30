Page({
  onLoad({ point, building, room }: any) {
    // 获取地址参数（房屋部分信息）
    this.setData({ point, building, room })
  },
})
