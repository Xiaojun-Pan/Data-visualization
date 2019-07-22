import request from '@/utils/http'
import base from './base' // 导入接口域名列表
import Qs from 'qs'
import { encrypt } from '@/utils/crypto' // AES 加密解密模块

export function login(data) {
  return request({
    url: `${base.api}/login.aspx`,
    method: 'post',
    data: Qs.stringify(data) // 这里不做转换后台API没法从Form data里面取值
  })
}

// 获取员工信息
export function getInfo(token) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    // params: { token }
    params: { func: encrypt('GetUserInfo'), param: encrypt(token) }
  })
}

// 获取系统用户清单
export function getUsers(token) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    params: { func: encrypt('GetUsers'), param: encrypt(token) }
  })
}

// 获取系统角色清单及其对应功能
export function getRoles(token) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    params: { func: encrypt('GetRoles'), param: encrypt(token) }
  })
}

// 获取系统功能定义清单
export function getFunctions(token) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    params: { func: encrypt('GetFunctions'), param: encrypt(token) }
  })
}

// 增加角色及其功能清单
export function addRole(params) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    params: { func: encrypt('AddRole'), param: encrypt(params) }
  })
}

// 更新角色及其功能清单
export function updateRole(params) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    params: { func: encrypt('UpdateRole'), param: encrypt(params) }
  })
}

// 删除角色及其功能清单
export function deleteRole(params) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    params: { func: encrypt('DeleteRole'), param: encrypt(params) }
  })
}

// 增加功能代码
export function addFunction(params) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    params: { func: encrypt('AddFunction'), param: encrypt(params) }
  })
}

// 更新功能代码
export function updateFunction(params) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    params: { func: encrypt('UpdateFunction'), param: encrypt(params) }
  })
}

// 更新功能代码
export function deleteFunction(params) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    params: { func: encrypt('DeleteFunction'), param: encrypt(params) }
  })
}

// 增加用户
export function addUser(params) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    params: { func: encrypt('AddUser'), param: encrypt(params) }
  })
}

// 更新用户
export function updateUser(params) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    params: { func: encrypt('UpdateUser'), param: encrypt(params) }
  })
}

// 删除用户
export function deleteUser(params) {
  return request({
    url: `${base.api}/info.aspx`,
    method: 'get',
    params: { func: encrypt('DeleteUser'), param: encrypt(params) }
  })
}

export function logout() {
  return request({
    url: `${base.api}/logout.aspx`,
    method: 'post'
  })
}
