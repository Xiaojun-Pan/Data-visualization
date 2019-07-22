/**
 * 用户功能模块api
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例
import qs from 'qs'
const devicetypeinfo = {
  // 获取设备类型信息
  getDeviceType(params) {
    return axios.get(`${base.site}/devicetype.aspx?fun=gettype`, {
      params: params
    })
  },
  // 根据账号所属的组，获取组下的所有表单
  getDeviceTypeForm(params) {
    return axios.post(`${base.site}/devicetype.aspx?fun=getforminfo`, qs.stringify({ accound_Id: params }))
  },
  //  新增设备类型和绑定相应的表单
  createDeviceTypeForm(params) {
    return axios.post(`${base.site}/devicetype.aspx?fun=saveforminfo`, qs.stringify(params))
  },
  // 根据设备类型的ID，在eis_form_device_type表 查询绑定的表单信息
  getDeviceTypeBindForm(params) {
    return axios.post(`${base.site}/devicetype.aspx?fun=getformid`, qs.stringify({ device_type_Id: params }))
  },
  // 更新设备类型和绑定的表单
  updateDeviceTypeBindForm(params) {
    return axios.post(`${base.site}/devicetype.aspx?fun=putdevicetype`, qs.stringify(params))
  },
  // 根据device_type_Id 删除设备类型，如果设备类型绑定的设备，将无法删除
  delDeviceTypeForm(params) {
    return axios.post(`${base.site}/devicetype.aspx?fun=deldevicetype`, qs.stringify({ device_type_Id: params }))
  }
}

export default devicetypeinfo
