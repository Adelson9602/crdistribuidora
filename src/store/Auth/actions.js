import Vue from 'vue';

export function login(context, data){
  return Vue.prototype.$axios.post('login', data);
}

export function getDataUserRecove(context, user){
  return Vue.prototype.$axios.get(`recuperar_usuario/${process.env.__BASE__}/${user}`)
}

export function sendEmailRecover(context, data){
  return Vue.prototype.$axios.post(`recover_password`, data)
}