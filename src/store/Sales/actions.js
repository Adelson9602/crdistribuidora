import Vue from 'vue';

let base = process.env.__BASE__;

// VENTAS
// Busca una venta por el id
export function getSearchSales(contex, id){
  return Vue.prototype.$axios.get(`select_enc_venta_single/${base}/${id}`)
}

// Obtiene las ventas por rango de fecha
export function getSalesRange(contex, data){
  return Vue.prototype.$axios.get(`select_enc_venta_range/${base}/${data.from}/${data.to}`);
}

// Obtiene las ventas en general
export function getSales() {
  return Vue.prototype.$axios.get(`select_enc_venta_general/${base}`);
}

// Obtiene las ventas de un cliente
export function getSalesClient(context, nit){
  return Vue.prototype.$axios.get(`select_enc_venta_general_cliente/${base}/${nit}`)
}

// Obtiene las ventas por el nit del cliente 
export function getSalesClientSingle(context, nit){  
  return Vue.prototype.$axios.get(`select_enc_venta_general_cliente_nit/${base}/${nit}`)
}

// Obtiene el detalle de una venta
export function getDetailSales(context, id_venta){
  return Vue.prototype.$axios.get(`select_det_venta_single/${base}/${id_venta}`)
}

// Lista todos los productos agrupados por articulos y discriminados por ventas
export function requestGetSalestoList(contex, data) {
  return Vue.prototype.$axios.get(`select_list_picking_range/${data.base}/${data.from}/${data.to}`);
}

// Lista todos los productos agrupados por articulos y discriminados por ventas
export function requestGetSalestoListDetail(contex, data) {
  return Vue.prototype.$axios.get(`select_list_picking_detail_range/${data.base}/${data.from}/${data.to}`)
}

// insert_update_stock_inventario => Se reutiliza petición del modulo warehouse

// Proveedores
// Obtiene todos los proveedores o clientes
export function getClientes(){
  return Vue.prototype.$axios.get(`select_cliente_proveepor_general/${base}`)
}

// Obtiene todos los proveedores o clientes
export function getAllstock(){
  return Vue.prototype.$axios.get(`select_stock_porcentaje_general/${base}`)
}

// GARANTÍAS
// Lista las garantías
export function getWarranties(){
  return Vue.prototype.$axios.get(`select_garantias_a_devolver/${process.env.__BASE__}`)
}

export function getWarrantiesSelect(context, id){
  return Vue.prototype.$axios.get(`select_garantias_a_devolver_id/${process.env.__BASE__}/${id}`)
}

// Obtiene el detalle de la garantía
export function getDetailsGuarantess(context, id){
  return Vue.prototype.$axios.get(`select_garantias_a_devolver_details/${process.env.__BASE__}/${id}`)
}

// Guarda o actualiza el inventario de garantias
export function insertUpdateStcok_garantias(context, data){
  return Vue.prototype.$axios.post(`insert_update_stock_garantias`, data);
}

// Guarda o actualiza el encabezado de la garantia
export function insertUpdateEncGarantia(context, data){
  return Vue.prototype.$axios.post(`insert_update_enc_garantia`, data);
}

// Obtiene el porcentaje de descuento para el articulo
export function getPercentSaleArt(context, data){
  return Vue.prototype.$axios.get(`select_porcentaje_venta_general/${base}`)
}

// Obtiene las moviles del usuario
export function getMovilUser(context, documento){
  return Vue.prototype.$axios.get(`select_movil_integrante_user/${base}/${documento}`);
}

// Insert y actualizacion de la tabla det_garantias
export function insertDetGarantia(context, data){
  return Vue.prototype.$axios.post(`insert_update_det_garantias`, data);
}

// Insert y actualizacion de la tabla stock_garantias
export function insertInsUpdStockGarantia(context, data){
  return Vue.prototype.$axios.post(`insert_update_stock_garantias`, data);
}