import Vue from "vue";

// Obtiene las unidades de medida
export function getAllUm(){
    return Vue.prototype.$axios.get(`select_unidad_medida/${process.env.__BASE__}`);
}
