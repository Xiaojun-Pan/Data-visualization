/**
 * 用户功能模块api
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例
import qs from 'qs'
const deviceInfo = {
  // 获取用户信息
  getDevicecInfo(params) {
    return axios.get(`${base.site}/Device_Info.aspx`, {
      params: params
    })
  },
  // 获取设备类型信息
  getDeviceTypeInfo() {
    return axios.get(`${base.site}/getDeviceType.aspx`)
  },
  // 获取部门信息
  getDepartmentInfo() {
    return axios.get(`${base.site}/getDepartment.aspx`)
  },
  // 设备注册
  createDeviceInfo(params) {
    return axios.post(`${base.site}/createDeviceInfo.aspx`, qs.stringify(params))
  },
  // 更新设备
  updateDeviceInfo(params) {
    return axios.post(`${base.site}/editDeviceInfo.aspx?fun=update`, qs.stringify(params))
  },
  // 删除设备
  deleteDeviceInfo(params) {
    return axios.post(`${base.site}/editDeviceInfo.aspx?fun=del`, qs.stringify({ device_serial_number: params }))
  },
  // 获取设备的SerialNumber，code:2 存在，code:1 不存在，code:0 错误
  getSerialNumber(params) {
    return axios.post(`${base.site}/editDeviceInfo.aspx?fun=getserialnumber`, qs.stringify({ serialnumber: params }))
  }
}

export default deviceInfo
