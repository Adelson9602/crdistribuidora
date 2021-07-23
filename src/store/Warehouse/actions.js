import Vue from 'vue';

//consulta general de articulos trae todos los reasultados
export function getAllArticles(){
  return Vue.prototype.$axios.get(`select_articulo_general/${process.env.__BASE__}`)
}

// Lista todos los productos agrupados por articulos y discriminados por ventas
export function requestgetDataArticlesRange(contex, data) {
  return Vue.prototype.$axios.get(`select_articulo_range/${process.env.__BASE__}/${data.from}/${data.to}`)
}

// Lista las categorias
export function getCategoriasAlmacen(){
  return Vue.prototype.$axios.get(`select_categoria_general/${process.env.__BASE__}`);
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
  return Vue.prototype.$axios.get(`select_enc_traslado_moviles_limit/${process.env.__BASE__}`);
}

// Obtiene los traslados realizados filtrados por rango de fecha
export function getTransferRange(contex, data){
  return Vue.prototype.$axios.get(`select_enc_traslado_moviles_range/${process.env.__BASE__}/${data.Fecha_inicial}/${data.Fecha_final}`);
}

// Inserta o actualiza el encabezado del traslado entre bodegas
export function insertEncTransfer(contex, data){
  return Vue.prototype.$axios.post(`insert_update_enc_traslado_moviles`, data);
}