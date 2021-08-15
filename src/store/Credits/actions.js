import Vue from "vue";

let base = process.env.__BASE__;

// CRÉDITOS CLIENTE
// Obtiene los creditos
export function getAllCredits(context, data){
    return Vue.prototype.$axios.get(`select_det_creditos_general/${base}/${data.Rol_Id}/${data.Per_Num_documento}`);
}

// Obtiene el detalle de un credito
export function getDetailCredit(contex, Ev_id) {
  return Vue.prototype.$axios.get(`select_detalle_credito_single/${base}/${Ev_id}`)
}

// Realiza los abonos del credito
export function insertUpdateCredito(context, data){
  return Vue.prototype.$axios.post(`insert_update_det_creditos`, data)
}