import Vue from "vue";

let base = process.env.__BASE__;

// Entradas o ingresos
// Obtiene las ultimas 50 entradas 
export function getEntries(){
  return Vue.prototype.$axios.get(`select_enc_entrada_bodega_limit/${base}`);
}

// Obtiene la entrada especifica porr id
export function getEntriesEstado(context, id){
  return Vue.prototype.$axios.get(`select_enc_entrada_bodega_estado/${base}/${id}`)
}

// Obtiene las entradas por rango de fecha
export function getEntriesRange(context, date){
  return Vue.prototype.$axios.get(`select_enc_entrada_bodega_range/${base}/${date.from}/${date.to}`);
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
  return Vue.prototype.$axios.post(`insert_update_det_entrada_inventario`, data);
}

// Inserta los productos en la tabla articulos venta
export function insertArtVenta(context, data){
  return Vue.prototype.$axios.post(`insert_update_articulo_venta`, data);
}

// Proveedores
// Obtiene todos los proveedores o clientes
export function getProviders(){
  return Vue.prototype.$axios.get(`select_cliente_proveepor_general/${base}`)
}

// Agrega o edita los Proveedores
export function addProviders(contex, data){
  return Vue.prototype.$axios.post(`insert_update_cliente_proveepor`, data);
}

// Busca un proveedor o cliente por su nit
export function searchProviders(context, nit){
  return Vue.prototype.$axios.get(`select_cliente_proveepor_single/${base}/${nit}`)
}

// Obtiene todos los proveedores o clientes
export function getTpDoc(){
  return Vue.prototype.$axios.get(`select_tipo_documento_general/${base}`)
}

// Garantias
// Obtiene las salidas a garantias
export function getWaraniesOutput(){
  return Vue.prototype.$axios.get(`select_stock_garantias_general/${base}`)
}

// Obtiene el stock para garantias
export function getStockGarantias(context, id_movil){
  return Vue.prototype.$axios.get(`select_stock_garantias_single/${base}/${id_movil}`);
}

// Obtiene el personal que autoriza salida
export function getPersonAuthorized(){
  return Vue.prototype.$axios.get(`select_quien_autoriza_general/${base}`);
}

// Inserta el encabezado de la salida a garantía o proveedor
export function insertEncSalidaProv(context, data){
  return Vue.prototype.$axios.post(`insert_update_enc_salida_proveedor`, data)
}

// Inserta el detalle de la salida a garantía o proveedor
export function insertDetSalidaProv(context, data){
  return Vue.prototype.$axios.post(`insert_update_det_salida_pro`, data);
}

// Proveedore
export function getOuputProvider(){
  return Vue.prototype.$axios.get(`select_enc_salida_proveedor_limit/${base}`);
}