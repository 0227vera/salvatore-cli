// 将指定的值缓存到sessionStorage中
import stringUtil from './hashUtil'

// 如果是隐私模式，不知道sessionStorage.使用全局变量。（待测试）
if (!isLocalStorageSupported()) {
  window.sessionStorage = {
    values: {},
    setItem (key, val) {
      this.values[key] = val
    },
    getItem (key) {
      return this.values[key]
    },
    removeItem (key) {
      this.values[key] = undefined
    }
  }
}

export default {
  /**
   * 设置到sessionStorage,支持key和value都为对象的情况
   */
  setObjectHash (objectKey, val) {
    objectKey = stringUtil.getObjectHashCode(objectKey)
    window.sessionStorage.setItem(objectKey, JSON.stringify(val)) // eslint-disable-line
  },
  /**
   * 获取sessionStorage,支持key和value都为对象的情况
   */
  getObjectHash (objectKey) {
    objectKey = stringUtil.getObjectHashCode(objectKey)
    return JSON.parse(window.sessionStorage.getItem(objectKey)) // eslint-disable-line
  },
  setHash (key, val) {
    key = stringUtil.getHashCode(key)
    window.sessionStorage.setItem(key, JSON.stringify(val)) // eslint-disable-line
  },
  getHash (key) {
    key = stringUtil.getHashCode(key)
    return JSON.parse(window.sessionStorage.getItem(key)) // eslint-disable-line
  },
  removeHash (key) {
    key = stringUtil.getHashCode(key)
    return window.sessionStorage.removeItem(key) // eslint-disable-line
  },
  /**
   * 缓存http请求，带有过期时间
   * @param {string} key url地址
   * @param {object} val http返回值
   * @param {number} expire 过期时间，秒为单位
   */
  setExpireHash (key, val, expire) {
    let time = new Date().getTime() + expire * 1000
    key = stringUtil.getHashCode(key)
    val = '__' + time + '__' + JSON.stringify(val)
    window.sessionStorage.setItem(key, val) // eslint-disable-line
  },
  getExpireHash (key) {
    key = stringUtil.getHashCode(key)
    let val = window.sessionStorage.getItem(key) // eslint-disable-line
    if (val && /^__(\d+)__/.test(val)) {
      let time = +RegExp.$1
      if (time < new Date().getTime()) { // 过期了
        return null
      }
      val = JSON.parse(val.replace(/^__\d+__/, ''))
    }
    return val
  },
  set (key, val) {
    window.sessionStorage.setItem(key, val) // eslint-disable-line
  },
  get (key) {
    return window.sessionStorage.getItem(key) // eslint-disable-line
  },
  remove (key) {
    return window.sessionStorage.removeItem(key) // eslint-disable-line
  }
}

function isLocalStorageSupported () {
  let testKey = 'test'
  let storage = window.sessionStorage
  try {
    storage.setItem(testKey, 'testValue')
    var testValue = storage.getItem(testKey)
    storage.removeItem(testKey)
    return testValue === 'testValue'
  } catch (error) {
    return false
  }
}
