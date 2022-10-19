Page({
  data: {
    dateLayerVisible: false,
    houseLayerVisible: false,
    houseList: [
      { name: '北京西三旗花园1号楼 101' },
      { name: '北京东村家园3号楼 302' },
      { name: '北京育新花园3号楼 703' },
      { name: '北京天通苑北苑8号楼 403' },
    ],
  },
  openHouseLayer() {
    this.setData({ houseLayerVisible: true })
  },
  closeHouseLayer() {
    this.setData({ houseLayerVisible: false })
  },
  openDateLayer() {
    this.setData({ dateLayerVisible: true })
  },
  closeDateLayer() {
    this.setData({ dateLayerVisible: false })
  },
  goPassport() {
    wx.reLaunch({
      url: '/visitor_pkg/pages/passport/index',
    })
  },
})
