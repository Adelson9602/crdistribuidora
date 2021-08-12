<template>
  <div id="app" class="q-pa-md">
    <div class="row q-pt-md">
      <div class="col-md-1"></div>
      <div class="col-12 col-md-10">
        <div class="q-pa-xs container-notifs">
          <div class="container-notifs__item">
            <span class="title_card self-center"
              >Notificaciones</span
            >
            <div v-if="notifications.length > 0" class="scroll container_notifications"> 
              <div v-for="(notification, index) in notifications" :key="index"   >
                <q-item clickable  @click="editEstadoNotification(notification)">
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
            <div v-else class="scroll container_notifications"> 
              <div>
                <q-item clickable>
                  <q-item-section>
                    <q-item-label>Sin notificaciones</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-1"></div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Notifications",
  data() {
    return {
      base: process.env.__BASE__,
      actions_user: null,
      notifications: [],
      count_notifications: null,
    };
  },
  computed: {
    ...mapState("auth", ["user_logged", "user_permissions"]),
    dataUser() {
      return this.user_logged;
    },
  },
  mounted() {
    this.getNotifications();
  },
  created() {
    // Valida que permiso de acciones tiene el usuario
    this.actions_user = this.user_permissions.find(
      (e) => e.route === this.$route.path
    );
  },
  methods: {
    ...mapActions("notifications", ["GetNotifications", "EditEstadoRegistro"]),
    async getNotifications(){
      this.$q.loading.show({
        message: "Obteniendo notificaciones, por favor espere...",
      });
      try{
        const resGetNotifications = await this.GetNotifications(this.dataUser.Per_Num_documento).then((res) => {
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
    EstadoNotif(id){
      this.notifications.forEach(element => {
        if(element.nt_id == id){
          element.nt_estado = 0;
        }
      });
    },
    async editEstadoNotification(data_notif){
      console.log("Into")
      try{
        if(data_notif.nt_estado == 1){
          let dataEditEstadoRegistro = {
            base: this.base, 
            c_id: "nt_id",
            id: data_notif.nt_id,
            tabla: "notificaciones",
            c_estado: "nt_estado",
            newestado: 0,
            c_fecha_control: "nt_fecha_control",
            c_user_control: "nt_usuario_control",
            newuser_control: this.dataUser.ID_Usuario_Person
          };
          const resEditEstadoRegistro = await this.EditEstadoRegistro(dataEditEstadoRegistro).then((res) => {
            return res.data;
          });
          console.log({
            msg: "Edit estado de notificación",
            data: resEditEstadoRegistro,
          });
          if(resEditEstadoRegistro.affectedRows > 0){
            // this.onReset();
            this.EstadoNotif(data_notif.nt_id);
            this.reloadNotifications();
            // this.getNotifications();
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
    reloadNotifications() {
      this.$emit("reloadNotifications");
    },
    onReset(){
      this.notifications= [];
    }
  },
};
</script>

<style scoped>
.container-notifs {
  display: grid;
  grid-template-columns: 100%;
  width: 100%;
  padding: 0;
}

.container-notifs__item {
  padding: 20px 10px 0;
  border-radius: 10px;
  background: #ffffff;
  margin: 15px 4px 0 4px;
}

.container-notifs__item img {
  margin-top: 20px;
}

.container_notifications{
  margin-top: 20px;
  height: calc(100vh - 110px);
}

.container_notifications::-webkit-scrollbar{
    width:10px;
    background:#fff
}
.container_notifications::-webkit-scrollbar-thumb{
    background:#C5C5C5;
    border-left:.1px solid #fff;
    border-right:.1px solid #fff;
}

.q-pt-md {
  padding-top: 0;
}

.title_card {
  font-size: 17px;
  font-weight: 500;
  padding-left: 5px;
  line-height: 1;
}

@media screen and (max-width: 1200px) {
 .title_card {
    font-size: 15px;
  }
}

@media screen and (max-width: 800px) {
  .container-notifs {
    grid-template-columns: 100%;
  }
  .title_card {
    font-size: 17px;
  }
}

</style>