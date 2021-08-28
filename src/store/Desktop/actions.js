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

// Obteiene todas las notas creditos realizadas
export function getTotalNotasCre(contex, data){
    return Vue.prototype.$axios.get(`select_notas_credito_today/${base}`);
}

// Obtiene el total de ventas realizadas
export function getTotalVentas(contex, data){
    return Vue.prototype.$axios.get(`select_sales_today/${base}`);
}

// Obtiene todas las notas debitos relizadas
export function getTotalNotasDeb(contex, data){
    return Vue.prototype.$axios.get(`select_notas_debito_today/${base}`);
}

// Obtiene los creditos pendiente
export function getTotalCredPen(contex, data){
    return Vue.prototype.$axios.get(`elect_card_total_credit_pdte/${base}`);
}
