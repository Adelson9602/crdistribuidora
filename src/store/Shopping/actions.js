import Vue from "vue";

let base = process.env.__BASE__;

// Entradas o ingresos
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

// Guarda o actualiza el encabezado de la entrada
export function insertEncEntry(context, data){
  return Vue.prototype.$axios.post(`insert_update_enc_entrada_bodega`, data);
}

// Guarda o actualiza el detalle de la entrada
export function insertDetEntry(contex, data){
  return Vue.prototype.$axios.post(`insert_update_det_entrada_inventario`)
}

// Proveedores
// Obtiene todos los proveedores o clientes
export function getProviders(){
  return Vue.prototype.$axios.get(`select_cliente_proveepor_general/${base}`)
}

// Busca un proveedor o cliente por su nit
export function searchProviders(context, nit){
  return Vue.prototype.$axios.get(`select_cliente_proveepor_single/${base}/${nit}`)
}

// Garantias
// Obtiene las salidas a garantias
export function getWaraniesOutput(){
  return Vue.prototype.$axios.get(`select_stock_garantias_general/${base}`)
}