import Vue from "vue";
let base = process.env.__BASE__;
export function getSales (context) {
  return Vue.prototype.$axios.get(`select_enc_venta_general/${base}`);
}

