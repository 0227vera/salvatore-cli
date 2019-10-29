import { axiosFactory } from './axios-factory'

export default {
  getWho () {
    return axiosFactory({
      name: 'who接口数据',
      url: '/mobile/who'
    })
  }
}
