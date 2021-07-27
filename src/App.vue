<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import Vue from 'vue';
import CryptoJS from 'crypto-js'
Vue.use(CryptoJS)

export default {
  name: 'App'
}
</script>
