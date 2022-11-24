Page({
  data: {
    point: '',
    size: 0,
    type: '',
  },

  onLoad({ point }: { point: string }) {
    // 伪造数进行渲染
    this.fake(point)
  },

  fake(point?: string) {
    // 伪造楼栋/号数据（仅用于授课）
    const size = Math.floor(Math.random() * 4) + 3
    const type = size > 4 ? '号楼' : '栋'
    // 更新数据，重新渲染
    this.setData({ point, size, type })
  },

  // 跳转页面
  goRoom(ev: WechatMiniprogram.CustomEvent) {
    // 小区名称
    const point = this.data.point
    // 小区楼栋号
    const building = ev.mark?.building
    // 跳转到下一页面
    wx.navigateTo({
      url: `/house_pkg/pages/room/index?point=${point}&building=${building}`,
    })
  },
})
