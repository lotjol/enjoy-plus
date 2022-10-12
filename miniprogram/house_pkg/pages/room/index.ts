// house_pkg/pages/room/index.ts

Page({
  data: {
    rooms: [] as string[],
    point: '',
    building: '',
  },
  onLoad({ point, building }) {
    // 伪造数据进行渲染
    this.fake(point, building)
  },

  fake(point?: string, building?: string) {
    // 伪造房间号数据（仅用于授课）
    const size = Math.floor(Math.random() * 5) + 4
    const rooms: string[] = []

    // 随生生成若干个房间号
    for (let i = 0; i < size; i++) {
      const floor = Math.floor(Math.random() * 20) + 1
      const No = Math.floor(Math.random() * 3) + 1
      const room = [floor, 0, No].join('')
      // 不允许重复的房间号
      if (rooms.includes(room)) continue
      // 记录房间号
      rooms.push(room)
    }

    // 更新数据，重新渲染
    this.setData({ rooms, point, building })
  },

  // 页面跳转
  goForm(ev: WechatMiniprogram.CustomEvent) {
    wx.navigateTo({
      url: `/house_pkg/pages/form/index?point=${this.data.point}&building=${this.data.building}&room=${ev.mark?.room}`,
    })
  },
})

export {}
