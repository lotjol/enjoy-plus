// 引入 behavior
import behavior from './behavior'

Page({
  behaviors: [behavior],
  data: {
    houseList: [
      { id: '1', name: '北京西三旗花园1号楼 101' },
      { id: '2', name: '北京东村家园3号楼 302' },
    ],

    repairItems: [
      { id: '1', name: '水路卫浴' },
      { id: '2', name: '电路灯具' },
      { id: '3', name: '管道疏通' },
      { id: '4', name: '开锁换锁' },
    ],

    fileList: [
      { url: '/repair_pkg/static/uploads/attachment.jpg' },
      { url: '/repair_pkg/static/uploads/attachment.jpg' },
    ],
    roomName: '请选择房屋信息',
    repairItemName: '请选择维修项目',

    roomId: '',
    repairItemCode: '',
    appointment: '请选择上门维修日期',
    mobile: '',
    description: '',
  },

  submitForm() {
    console.log(1111)
  },
})
