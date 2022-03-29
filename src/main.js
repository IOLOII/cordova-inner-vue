import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VConsole from 'vconsole'
const vConsole = new VConsole();

Vue.config.productionTip = false
document.addEventListener('deviceready', onDeviceReady, false)
function onDeviceReady() {
  // Cordova is now initialized. Have fun!
  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version)
  // document.getElementById('deviceready').classList.add('ready')
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
