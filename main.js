import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false


import $app from "./common/common.js";
Vue.prototype.app = $app;

import $aes from "./common/ar-aes.js";
Vue.prototype.aes = $aes.AES;

// 全局mixin
import mixin from "./common/mixin.js";

App.mpType = 'app'
const app = new Vue({
  ...App
})
Vue.mixin(mixin)
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif