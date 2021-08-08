import Vue from "vue";

let base = process.env.__BASE__;

// Obtiene las unidades de medida
export function getAllUm(){
    return Vue.prototype.$axios.get(`select_unidad_medida/${base}`);
}

// Obtiene las moviles
export function getMovil(){
    return Vue.prototype.$axios.get(`select_movil_general/${base}`)
}

// Obtiene los integrantes de una movil
export function getMembersMovil(conetext, id_movil){
    return Vue.prototype.$axios.get(`select_movil_integrante_single/${base}/${id_movil}`);
}

// Tipos de comprobante
export function getTiposComprobante(){
    return Vue.prototype.$axios.get(`select_tipo_comprobante/${base}`);
}

// medio de pago
export function getMedioPago(){
    return Vue.prototype.$axios.get(`select_medio_de_pago/${base}`)
}

// Obtiene todas las ciudades
export function getCities(){
    return Vue.prototype.$axios.get(`select_ciudad_general/${base}`)
}