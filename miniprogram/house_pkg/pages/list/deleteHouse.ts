// 记录当前要删除的房屋id
let house_id = ''
let house_index = ''

export default Behavior({
  data: {
    dialogVisible: false,
  },
  methods: {
    // 删除房屋
    async deleteHouse() {
      // 请求数据接口
      const { code } = await wx.http.delete('/room/' + house_id)
      // 检测接口调用结果
      if (code !== 10000) return wx.showToast({ title: '删除房屋失败!', icon: 'none' })

      // 更新房屋列表
      this.data.houseList.splice(house_index, 1)
      this.setData({
        houseList: this.data.houseList,
        isEmpty: this.data.houseList.length === 0,
      })
    },

    swipeClose(ev: any) {
      const { instance } = ev.detail
      // 显示 Dialog 对话框
      this.setData({ dialogVisible: true })

      // 待删除的房屋id和索引
      house_id = ev.mark.id
      house_index = ev.mark.index
      // swiper-cell 滑块关闭
      instance.close()
    },

    dialogClose(ev: any) {
      // 选择了确认后删除房屋
      if (ev.detail === 'confirm') this.deleteHouse()
    },
  },
})
