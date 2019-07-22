/**
 * 用户功能模块api
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例
import qs from 'qs'

const reportinfo = {
  // 列出报表
  getReportInfo(params) {
    return axios.post(`${base.site}/report.aspx?fun=getreport`, qs.stringify(params))
  },
  // 获取表单模板信息
  getTemplateInfo(params) {
    return axios.post(`${base.site}/report.aspx?fun=getTemplateInfo`, qs.stringify({ from_Id: params }))
  }
}
export default reportinfo
