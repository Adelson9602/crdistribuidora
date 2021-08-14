import Vue from "vue";
let base = process.env.__BASE__;

// CONSULTA VENTAS
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

// Obtiebe el detalle de garantias de una venta
export function getDetSaleWaranties(context, id_venta){
  return Vue.prototype.$axios.get(`select_det_garantias_single/${base}/${id_venta}`)
}