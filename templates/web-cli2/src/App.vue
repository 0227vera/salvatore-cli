<template>
  <container id="app">
    <router-view/>
  </container>
</template>

<script>
import { mapState } from 'vuex'
import { container, Message } from 'element-ui'
export default {
  name: 'App',
  components: {
    container
  },
  mounted () {
    this.$store.dispatch('getCommonInfo')
      .then(() => {})
      .catch(e => {
        console.log(33)
        console.log(e)
      })
  },
  computed: mapState({
    message: state => state.common.message,
    whoInfo: state => state.common.whoInfo
  }),
  watch: {
    'message.msg': function () {
      if (this.message.show) {
        Message({
          type: this.message.type,
          customClass: this.message.customClass,
          message: this.message.msg,
          onClose: () => {
            this.$store.commit('SET_MESSAGE', {
              show: false,
              msg: ''
            })
          }
        })
      }
    }
  }
}
</script>

<style>
</style>
