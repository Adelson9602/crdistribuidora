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

// Obtiene todos los roles
export function getRol(){
    return Vue.prototype.$axios.get(`select_rol_general/${base}`);
}


//consulta general de porcentajes  trae todos los reasultados
export function getAllPorcentaje(){
  return Vue.prototype.$axios.get(`select_porcentaje_venta_general/${base}`)
}

// Agrega o edita los porcentajes
export function addPorcentaje(contex, data){
    return Vue.prototype.$axios.post(`insert_update_porcentaje_venta`, data);
  }

  //consulta general de Cargos  trae todos los reasultados
export function getAllCargos(){
    return Vue.prototype.$axios.get(`select_cargos_general/${base}`)
  }
  
  // Agrega o edita los Cargos
  export function addCargos(contex, data){
      return Vue.prototype.$axios.post(`insert_update_cargos`, data);
    }
    
  


