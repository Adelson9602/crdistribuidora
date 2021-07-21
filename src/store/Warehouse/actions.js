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

