import * as types from '../mutations'

import services from '@/services'

const state = {
  whoInfo:{},
  message:{ // 全局的消息提醒
    show:false,
    msg:'',
    type:'error',
    customClass: ''
  }
}
const actions = {
  getwhoInfo ({ commit, state }) {
    function whoInfo () {
      let whoInfo = JSON.parse(window.sessionStorage.getItem('whoInfo'))
      return whoInfo ? Promise.resolve(whoInfo) : services.whoInfo()
    }
    return Promise.all([whoInfo()]).then(([whoInfo]) => {
      if (whoInfo) {
        window.sessionStorage.setItem('whoInfo', JSON.stringify(whoInfo))
        commit(types.WHO_INFO, whoInfo)
        Promise.resolve(whoInfo)
      } else {
        Promise.reject(new Error('错误的返回内容'))
      }
    }).catch((e) => {
      commit(types.SET_MESSAGE, {
        show: true,
        msg: e.msg || '获取学期出现错误',
        customClass: '',
        type: 'error'
      })
    })
  }
}

const mutations = {
  [types.SET_MESSAGE] (state, data) {
    state.message = Object.assign(state.message, data)
  },
  [types.WHO_INFO] (state, data) {
    state.whoInfo = data
  }
}

export default {
  state,
  actions,
  mutations
}
