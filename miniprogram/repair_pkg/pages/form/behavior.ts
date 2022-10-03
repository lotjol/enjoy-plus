// 处理时的格式为 年/月/日
import formatDate from '../../../utils/format-date'

export default Behavior({
  data: {
    houseLayerVisible: false,
    repairLayerVisible: false,
    dateLayerVisible: false,
    currentDate: new Date().getTime(),
    minDate: Date.now(),
  },

  methods: {
    selectHouse(ev: any) {
      const { id: roomId, name: roomName } = ev.detail
      this.setData({ roomId, roomName })
    },

    selectRepairItem(ev: any) {
      const { id: repairItemCode, name: repairItemName } = ev.detail
      this.setData({ repairItemCode, repairItemName })
    },

    selectDate(ev: any) {
      this.setData({
        dateLayerVisible: false,
        currentDate: ev.detail,
        appointment: formatDate(ev.detail),
      })
    },

    openHouseLayer() {
      this.setData({ houseLayerVisible: true })
    },

    closeHouseLayer() {
      this.setData({ houseLayerVisible: false })
    },

    openRepairLayer() {
      this.setData({ repairLayerVisible: true })
    },

    closeRepairLayer() {
      this.setData({ repairLayerVisible: false })
    },

    openDateLayer() {
      this.setData({ dateLayerVisible: true })
    },

    closeDateLayer() {
      this.setData({ dateLayerVisible: false })
    },
  },
})
