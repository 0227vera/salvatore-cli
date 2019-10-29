<template>
  <transition name="fade">
    <div
      class="loading-mask"
      v-show="visible"
      :style="{ backgroundColor: background || '' }"
    >
      <van-loading type="spinner" color="#1989fa"/>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      background: null,
      visible: false
    }
  }
}
</script>

<style scoped lang="scss">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .loading-mask {
    position: absolute;
    z-index: 2000;
    background-color: rgba(255,255,255,.9);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
    & > div {
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      text-align: center;
      position: absolute;
    }
  }
</style>
