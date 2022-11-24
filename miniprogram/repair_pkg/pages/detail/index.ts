interface Attachment {
  id: string
  url: string
}

// 腾讯地图sdk（小程序版）
import qqMap from '../../../utils/qqmap'

// 记录当前报修信息id
let repair_id: string | undefined
Page({
  data: {
    dialogVisible: false,
    attachment: [] as Attachment[],
    markers: [
      {
        id: 1,
        latitude: 40.086757,
        longitude: 116.328634,
        width: 24,
        height: 30,
      },
      {
        id: 2,
        latitude: 40.08346500000002,
        longitude: 116.33293800000011,
        iconPath: '/static/images/marker.png',
        width: 40,
        height: 40,
      },
    ],
  },

  onLoad({ id }: any) {
    // 获取维修详情
    this.getRepairDetail((repair_id = id))
    // 规则上门路线
    this.createPolyLine()
  },

  async getRepairDetail(id?: string) {
    // id 不存在就不必发请求了
    if (!id) return

    // 请求数据接口
    const { code, data: repairDetail } = await wx.http.get('/repair/' + id)
    // 校验接口调用结果
    if (code !== 10000) return wx.utils.toast('获取报修详情失败!')
    // 渲染报修详情
    this.setData({ ...repairDetail })
  },

  editRepair() {
    wx.navigateTo({
      url: '/repair_pkg/pages/form/index?id=' + repair_id,
    })
  },

  createPolyLine() {
    //调用距离计算接口
    qqMap.direction({
      mode: 'bicycling',
      //from参数不填默认当前地址
      from: '40.060539,116.343847', // 传智播客
      to: '40.086757,116.328634', // （示例）云趣园1区
      success: (res: any) => {
        const coords = res.result.routes[0].polyline
        const points = []

        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        for (let i = 2; i < coords.length; i++) {
          coords[i] = Number(coords[i - 2]) + Number(coords[i]) / 1000000
        }

        //将解压后的坐标放入点串数组pl中
        for (let i = 0; i < coords.length; i += 2) {
          // @ts-ignore
          points.push({ latitude: coords[i], longitude: coords[i + 1] })
        }

        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        this.setData({
          polyline: [
            {
              points,
              color: '#5591af',
              width: 4,
            },
          ],
        })
      },
      fail: function (error: any) {
        console.error(error)
      },
    })
  },

  openDialogLayer() {
    // 显示确认弹框
    this.setData({ dialogVisible: true })
  },

  closeDialogLayer(ev: any) {
    // 选择了确认后取消报修
    if (ev.detail === 'confirm') this.cancelRepair()
  },

  async cancelRepair() {
    // 请求数据接口
    const { code } = await wx.http.put('/cancel/repaire/' + repair_id)
    // 检测接口的调用结果
    if (code !== 10000) return wx.utils.toast('取消报修失败!')
    // 跳转到报修列表页面
    wx.navigateBack()
  },

  previewImage(ev: WechatMiniprogram.CustomEvent) {
    // 获取全部的图片地址
    const urls = this.data.attachment.map((item) => item.url)
    // 大图预览图片
    wx.previewImage({ urls, current: ev.mark?.src })
  },
})
