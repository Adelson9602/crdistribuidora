import Vue from "vue";
let base = process.env.__BASE__;

// Obtiebe el detalle de garantias de una venta
export function getDetSaleWaranties(context, id_venta){
  return Vue.prototype.$axios.get(`select_det_garantias_single/${base}/${id_venta}`)
}

// CONSULTA VENDEDOR
// Obtiene la comisión del vendedor
export function getCommissionSeller(contex, data){
  return Vue.prototype.$axios.get(`select_ventas_comision_range/${base}/${data.Per_Num_documento}/${data.from}/${data.to}`)
}

// Obtiene el detalle de la comision
export function getCommissionSellerDet(contex, data){
  return Vue.prototype.$axios.get(`select_ventas_comision_range_detail/${base}/${data.Per_Num_documento}/${data.from}/${data.to}`)
}

// UTILIDAD
// Obtiene el resumen de la utilidad en general
export function getResumenUtilidad(){
  return Vue.prototype.$axios.get(`select_ventas_creditos_abonos/${base}`)
}

export function getResumenUtilidadRange(context, data){
  return Vue.prototype.$axios.get(`select_ventas_creditos_abonos_range/${base}/${data.year}/${data.month}`)
}

// Obtiene el resumen del total de creditos y abonos
export function getTotalCreGeneral(){
  return Vue.prototype.$axios.get(`select_v_c_a_v_general/${base}`)
}

// Obtiene el resumen del total de creditos y abonos
export function getTotalCreGeneralRange(context, data){
  return Vue.prototype.$axios.get(`select_v_c_a_v_range/${base}/${data.year}/${data.month}`)
}

// Obtiene el detalle de las ventas de cada vendedor
export function getDisVentaGeneral(){
  return Vue.prototype.$axios.get(`select_v_c_a_v_discrimidado/${base}`)
}

// Obtiene el detalle de las ventas de cada vendedor
export function getDisVentaGeneralRange(context, data){
  return Vue.prototype.$axios.get(`select_v_c_a_v_discrimidado_range/${base}/${data.year}/${data.month}`)
}
