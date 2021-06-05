/*
export function someAction (context) {
}
*/

import Vue from 'vue';

// Lista todos los productos agrupados por articulos y discriminados por ventas
export function getDataArticles(contex, data){
    return Vue.prototype.$axios.get(`select_articulo_ten/${data.base}`);
  }

   // Lista todos los productos agrupados por articulos y discriminados por ventas
export function requestgetDataArticlesRange(contex, data){
  return Vue.prototype.$axios.get(`select_articulo_range/${data.base}/${data.from}/${data.to}`)
}


