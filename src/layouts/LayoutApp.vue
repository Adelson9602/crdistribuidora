<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="leftDrawerOpen"
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
        <q-scroll-area class="bg-transparent" style="height: calc(100% - 60px); ">
          <q-item class="sidebar__user">
          <router-link to="/access/profile" class="no-decoration">
            <q-item-section clickable v-ripple side>
              <q-avatar size="50px">
                <img src='https://cdn.iconscout.com/icon/free/png-256/avatar-372-456324.png' />
                <!-- <img :src="data_user.Foto ? data_user.Foto: 'https://cdn.iconscout.com/icon/free/png-256/avatar-372-456324.png'" /> -->
              </q-avatar>
            </q-item-section>
          </router-link>
          <router-link to="/access/profile" class="no-decoration">
            <q-item-section>
              <q-item-label class="sidebar__user-name"
                >
                {{data_user.Per_Nombre}}
                </q-item-label
              >
              <q-item-label caption class="sidebar__text-rol">
                {{data_user.Rol_Descripcion}}
              </q-item-label>
            </q-item-section>
          </router-link>
          <q-item-section side style="overflow: hidden;">
            <q-btn dense round flat icon="notifications" class="notificaciones__icon">
              <q-badge color="red" rounded floating transparent v-if="count_notifications > 0"> 
                {{count_notifications}} 
              </q-badge>
              <q-menu anchor="top right" self="top left" :offset="[30, 0]" class="no-scroll" style="overflow: hidden;"> 
                <q-list style="max-width: 300px; min-width: 300px; overflow: hidden;" class="no-scroll">
                  <q-item class="notificaciones__title">
                    <q-item-label caption>Notificaciones</q-item-label>
                    <router-link to="/notificaciones">
                      <q-item-label class="notificaciones__link" caption>Ver todas</q-item-label>
                    </router-link>
                  </q-item>

                  <q-separator />
                  <div v-if="notifications.length > 0" class="notifications__content">
                    <div v-for="(notification, index) in notifications" :key="index">
                      <q-item clickable @click="editEstadoNotification(notification)">
                        <q-item-section>
                          <q-item-label>{{notification.nt_titulo}}</q-item-label>
                          <q-item-label caption lines="2"
                            >{{notification.nt_descripcion}}</q-item-label
                          >
                        </q-item-section>

                        <q-item-section side top>
                         <q-item-label v-if="notification.dias > 0" caption>hace {{notification.dias}} dia<span v-if="notification.dias > 1">s</span></q-item-label>

                          <q-item-label v-if="notification.horas < 24 && notification.horas > 0" caption>hace {{notification.horas}} horas</q-item-label>

                          <q-item-label v-if="notification.minutos < 59 && notification.minutos > 0" caption>hace {{notification.minutos}} minuto<span v-if="notification.minutos > 1">s</span></q-item-label>

                          <q-item-label v-if="notification.minutos <= 0" caption>hace un momento</q-item-label>
                          <q-icon
                            name="circle"
                            color="blue"
                            size="10px"
                            style="margin-top: 10px"
                            v-if="notification.nt_estado == 1"
                          />
                        </q-item-section>
                      </q-item>
                      <q-separator spaced inset />
                    </div>
                  </div>
                  <div v-else class="notifications__content">
                    <div>
                      <q-item clickable>
                        <q-item-section>
                          <q-item-label>Sin notificaciones</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-separator spaced inset />
                    </div>
                  </div>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>
        </q-item>
        <!-- <hr class="sidebar-separator" /> -->
          <q-item-label
            header
            class="text-grey-8 sidebar__title-navegation"
          >
            <b>Navegación</b>
          </q-item-label>
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
          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon color="red" name="power_settings_new" />
            </q-item-section>
            <q-item-section>Cerrar Sesión</q-item-section>
          </q-item>
        </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page-sticky position="top-left">
        <q-btn
          square
          class="btn-menu"
          color="white"
          text-color="black"
          dense
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
      </q-page-sticky>
      <router-view @reloadNotifications="reloadNotifications" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  // name: 'LayoutName',
name: 'MainLayout',
  data() {
    return {
      base: process.env.__BASE__,
      dialog_delete_cache: false,
      accept: false,
      drawer: false,
      userData: null,
      version: null,
      menu: [],
      baseurl: process.env.__URLBASE__,
      leftDrawerOpen: false,
      notifications: [],
      count_notifications: null,
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
    this.getNotificaciones();
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
          { label: "Consulta Vendedor", route: "movements/consult_seller" },
          { label: "Consulta Utilidad", route: "movements/consult_utility" },
          { label: "Ventas para alistar", route: "movements/sales_to_list" },
        ]
      },
      {
        label: 'Créditos',
        icon: 'mdi-cash-multiple',
        visible: true,
        expanded: true,
        items: [
          { label: "Créditos Cliente", route: "check_credits/customer_credits" },
          { label: "Créditos Proveedor", route: "check_credits/provider_credits" },
        ]
      },
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
    ...mapActions("notifications", ["GetNotifications", "PostInsertNotification"]),
    async getNotificaciones(){
      const resGetNotifications = await this.GetNotifications(this.data_user.Per_Num_documento).then((res) => {
        return res.data.data;
      });
      console.log({
        msg: "Respuesta notificaciones",
        data: resGetNotifications,
      });
      resGetNotifications.forEach((element) => {
        this.notifications.push({
          nt_id: element.nt_id,
          nt_titulo: element.nt_titulo,
          nt_descripcion: element.nt_descripcion,
          nt_usuario_notificado: element.nt_usuario_notificado,
          nt_usuario_control: element.nt_usuario_control,
          nt_fecha_control: element.nt_fecha_control,
          dias: element.dias,
          horas: element.horas,
          minutos: element.minutos, 
          nt_estado: element.nt_estado,
        });
        // Cantidad de notficacion con estado en 1 | Equivalente a que no se han visto
        if(element.nt_estado == 1){
          this.count_notifications += 1
        }
      });
    },
    async editEstadoNotification(notification){
      try{
        if(notification.nt_estado == 1){
          let dataPostInsertNotification = {
            nt_id: notification.nt_id,
            nt_titulo: notification.nt_titulo,
            nt_descripcion: notification.nt_descripcion,
            nt_usuario_notificado: notification.nt_usuario_notificado,
            nt_estado: 0,
            nt_usuario_control: notification.nt_usuario_control,
            base: this.base, 
          };
          const resPostInsertNotification = await this.PostInsertNotification(dataPostInsertNotification).then((res) => {
            return res.data;
          });
          console.log({
            msg: "Edit estado de notificación",
            data: resPostInsertNotification,
          });
          if(resPostInsertNotification.data.affectedRows > 0){
            this.onResetNotifs();
            this.getNotificaciones();
          }
        }
      }catch (e) {
        console.log(e);
        if (e.message === "Error de conexión") {
          e = e.message;
        } else if (e.message === "Request failed with status code 404") {
          e = "Error 404 al hacer la petición al servidor";
        } else if (e.message) {
          e = e.message;
        }
        this.$q.notify({
          message: e,
          type: "negative",
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    reloadNotifications(){
      this.notifications = [];
      this.count_notifications = null;
      this.getNotificaciones();
    },
    onResetNotifs(){
      this.notifications = [];
      this.count_notifications = null;
    },
    logout() {
      this.$q.loading.show({
        message: "Cerrando sesión...",
      });
      setTimeout(() => {
        this.setIsLogged(false);
        this.$router.push("/");
        this.$q.loading.hide();
      }, 1000);
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
.q-layout,
.q-header,
.q-footer,
.q-page {
  background: #efefef;
}

/* .q-layout__section--marginal {
  background: rgb(249,167,38);
  background: linear-gradient(90deg, rgba(249,167,38) 0%, rgba(249,167,38) 0%, rgba(249,167,38) 30%, rgba(249,167,38) 53%, rgba(249,167,38) 90%, rgba(249,167,38) 100%);
  color: #fff;
} */
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

.sidebar__title-navegation{
  padding: 10px 16px 0;
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

.sidebar__user {
  border-radius: 5px;
  margin: 10px 10px 7px 10px;
  background: linear-gradient(90deg, rgba(249,167,38) 0%, rgba(249,167,38) 0%, rgba(249,167,38) 30%, rgba(249,167,38) 53%, rgba(249,227,38) 100%, rgba(249,227,38) 100%);
  color: #fff;
}

.sidebar__user-name {
  color: #ffffff;
  font-weight: 500;
  text-transform: uppercase;
}

.sidebar__text-rol{
  color: #FFF;
  text-transform: capitalize;
}

.no-decoration {
  text-decoration: none;
}

.sidebar-separator {
  border: 0.1px solid #c8c8c8;
}

.notificaciones {
  min-height: min-content;
}
.notificaciones__icon{
  border: none;
  color: #fff;
}

/* Notifications */
.notificaciones__title{
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: 70% 30%;
  width: 100%;
}

.notifications__content{
  margin-top: 30px;
}

.notificaciones__link{
  float: right;
  text-decoration: underline;
  font-weight: bold;
}

.q-position-engine::-webkit-scrollbar{
    width:10px;
    background:#fff
}
.q-position-engine::-webkit-scrollbar-thumb{
    background:#C5C5C5;
    border-left:.1px solid #fff;
    border-right:.1px solid #fff;
}
.btn-menu{
  height: 50px;
}
</style>