/**
 * 用户功能模块api
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例
import qs from 'qs'
const formtemplate = {
  // 获取表单模板信息
  getformtemplate(params) {
    return axios.get(`${base.site}/formtemplate.aspx?fun=getfrom`, {
      params: params
    })
  },
  // 获取表单点检周期
  getformcycleInfo() {
    return axios.get(`${base.site}/formtemplate.aspx?fun=getformcycle`)
  },
  //  新增表单模板记录
  createFormTemplate(params) {
    return axios.post(`${base.site}/formtemplate.aspx?fun=postform`, qs.stringify(params))
  },
  // 更新表单模板
  updateFormTemplate(params) {
    return axios.post(`${base.site}/formtemplate.aspx?fun=putform`, qs.stringify(params))
  },
  // 删除表单模板
  deleteFormTemplate(params) {
    return axios.post(`${base.site}/formtemplate.aspx?fun=delform`, qs.stringify({ form_Id: params }))
  },
  // 获取作业的项目根据工号
  getFormItem(params) {
    return axios.post(`${base.site}/formtemplate.aspx?fun=getformitem`, qs.stringify({ accound_Id: params }))
  },
  // 根据表单编号查询已关联的作业项目
  getSelectedItem(params) {
    return axios.post(`${base.site}/formtemplate.aspx?fun=getSelectedItem`, qs.stringify({ form_id: params }))
  },
  saveSelectedItem(formid, params) {
    return axios.post(`${base.site}/formtemplate.aspx?fun=saveSelectedIte`, qs.stringify({ formid: formid, itemarray: params }))
  }
}

export default formtemplate
