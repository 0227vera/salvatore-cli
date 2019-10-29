import * as types from '../mutations'
import mCall from '@/utils/mCall'

const state = {
  message: { // 全局统一消息通知
    show: false,
    msg: '',
    customClass: '',
    type: 'error'
  },
  header: { // header相关信息
    showBack: mCall.hasFullScreen(), // 如果是校信环境，并且支持全屏嵌入H5应用，那么就显示返回。
    preventGoBack: true,
    title: '考勤',
    backText: ''
  }
}

// const fn = () => {}
const actions = {}

const mutations = {
  [types.SET_HEADER] (state, data) {
    state.header = Object.assign(state.header, data)
  },
  [types.APP_CLOSE] (state, data) {
    mCall.closeH5()
  }
}

export default {
  state,
  actions,
  mutations
}
