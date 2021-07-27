<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import CryptoJS from 'crypto-js'
Vue.use(Vuelidate)
Vue.use(CryptoJS)

export default {
  name: 'App'
}
</script>
