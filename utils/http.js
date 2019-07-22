/** axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { encrypt, decrypt } from '@/utils/crypto' // AES 加密解密模块

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = msg => {
  Message({
    message: msg,
    type: 'error',
    duration: 5 * 1000
  })
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
// const toLogin = () => {
//   Router.replace({
//     path: '/login',
//     query: {
//       redirect: Router.currentRoute.fullPath
//     }
//   })
// }

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
// const errorHandle = (status, other) => {
//   // 状态码判断
//   switch (status) {
//     // 401: 未登录状态，跳转登录页
//     case 401:
//       toLogin()
//       break
//     // 403 token过期
//     // 清除token并跳转登录页
//     case 403:
//       tip('登录过期，请重新登录')
//       localStorage.removeItem('token')
//       store.commit('loginSuccess', null)
//       setTimeout(() => {
//         toLogin()
//       }, 1000)
//       break
//     // 404请求不存在
//     case 404:
//       tip('请求的资源不存在')
//       break
//     default:
//       console.log(other)
//   }
// }

// 创建axios实例
var instance = axios.create({
  timeout: 1000 * 15
})

// 设置post请求头,
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;'

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    // do something before request is sent
    // console.log(store.getters.token)
    if (store.getters.token) {
      // let each request carry token --['X-Token'] as a custom key.
      // please modify it according to the actual situation.
      // Token加密
      config.headers['X-Token'] = encrypt(getToken())
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code.
   */
  response => {
    // const res = response.data
    var res = JSON.parse(decrypt(response.data))
    // if the custom code is not 1, it is judged as an error.
    // 如果是EIS模块 解密后直接返回JSON
    if (Object.keys(res).length < 4) {
      if (res.code !== '1') {
        tip(res.msg)
        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
          // to re-login
          MessageBox.confirm(
            'You have been logged out, you can cancel to stay on this page, or log in again',
            'Confirm logout',
            {
              confirmButtonText: 'Re-Login',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }
          ).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
        return Promise.reject(res.msg || 'error11')
      } else {
        return res
      }
    } else {
      return JSON.parse(decrypt(response.data))
    }
  },
  error => {
    console.log('err' + error) // for debug
    tip(error.message)
    return Promise.reject(error)
  }
)

// 响应拦截器
// instance.interceptors.response.use(
//   // 请求成功
//   res => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
//   // 请求失败
//   error => {
//     const { response } = error
//     if (response) {
//       // 请求已发出，但是不在2xx的范围
//       errorHandle(response.status, response.data)
//       return Promise.reject(response)
//     } else {
//       // 处理断网的情况
//       // eg:请求超时或断网时，更新state的network状态
//       // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
//       // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
//       store.commit('changeNetwork', false)
//     }
//   }
// )

export default instance

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      // .post(url, QS.stringify(params))
      .post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
