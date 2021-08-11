import Vue from 'vue';

let base = process.env.__BASE__;

// Ventas
// Busca una venta por el id
export function getSearchSales(contex, id){
  return Vue.prototype.$axios.get(`select_enc_venta_single/${base}/${id}`)
}

// Obtiene las ventas por rango de fecha
export function getSalesRange(contex, data){
  return Vue.prototype.$axios.get(`select_enc_venta_range/${base}/${data.from}/${data.to}`);
}

// Obtiene todas las ventas realizadas
export function getSales(){
  return Vue.prototype.$axios.get(`select_enc_venta_general/${base}`)
}

// Lista todos los productos agrupados por articulos y discriminados por ventas
export function requestGetSalestoList(contex, data) {
  return Vue.prototype.$axios.get(`select_list_picking_range/${data.base}/${data.from}/${data.to}`);
}

// Lista todos los productos agrupados por articulos y discriminados por ventas
export function requestGetSalestoListDetail(contex, data) {
  return Vue.prototype.$axios.get(`select_list_picking_detail_range/${data.base}/${data.from}/${data.to}`)
}

// Lista las garantías
export function getWarranties(){
  return Vue.prototype.$axios.get(`select_garantias_a_devolver/${process.env.__BASE__}`)
}

// Proveedores
// Obtiene todos los proveedores o clientes
export function getClientes(){
  return Vue.prototype.$axios.get(`select_cliente_proveepor_general/${base}`)
}

// Proveedores
// Obtiene todos los proveedores o clientes
export function getAllstock(){
  return Vue.prototype.$axios.get(`select_stock_porcentaje_general/${base}`)
}

// Ventas
// Guarda o actualiza el encabezado de la venta
export function insertUpdateEncVenta(context, data){
  return Vue.prototype.$axios.post(`insert_update_enc_venta`, data);
}

// Guarda o actualiza el detalle de la venta
export function insertUpdateDetVenta(context, data){
  return Vue.prototype.$axios.post(`insert_update_det_venta`, data);
}