import Vue from "vue";

let base = process.env.__BASE__;

export function chartProductMoreSales(){
    return Vue.prototype.$axios.get(`select_graf_product_plus_sale/${base}`)
}

export function chartDailySales(){
    return Vue.prototype.$axios.get(`select_graf_sale_diari/${base}`)
}