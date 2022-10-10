interface Point {
  id: string
  title: string
  _distance: string
}

// 腾讯地图sdk（小程序版）
import qqMap from '../../../utils/qqmap'

Page({
  data: {
    address: '',
    points: [] as Point[],
  },
  async onLoad() {
    // 获取当前位置经纬度，然后查找小区位置信息
    this.getLocation()
  },

  // 获取地址（经纬度）
  async getLocation() {
    try {
      // 获取当前位置经纬度
      const { latitude, longitude } = await wx.getLocation({})
      // 获取小区地点信息
      this.getPoint(latitude, longitude)
    } catch {
      wx.showToast({ title: '获取位置失败, 请稍后重试!', icon: 'none' })
    }
  },

  // 重新选择地址（经纬度）
  async chooseLocation() {
    try {
      // 获取当前位置经纬度
      const { latitude, longitude } = await wx.chooseLocation({})
      // 获取小区地点信息
      this.getPoint(latitude, longitude)
    } catch {
      wx.showToast({ title: '获取位置失败, 请稍后重试!', icon: 'none' })
    }
  },

  // 根据经纬度获取小区信息
  getPoint(latitude: number, longitude: number) {
    // 显示加载状态
    wx.showLoading({ title: '正在加载...', mask: true })

    // 逆地址解析（根据经纬度解析位置信息）
    qqMap.reverseGeocoder({
      location: [latitude, longitude].join(','),
      success: ({ result: { address } }: any) => {
        // 更新数据，重新渲染
        this.setData({ address })
      },
    })

    // 调用腾讯地址sdk
    qqMap.search({
      keyword: '住宅小区',
      location: [latitude, longitude].join(','),
      page_size: 5,
      success: (res: any) => {
        // 处理得到的地点信息（过滤掉多余数据）
        const points: Point[] = []
        res.data.forEach(({ id, title, _distance }: any) => {
          points.push({ id, title, _distance })
        })

        // 更新数据，重新渲染
        this.setData({ points })
      },
      fail(err: any) {
        console.log(err)
        wx.showToast({ title: '没有找附近的小区!', icon: 'none' })
      },
      complete: () => {
        // 隐藏加载状态
        wx.hideLoading()
      },
    })
  },

  // 跳转页面
  goBuilding(ev: WechatMiniprogram.CustomEvent) {
    wx.navigateTo({
      url: '/house_pkg/pages/building/index?point=' + ev.mark?.point,
    })
  },
})

export {}
