Page({
  async onLoad({ id }: any) {
    if (id) return this.getHouseDetail(id)
    // 没有 id 无法查询房屋信息
    wx.showToast({ title: '获取房屋信息失败!', icon: 'none' })
  },

  // 房屋信息
  async getHouseDetail(id: string) {
    // 请求数据接口
    const { code } = await wx.http.get('/room/' + id)
    // 校验数据是否合法
    if (code !== 10000) return wx.showToast({ title: '获取数据失败, 请稍候重试!', icon: 'none' })

    // 渲染房屋信息
    // this.setData()
  },

  // 页面跳转
  editHouse() {
    wx.navigateTo({
      url: `/house_pkg/pages/form/index?id=${this.data.id}`,
    })
  },
})

export {}
