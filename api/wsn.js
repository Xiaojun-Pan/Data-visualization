/**
 * wsn模块接口列表
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例
import { encrypt } from '@/utils/crypto' // AES 加密解密模块
// import qs from 'qs' // 根据需求是否导入qs模块

const wsn = {
  // 区域列表
  fetchArea() {
    return axios.get(`${base.api}/wsn.aspx`, {
      params: { func: encrypt('GetAreaList') }
    })
  },
  // 区域背景图
  fetchAreaImage(params) {
    return axios.get(`${base.api}/wsn.aspx`, {
      params: { func: encrypt('GetAreaBackground'), param: encrypt(params) }
    })
  },
  // 区域节点状态
  fetchAreaNodeStatus(params) {
    return axios.get(`${base.api}/wsn.aspx`, {
      params: { func: encrypt('GetAreaNodeStatus'), param: encrypt(params) }
    })
  }
  // post提交
  // login(params) {
  //   return axios.post(`${base.sq}/accesstoken`, qs.stringify(params))
  // }
}

export default wsn
