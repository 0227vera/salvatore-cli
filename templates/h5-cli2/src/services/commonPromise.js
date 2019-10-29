import store from '../assets/js/storage.js'
const axios = window.axios // eslint-disable-line
/**
 * service中统一处理。如果要每个接口单独处理缓存就不要使用这个了
 * @param  {[type]} url [description]
 * @param {number} storeMode 模式 - 1 表示将接口缓存到session中. 2 表示带有过期时间的模式
 * @param {number} expire 过期时间(秒)。模式为2时需要
 * @return {[type]}     [description]
 */
export default function (url, storeMode, expire) {
  return new Promise((resolve, reject) => {
    let data = ''
    if (storeMode === 1) {
      data = store.getHash(url)
    } else if (storeMode === 2) {
      data = store.getExpireHash(url)
    }
    if (data) {
      resolve(data)
      return
    }
    axios.get(url)
      .then(({data}) => {
        if (storeMode === 1) {
          store.setHash(url, data)
        } else if (storeMode === 2) {
          store.setExpireHash(url, data, expire)
        }
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function axiosPostFactory ({ url, data, headers = { 'Content-Type': 'application/x-www-form-urlencoded' } }) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      data,
      headers: headers // 不同的项目可能这里不同，具体请百度Content-type相关
    }).then(({ data }) => {
      data.success ? resolve(data) : reject(data)
    }).catch((error) => {
      reject(error)
    })
  })
}
