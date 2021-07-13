import Vue from 'vue';

export function login(contex, data){
  return Vue.prototype.$axios.post('login', data);
}