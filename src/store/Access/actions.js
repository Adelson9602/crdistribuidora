import Vue from "vue";
let base = process.env.__BASE__;
// PERMISOS
//Inicio Select Login
export function GetModules (context) {
    return Vue.prototype.$axios.get(`list_modulos_frontend/${base}`);
}

// Insertar módulos
export function PostCreateModules (context, data) {
    return Vue.prototype.$axios.post('insert_modulos_frontend',data);
}

// Traer items X módulos
export function GetModulesHasItem (context) {
    return Vue.prototype.$axios.get(`list_man_modulo_has_item_frontend/${base}`);
}

// Insertar items X módulos
export function PostCreateItemModules (context, data) {
    return Vue.prototype.$axios.post('insert_item_modulo_frontend',data);
}

// Obtiene personal en general
export function getPersons (context) {
    return Vue.prototype.$axios.get(`select_personal_general/${base}`)
}

// Lista las metas fijadas 
export function getGoals(){
    return Vue.prototype.$axios.get(`select_metas_general/${base}`);
}

// METAS
// Inserta o actualiza las metas
export function insertUpdateGoals(context, data){
    return Vue.prototype.$axios.post(`insert_update_metas`, data);
}

// USUARIO
// Inserta o actualiza los datos personales
export function InsertUpdatePersonal(context, data){
    return Vue.prototype.$axios.post(`insert_update_personal`, data);
}

// Inserta o actualiza el usuario
export function InsertUpdateUsuario(context, data){
    return Vue.prototype.$axios.post(`insert_update_usuario`, data);
}

// Trae todos los permisos posible de modulo X items
export function getCheckPermissions (context, ID_Rol)  {
    return Vue.prototype.$axios.get(`select_permiso_rol/${base}/${ID_Rol}`)
}