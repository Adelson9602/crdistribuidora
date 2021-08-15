import Vue from "vue";
let base = process.env.__BASE__;

// Obtiebe el detalle de garantias de una venta
export function getDetSaleWaranties(context, id_venta){
  return Vue.prototype.$axios.get(`select_det_garantias_single/${base}/${id_venta}`)
}

// CONSULTA VENDEDOR
// Obtiene la comisión del vendedor
export function getCommissionSeller(contex, data){
  return Vue.prototype.$axios.get(`select_ventas_comision_range/${base}/${data.Per_Num_documento}/${data.fecha_ini}/${data.fechafin}`)
}