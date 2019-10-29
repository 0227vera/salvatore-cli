import Vue from 'vue'
import Loading from './loading'
import { addClass, removeClass, getStyle } from '@/utils/dom.js'

// Loading构造函数
const Mask = Vue.extend(Loading)
// extend 创造一个子类

const loadingDirective = {}
// 如果想要在main.js里面Vue.use(loading) 则需要一个对象并且上面必须要有一个install方法

loadingDirective.install = Vue => {
  // 切换组件状态函数
  const toggleLoading = (el, binding) => {
    if (binding.value) {
      Vue.nextTick(() => {
        ['height', 'width'].forEach(property => {
          el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px'
        })
        el.originalPosition = getStyle(el, 'position')
        insertDom(el, el, binding)
      })
    } else {
      let timer
      clearTimeout(timer)
      timer = setTimeout(() => {
        removeClass(el, 'loading-parent--relative')
        clearTimeout(timer)
      }, 300)
      el.instance.visible = false
    }
  }

  // 插入Loading
  const insertDom = (parent, el) => {
    Object.keys(el.maskStyle).forEach(property => {
      el.mask.style[property] = el.maskStyle[property]
    })
    if (el.originalPosition !== 'absolute' && el.originalPosition !== 'fixed') {
      addClass(parent, 'loading-parent--relative')
    }
    parent.appendChild(el.mask)
    el.instance.visible = true
  }

  Vue.directive('loading', {
    bind: function (el, binding) {
      const backgroundExr = el.getAttribute('loading-background')
      const mask = new Mask({
        el: document.createElement('div'),
        data: {
          background: backgroundExr
        }
      })
      el.instance = mask
      el.mask = mask.$el // mask.$el --- loading本身最外层的dom
      el.maskStyle = {} // 样式

      binding.value && toggleLoading(el, binding)
    },

    update: function (el, binding) {
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding)
      }
    },

    unbind: function (el) {
      if (el.mask.parentNode) {
        el.mask.parentNode.removeChild(el.mask)
      }
      el.instance && el.instance.$destroy()
    }
  })
}

export default loadingDirective
