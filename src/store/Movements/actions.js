import Vue from "vue";
let base = process.env.__BASE__;

// Obtiebe el detalle de garantias de una venta
export function getDetSaleWaranties(context, id_venta){
  return Vue.prototype.$axios.get(`select_det_garantias_single/${base}/${id_venta}`)
}