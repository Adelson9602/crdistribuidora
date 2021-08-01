import Vue from 'vue';

let base = process.env.__BASE__;

//consulta general de articulos trae todos los reasultados
export function getAllArticles(){
  return Vue.prototype.$axios.get(`select_articulo_general/${base}`)
}

// Lista todos los productos agrupados por articulos y discriminados por ventas
export function requestgetDataArticlesRange(contex, data) {
  return Vue.prototype.$axios.get(`select_articulo_range/${base}/${data.from}/${data.to}`)
}

// Lista las categorias
export function getCategoriasAlmacen(){
  return Vue.prototype.$axios.get(`select_categoria_general/${base}`);
}

// Agrega o edita los articulos
export function addArticle(contex, data){
  return Vue.prototype.$axios.post(`insert_update_articulo`, data);
}

// Agrega o edita las categorías de producto
export function addCategory(contex, data){
  return Vue.prototype.$axios.post(`insert_update_categoria`, data);
}

// Traslados

// Obtiene los 50 ultimos traslados realizados
export function getTransfer(){
  return Vue.prototype.$axios.get(`select_enc_traslado_moviles_limit/${base}`);
}

// Obtiene los traslados realizados filtrados por rango de fecha
export function getTransferRange(contex, data){
  return Vue.prototype.$axios.get(`select_enc_traslado_moviles_range/${base}/${data.Fecha_inicial}/${data.Fecha_final}`);
}

// Inserta o actualiza el encabezado del traslado entre moviles
export function insertEncTransfer(contex, data){
  return Vue.prototype.$axios.post(`insert_update_enc_traslado_moviles`, data);
}

// Inserta el detalle del traslado entre moviles
export function insertDetTraslado(contex, data){
  return Vue.prototype.$axios.post(`insert_update_det_traslado_moviles`, data);
}

// Inventario
// Obtiene todo el inventario en general
export function getStock(){
  return Vue.prototype.$axios.get(`select_stock_inventario_general/${base}`);
}

// Obtiene el inventario de una movil
export function getStockMovil(contex, id_movil){
  return Vue.prototype.$axios.get(`select_stock_inventario_single/${base}/${id_movil}`)
}
