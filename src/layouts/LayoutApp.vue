<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="270" 
      elevated
      bordered
      content-class="bg-grey-1"
      :breakpoint="1024"
    >
        <div class="header-sidebar shadow-4 row justify-between" elevated>
          <img src="../statics/logo_menu.png" alt="logo de CR Distribuidora" class="img-logo">
        </div>
        <div class="q-pa-md bg-transparent row" style="height: 90px; width: 100%">
          <q-list class="q-pa-none full-width">
            <q-item class="q-pa-none">
              <q-item-section avatar>
                <q-avatar size="56px" class="cursor-pointer">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">Desarrollador pro</q-item-label>
                <q-item-label class="text-weight-bold">Desarrollador</q-item-label>
                <q-item-label>
                  En línea
                  <q-icon name="circle" size="xs" color="green"/>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <q-separator />
        <q-scroll-area class="bg-transparent" style="height: calc(100% - 150px); border-right: 1px solid #ddd">
          <q-list class="bg-transparent" v-for="(menu, index) in menu" :key="index">
            <q-expansion-item
               group="somegroup"
              :content-inset-level="0.3"
              expand-separator
              :icon="menu.icon"
              :label="menu.label"
              v-if="menu.expanded && menu.visible"
            >
              <q-item
                :to="`/${item.route}`"
                clickable
                v-ripple
                v-for="(item, index) in menu.items"
                :key="index"
              >
                <q-item-section avatar>
                  <q-icon name="arrow_right" />
                </q-item-section>
                <q-item-section>{{item.label}}</q-item-section>
              </q-item>
            </q-expansion-item>
            <q-item v-if="!menu.expanded" clickable v-ripple :to="menu.route">
              <q-item-section avatar>
                <q-icon :name="menu.icon" />
              </q-item-section>
              <q-item-section>{{menu.label}}</q-item-section>
            </q-item>
          </q-list>
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="logout" color="red"/>
            </q-item-section>
            <q-item-section class="text-red">Cerrar sesión</q-item-section>
          </q-item>
        </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page-sticky position="top-left" :offset="[0,0]">
        <q-btn color="white" text-color="black" icon="menu" @click="drawer = !drawer"/>
      </q-page-sticky>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  // name: 'LayoutName',
name: 'MainLayout',
  data() {
    return {
      dialog_delete_cache: false,
      accept: false,
      drawer: false,
      userData: null,
      version: null,
      menu: [],
      baseurl: process.env.__URLBASE__,
    };
  },
  mounted(){
    this.version = process.env.__VERSION__;
    window.addEventListener('online', () => {
      this.setIsOnline(true)
    }),
    window.addEventListener('offline', () => {
      this.setIsOnline(false)
    });
    this.menu = [
      {
        label: 'Escritorio',
        icon: 'dashboard',
        visible: true,
        expanded: false,
        route: '/desktop'
      },
      {
        label: 'Acceso',
        icon: 'desktop_windows',
        visible: true,
        expanded: true,
        route: '/access/goals',
        items: [
          {label: 'Metas', route: 'access/goals'},
          {label: 'Permisos', route: 'access/permissions'},
          {label: 'Usuarios', route: 'access/users'},
        ]
      },
      {
        label: 'Almacen',
        icon: 'mdi-warehouse',
        visible: true,
        expanded: true,
        route: '/warehouse/articles',
        items: [
          { label: "Artículos", route: "warehouse/articles" }, 
          { label: "Categorías", route: "warehouse/categories" },
          { label: "Traslado de bodega", route: "warehouse/warehouse_transfer" },
          { label: "Inventario", route: "warehouse/inventory" },
        ]
      },
      {
        label: 'Maestras',
        icon: 'mdi-puzzle-plus',
        visible: true,
        expanded: true,
        route: '/master/percentage',
        items: [
     
          { label: "% de ventas", route: "master/percentsales" },
            { label: "Cargos", route: "master/charges" },
        
        ]
      },
      {
        label: 'Compras',
        icon: 'shopping_bag',
        visible: true,
        expanded: true,
        items: [
          { label: "Ingresos", route: "purchases/income" },
          { label: "Proveedores", route: "purchases/providers" },
          { label: "Salidas garantias", route: "purchases/departures_guarantees" },
        ]
      },
      {
        label: 'Ventas',
        icon: 'sell',
        visible: true,
        expanded:true,
        route: '/sales/sales',
        items: [
          { label: "Ventas", route: "sales/sales" },
          { label: "Garantias de ventas", route: "sales/sales_guarantees" },
          { label: "Clientes", route: "sales/customers" },
          { label: "Consulta stock", route: "sales/stock_inquiry" },
        ]
      },
      {
        label: 'Movimientos',
        icon: 'mdi-transfer',
        visible: true,
        expanded: true,
        items: [
          { label: "Consulta Compras", route: "check_purchases/check_purchases" },
          { label: "Consulta Ventas", route: "consult_sales/consult_sales" },
          { label: "Consulta Vendedor", route: "consult_sales/consult_seller" },
          { label: "Consulta Utilidad", route: "consult_sales/consult_utility" },
          { label: "Ventas para alistar", route: "consult_sales/sales_to_list" },
        ]
      },
      {
        label: 'Créditos y pagos',
        icon: 'mdi-cash-multiple',
        visible: true,
        expanded: true,
        items: [
          { label: "Créditos Cliente", route: "check_credits/customer_credits" },
          { label: "Créditos Proveedor", route: "check_credits/provider_credits" },
            { label: "Confirmación Créditos", route: "payment_confirmation/credits_confirmation" },
          { label: "Confirmación Ventas", route: "payment_confirmation/sales_confirmation" },
        ]
      },
      // {
      //   label: 'Confirmación Pagos',
      //   icon: 'donut_large',
      //   visible: true,
      //   expanded: true,
      //   items: [
      //     { label: "Confirmación Créditos", route: "payment_confirmation/credits_confirmation" },
      //     { label: "Confirmación Ventas", route: "payment_confirmation/sales_confirmation" },
      //   ]
      // },
    ]
  },
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
  },
  methods: {
    ...mapMutations("auth", ["setIsLogged"]),
    ...mapMutations("app", ["setIsOnline"]),
    logout() {
      this.$q.loading.show({
        message: "Cerrando sesión...",
      });
      setTimeout(() => {
        this.setIsLogged(false);
        this.$router.push("/");
        this.$q.loading.hide();
      }, 2000);
    },
    deleteCache(){
      this.$q.loading.show({
        message: "Borrando datos, por favor espere...",
      });
      setTimeout(()=> {
        // caches.delete('Qinspecting-Inmutable');
        caches.delete('Qinspecting-Dinamico');
        localStorage.clear();
        this.dialog_delete_cache = false;
        this.$q.notify({
          message: 'Datos borrados',
          type: 'positive'
        })
        this.$q.loading.hide();
        location.reload();
      }, 2000)
    },
  },
};
</script>

<style>
.q-layout__section--marginal {
  background: rgb(46,91,219);
  background: linear-gradient(90deg, rgba(46,91,219,1) 0%, rgba(88,109,221,1) 0%, rgba(27,38,181,1) 30%, rgba(27,38,181,1) 53%, rgba(66,83,206,1) 90%, rgba(88,109,221,1) 100%);
  color: #fff;
}
.separator{
  margin: 10px 20px;
}

.header-sidebar {
  height: 50px;
  font-weight: bold;
  z-index: 1000;
}
.version {
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 10px;
}
.content-img {
  margin: auto;
  background: transparent;
  padding: 10px 0;
}
.q-page-sticky {
  z-index: 10000;
}
.q-page-sticky {
  z-index: 2999;
}
.user-avatar {
  margin: 20px 0 10px 0;
}
.icon-options {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  gap: 5px;
}
.icon-menu {
  cursor: pointer;
  font-size: 30px;
}
.img-logo {
  width: 200px;
  margin: auto;
}
</style>