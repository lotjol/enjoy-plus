// 处理时的格式为 年/月/日
import formatDate from '../../../utils/format-date'

export default Behavior({
  data: {
    dateLayerVisible: false,
    houseLayerVisible: false,
    currentDate: 0,
    minDate: Date.now(),
    maxDate: Date.now() + 172800000,
  },

  methods: {
    selectHouse(ev: any) {
      const { id: roomId, name: roomName } = ev.detail
      this.setData({ roomId, roomName })
    },

    selectDate(ev: any) {
      this.setData({
        dateLayerVisible: false,
        currentDate: ev.detail,
        visitDate: formatDate(ev.detail),
      })
    },
    // 房屋组件
    openHouseLayer() {
      this.setData({ houseLayerVisible: true })
    },

    closeHouseLayer() {
      this.setData({ houseLayerVisible: false })
    },

    // 时间组件
    openDateLayer() {
      this.setData({ dateLayerVisible: true })
    },

    closeDateLayer() {
      this.setData({ dateLayerVisible: false })
    },
  },
})
