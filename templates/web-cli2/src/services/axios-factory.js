import qs from 'qs'
import axios from 'axios'
let escape = window.escape

axios.defaults.baseURL = window.CONTEXT || 'context'
let reg = /^[\u0391-\uFFE5%]+$/
axios.interceptors.request.use((request) => {
  if (request.data && request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    request.data = qs.stringify(request.data, { allowDots: true })
  }
  if (request.method === 'get' && request.params) {
    let params = request.params
    for (let key in params) {
      let value = params[key]
      if (typeof value === 'string') {
        let newS = ''
        for (let i = 0; i < value.length; i++) {
          if (reg.test(value.charAt(i))) {
            newS += escape(value.charAt(i))
          } else {
            newS += value.charAt(i)
          }
        }
        params[key] = newS
      }
      params['t'] = new Date().getTime()
    }
  }
  return request
})

export function axiosFactory ({ method, url, params, data }) {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      params, // 不能再这里直接设置headers，会覆盖Authorization
      data
    }).then(({ data }) => {
      data.success ? resolve(data.data) : reject(data)
    }, (err) => {
      reject(err)
    }).catch((err) => {
      reject(err)
    })
  })
}

export function axiosPostFactory ({url, data}) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      data,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' } // 不同的项目可能这里不同，具体请百度Content-type相关
    }).then(({ data }) => {
      data.success ? resolve(data) : reject(data)
    }).catch((error) => {
      reject(error)
    })
  })
}
