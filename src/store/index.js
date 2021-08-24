import Vue from 'vue';
import Vuex from 'vuex';
import sales from './Sales';
import warehouse from './Warehouse';
import auth from './Auth';
import access from './Access';
import master from './Master';
import shopping from './Shopping';
import notifications from './Notifications';
import movements from './Movements';
import credits from './Credits';
import desktop from './Desktop';

import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      sales,
      warehouse,
      auth,
      access,
      master,
      shopping,
      notifications,
      movements,
      credits,
      desktop
    },
    plugins: [createPersistedState()],
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
