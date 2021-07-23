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