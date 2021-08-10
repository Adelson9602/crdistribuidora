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

// Obtiene el detalle de una venta
export function getDetailSales(context, id_venta){
  return Vue.prototype.$axios.get(`select_det_venta_single/${base}/${id_venta}`)
}