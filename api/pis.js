/**
 * pis模块接口列表
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例
import { encrypt } from '@/utils/crypto' // AES 加密解密模块
// import qs from 'qs' // 根据需求是否导入qs模块

const pis = {
  // 产线列表
  fetchLine() {
    return axios.get(`${base.api}/dashboard.aspx`, {
      params: { func: encrypt('GetMesInfo') }
    })
  },
  // 产线详情
  fetchLineStatus(params) {
    return axios.get(`${base.api}/dashboard.aspx`, {
      params: { func: encrypt('GetLineStatus'), param: encrypt(params) }
    })
  },
  // PIS区域列表
  fetchArea() {
    return axios.get(`${base.api}/pisboard.aspx`, {
      params: { func: encrypt('GetArea') }
    })
  },
  // 区域机台坐标
  fetchAreaStationCoordinate(params) {
    return axios.get(`${base.api}/pisboard.aspx`, {
      params: {
        func: encrypt('GetAreaStationCoordinate'),
        param: encrypt(params)
      }
    })
  },
  // 区域详情
  fetchAreaStatus(params) {
    return axios.get(`${base.api}/pisboard.aspx`, {
      params: { func: encrypt('GetStationStatus'), param: encrypt(params) }
    })
  },
  // 区域产出
  fetchAreaThroughputAndYield(params) {
    return axios.get(`${base.api}/pisboard.aspx`, {
      params: { func: encrypt('GetThroughput'), param: encrypt(params) }
    })
  },
  // SMT OEE
  fetchSMTOEE() {
    return axios.get(`${base.api}/pisboard.aspx`, {
      params: { func: encrypt('GetSMTDailyOEE') }
    })
  },
  // post提交
  // login(params) {
  //   return axios.post(`${base.sq}/accesstoken`, qs.stringify(params))
  // }

  fetchEmpInfo(params) {
    return axios.get(`${base.api}/hcp.aspx`, {
      params: params
    })
  }
}

export default pis
