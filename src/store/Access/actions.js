import Vue from "vue";
let base = process.env.__BASE__;

export function saveFile(context, data){
    return Vue.prototype.$axios.post(`file-upload`, data);
}

export function sendEmail(contex, data){
    return Vue.prototype.$axios.post('send-email', data);
}

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

// Inserta los permisos del usuario
export function insertUpdatePersmiso(contex, data){
    return Vue.prototype.$axios.post(`insert_permiso_adicional`, data);
}

// Obtiene los permisos que el usuario ya tiene asignado
export function getPermissionUser(context, data){
    return Vue.prototype.$axios.get(`permisos_usuarios/${data.base}/${data.user}`);
}

// Obtiene los permisos que ya tiene asignado el usuario a editar
export function getPermissionUserEdit(contex, Id_usuario){
    return Vue.prototype.$axios.get(`select_permisos_usuarios/${base}/${Id_usuario}`);
}