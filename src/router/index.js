import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({ store, ssrContext }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  // Hacemos beforeach del router para saber que páginas requiren autenticación
  Router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some( record => record.meta.requiresAuth ) //Con esto sabemos si la ruta visitada requiere autenticación
    const isLogged = store.state.auth.is_logged //Con esto sabemos si el usuario esta logueado
    if( !requiresAuth && isLogged && to.path === '/'){
      return next('/desktop')
    } 

    setTimeout( () => {
      if (requiresAuth && !isLogged ){
        next('/')
      } else {
        next();
      }
    }, 200 )
  })

  return Router
}
