// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async () => {
  try {
    const result = await cloud.openapi.wxacode.createQRCode({
      path: 'page/index/index',
      width: 430,
    })
    return result
  } catch (err) {
    return err
  }
}
