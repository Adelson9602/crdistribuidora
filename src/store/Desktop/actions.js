import Vue from "vue";

let base = process.env.__BASE__;

// Grafica para productos mas vendidos
export function chartProductMoreSales(){
    return Vue.prototype.$axios.get(`select_graf_product_plus_sale/${base}`)
}

// Gráfica para ventas diarias
export function chartDailySales(){
    return Vue.prototype.$axios.get(`select_graf_sale_diari/${base}`)
}

// Gráfica para mejores cliente
export function chartBestClients(){
    return Vue.prototype.$axios.get(`select_graf_client_plus_sale/${base}`)
}

// Gráfica para valor del stock de la movil
export function chartPriceStock(){
    return Vue.prototype.$axios.get(`select_graf_valor_movil/${base}`)
}