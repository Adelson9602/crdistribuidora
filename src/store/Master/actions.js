import Vue from "vue";

let base = process.env.__BASE__;

// Obtiene las unidades de medida
export function getAllUm() {
    return Vue.prototype.$axios.get(`select_unidad_medida/${base}`);
}

// Obtiene las moviles
export function getMovil() {
    return Vue.prototype.$axios.get(`select_movil_general/${base}`)
}

// Obtiene los integrantes de una movil
export function getMembersMovil(conetext, id_movil) {
    return Vue.prototype.$axios.get(`select_movil_integrante_single/${base}/${id_movil}`);
}

// Tipos de comprobante
export function getTiposComprobante() {
    return Vue.prototype.$axios.get(`select_tipo_comprobante/${base}`);
}

// medio de pago
export function getMedioPago() {
    return Vue.prototype.$axios.get(`select_medio_de_pago/${base}`)
}

// Obtiene todas las ciudades
export function getCities() {
    return Vue.prototype.$axios.get(`select_ciudad_general/${base}`)
}

// Obtiene todos los roles
export function getRol() {
    return Vue.prototype.$axios.get(`select_rol_general/${base}`);
}

// Obtiene los cargos
export function getCargos() {
    return Vue.prototype.$axios.get(`select_cargos_general/${base}`)
}


//consulta general de porcentajes  trae todos los reasultados
export function getAllPorcentaje() {
    return Vue.prototype.$axios.get(`select_porcentaje_venta_general/${base}`)
}

// Agrega o edita los porcentajes
export function addPorcentaje(contex, data) {
    return Vue.prototype.$axios.post(`insert_update_porcentaje_venta`, data);
}

// Agrega o edita los cargos
export function addCargos(contex, data) {
    return Vue.prototype.$axios.post(`insert_update_cargos`, data);
}

// MOVILES
// Lista todas las moviles
export function getAllMoviles(){
    return Vue.prototype.$axios.get(`select_movil_general/${base}`)
}

// Crea la movil
export function insertMovil(context, data){
    return Vue.prototype.$axios.post(`insert_update_movil`, data);
}

// Crea los integrantes de la movil
export function insertIntegranteMovil(context, data){
    return Vue.prototype.$axios.post(`insert_update_movil_integrante`, data);
}

// Obtiene los porcentajes de ventas por producto
export function getPercentSaleProduct(context, id_product){
    return Vue.prototype.$axios.get(`select_porcentaje_personalizado_single/${base}/${id_product}`)
}

// Guarda los porcentajes personalizados
export function savePercentPerso(context, data){
    return Vue.prototype.$axios.post(`insert_update_pv_hash_articulo`, data);
}

// Obtiene los porcentajes con las personas asociadas
export function percentsPersons(){
    return Vue.prototype.$axios.get(`select_pv_hash_user_genral/${base}`)
}