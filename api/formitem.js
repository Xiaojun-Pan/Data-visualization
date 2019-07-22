/**
 * 用户功能模块api
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例
import qs from 'qs'
const formiteminfo = {
  // 根据工号，所属的组列出所有表单项目
  getformitem(params) {
    return axios.get(`${base.site}/formitem.aspx?fun=getformitem`, {
      params: params
    })
  },
  //  新增表单作业项目
  createformitem(params) {
    return axios.post(`${base.site}/formitem.aspx?fun=saveformitem`, qs.stringify(params))
  },
  // 更新记录
  updateFormItem(params) {
    return axios.post(`${base.site}/formitem.aspx?fun=updateformitem`, qs.stringify(params))
  },
  // 删除记录
  delFormItem(params) {
    return axios.post(`${base.site}/formitem.aspx?fun=delformitem`, qs.stringify({ item_id: params }))
  }
}

export default formiteminfo
