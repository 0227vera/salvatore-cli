/**
 * 和后端进行数据通信
 */
import commonService from './commonService'
import statisticsService from './statisticsService'
import qs from 'qs'
const axios = window.axios // eslint-disable-line

axios.defaults.baseURL = '{{projectContext}}' // eslint-disable-line 注意，正式项目这里要改成对应的项目上下文
axios.defaults.timeout = 30000 // eslint-disable-line

let queryString = window.sessionStorage.getItem('querystring')
if (queryString) {
  queryString = JSON.parse(queryString)
  axios.defaults.headers.common['Authorization'] = `bearer ${queryString.token}`
  axios.defaults.headers.common['x-api-server'] = queryString.host
} else {
  // WARNING: 由于H5有一个版本功能，token在前面的version中已经存入了，但是url上还是有。如果项目特殊情况，可以去URL上获取。
  console.log('获取认证信息失败')
}
axios.interceptors.request.use((request) => {
  if (request.data && request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    request.data = qs.stringify(request.data, { allowDots: true })
  }
  return request
})
export default Object.assign({}, commonService, statisticsService)
