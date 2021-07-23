import Vue from "vue";

let base = process.env.__BASE__;

// Obtiene las ultimas 50 entradas 
export function getEntries(){
  return Vue.prototype.$axios.get(`select_enc_entrada_bodega_limit/${base}`);
}

// Obtiene las entradas por rango de fecha
export function getEntriesRange(){
  return Vue.prototype.$axios.get(`select_enc_entrada_bodega_range/${base}/${data.Fecha_inicial}/${data.Fecha_final}`);
}

// Obtiene la entrada especifica porr id
export function getSingleEntry(context, id){
  return Vue.prototype.$axios.get(`select_enc_entrada_bodega_single/${base}/${id}`)
}

// Obtiene el detalle de la entrada
export function getDetailsEntry(context, id){
  return Vue.prototype.$axios.get(`select_det_entrada_inventario_single/${base}/${id}`)
}