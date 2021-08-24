<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import Vue from 'vue';
import CryptoJS from 'vue-cryptojs';
import IdleVue from 'idle-vue';
const eventsHub = new Vue()
const options = {
  eventEmitter: eventsHub,
  idleTime: 2000
}
Vue.use(IdleVue, options)
Vue.use(CryptoJS)

export default {
  name: 'App'
}
</script>
