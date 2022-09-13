// map.js
Page({
  data: {
    latitude: 40.060539,
    longitude: 116.343847,
    polyline: {
      points: [
        {
          latitude: 40.060539,
          longitude: 116.343847,
        },
        {
          latitude: 40.13012,
          longitude: 116.65477,
        },
      ],
    },
  },

  async test() {
    const { latitude, longitude } = await wx.getLocation({})

    console.log(latitude, longitude)

    wx.chooseLocation({
      latitude: 40.13012,
      longitude: 116.65477,
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.log(err)
      },
    })
  },
})
