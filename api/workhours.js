/**
 * 用户功能模块api
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例
import { encrypt } from '@/utils/crypto' // AES 加密解密模块

const workhours = {
  // 获取部门编号
  getdepaInfo() {
    return axios.get(`${base.api}/workhour.aspx`, {
      params: { func: encrypt('GetDepartmentList'), param: encrypt('{}') }
    })
  },
  // 根据部工和选择的日期范围汇总
  getSummaryInfo(param) {
    return axios.get(`${base.api}/workhour.aspx`, {
      params: { func: encrypt('GetSummary'), param }
    })
  },
  // 根据部工和选择的日期范围汇总
  GetDepartmentDetail(params) {
    return axios.get(`${base.api}/workhour.aspx`, {
      params: { func: encrypt('GetDepartmentDetail'), param: encrypt(params) }
    })
  },
  // 根据工号和选择的日期范围查询员工详细工时信息
  getPersonDetail(params) {
    return axios.get(`${base.api}/workhour.aspx`, {
      params: { func: encrypt('GetPersonDetail'), param: encrypt(params) }
    })
  },
  GetPerato(params) {
    return axios.get(`${base.api}/workhour.aspx`, {
      params: { func: encrypt('GetPerato'), param: encrypt(params) }
    })
  }
}
export default workhours
