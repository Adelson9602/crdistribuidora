import Vue from 'vue';

let base = process.env.__BASE__;

// Insert notificacion
export function PostInsertNotification(context, data){
  return Vue.prototype.$axios.post('insert_notificaciones', data);
}

// Get notificaciones activas
export function GetNotifications(context, nt_usuario_notificado){
  return Vue.prototype.$axios.get(`select_notificaciones_activas/${base}/${nt_usuario_notificado}`);
}