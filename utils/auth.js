import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
// const accoundKey = 'accound-id'

// export function getAccoundId() {
//   return Cookies.get(accoundKey)
// }
// export function setAccoundId(id) {
//   return Cookies.set(accoundKey, id)
// }
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
