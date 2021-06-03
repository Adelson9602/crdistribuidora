<template>
  <q-page padding>
     <q-card class="height-card_page">
        <q-tabs
          v-model="tab"
          dense
          class="text-primary"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="articles" label="Articulos" icon="inventory_2"/>
          <q-tab name="create_article" label="Agregar articulo" icon="add_business"/>
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="articles">
             <component-table
        class="q-mt-md height-table"
        proptitle="Articulos"
        :propdata="data"
        :propcolumns="columns"
        :propgrid="false"
        :propflat="true"
        @getrangedata="getArticleRang"
      />
          </q-tab-panel>

          <q-tab-panel name="create_article">
            <component-add-article/>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
  </q-page>
</template>

<script>
import ComponentAddArticle from 'components/Warehouse/ComponentAddArticle';
import componentTable from "components/Generals/ComponentTable";
import { mapActions } from "vuex";
export default {
  name: 'Articles',
  components:{
    ComponentAddArticle,
    componentTable,
  },
  data(){
    return {
      
      tab: 'articles',      date_range: {
        to: null,
        from: null,
      },
      columns: [
        {
          name: "Id",
          required: true,
          label: "Id ",
          align: "center",
          field: "Id",
          sortable: true,
        },
        {
          name: "Art_Nombre",
          required: true,
          label: "Nombre articulo",
          align: "center",
          field: "Art_Nombre",
          sortable: true,
        },
        {
          name: "Av_Precio_venta",
          required: true,
          label: "Precio Venta",
          align: "center",
          field: "Av_Precio_venta",
          sortable: true,
        },
        {
          name: "Av_Estado",
          required: true,
          label: "Estado",
          align: "center",
          field: "Av_Estado ",
          sortable: true,
        },
        {
          name: "Av_User_control",
          required: true,
          label: "User Control",
          align: "center",
          field: "Av_User_control",
          sortable: true,
        },
         {
          name: "Per_Nombre",
          required: true,
          label: "Nombre Control",
          align: "center",
          field: "Per_Nombre",
          sortable: true,
        },
         {
          name: "Av_Fecha_control",
          required: true,
          label: "Fecha Control",
          align: "center",
          field: "Av_Fecha_control",
          sortable: true,
        },
      ],

      data: [],
    }
  },
    created() {
    this.getData();
  },
  methods: {
    ...mapActions("warehouse", ["getDataArticles"]),

    getData() {
      let data={
        base : process.env.__BASE__
      }
      this.$q.loading.show({
        message: "Obteniendo los ultimos 10 articulos existentes, por favor espere..."
      });
      setTimeout(async () => {
        try {
          this.data.length = 0;
          const resgetDataArticles = await this.getDataArticles(data).then((res) => {
            return res.data;
          });
          console.log({
            msg: "Respuesta get grupo picking por rango de fecha",
            data: resgetDataArticles,
          });
          this.data.length = 0;
          if (resgetDataArticles.ok) {
            if (resgetDataArticles.result) {
              resgetDataArticles.forEach((element) => {
                this.data.push({
                  Id: element.Id,
                  Art_Id: element.Art_Id,
                  Art_Nombre: element.Art_Nombre,
                  cantidad: element.cantidad,
                  cantG: element.cantG,
                  Av_Precio_venta: element.Av_Precio_venta,
                   Av_Estado: element.Av_Estado,
                   Av_User_control: element.Av_User_control,
                  Per_Nombre: element.Per_Nombre, 
                  Av_Fecha_control: element.Av_Fecha_control,
                  // title: `Entrada No. ${element.Id}`,
                  // btn_edit: false,
                  // btn_status: false,
                  // btn_details: true,
                  // btn_pdf: true,
                  // icon_btn_edit: "mdi-pencil",
                  // icon_btn_status: "power_settings_new",
                  // icon_btn_details: "mdi-eye-settings",
                });
              });
            } else {
              this.$q.notify({
                message: resgetDataArticles.message,
                type: "warning",
              });
            }
          } else {
           
            this.data.length = 0;
            throw resgetDataArticles.message;
          }

          // this.rederComponent = true;
        } catch (e) {
          console.log(e);
          if (e.message === "Network Error") {
            e = e.message;
          }
          if (e.message === "Request failed with status code 404") {
            e = "URL de solicitud no existe, err 404";
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
      }, 2000);
    },
    getArticleRang(data) {
      //Formateamos las fechas para poder hacer el filter
      // let formattedFrom = new Date(`${data.from}T00:00:000Z`);
      // let formattedTo = new Date(`${data.to}T00:00:000Z`);
      let formattedFrom = date.formatDate(new Date(`${data.from}T00:00`), 'DD/MM/YYYY');
      let formattedTo = date.formatDate(new Date(`${data.to}T00:00`), 'DD/MM/YYYY');

      this.$q.loading.show({
        message: "Buscando en el rango de fecha solicitado, por favor espere..."
      });
      setTimeout(async () => {
        try {
          let data_mayor = this.data.filter( user => user.fecha_control >= formattedFrom );
          let data_final = data_mayor.filter( user => user.fecha_control <= formattedTo );
          if (data_final.length > 0) {
            this.rederComponent = false;
            this.data.length = 0;
            data_final.forEach(element => {
              this.data.push({
                Celular_Personal: element.Celular_Personal,
                Foto: element.Foto,
                Password: element.Password,
                descripcionrol: element.descripcionrol,
                Estado: element.Estado,
                fechaprueba: element.fechaprueba,
                Id: element.Id,
                Id_Rol1: element.Id_Rol1,
                cedula_control: element.cedula_control,
                fecha_control: element.fecha_control,
                id_campo: element.id_campo,
                nombre_control: element.nombre_control,
                nombre_usuario: element.nombre_usuario,
                Estado_Actualizacion: element.Estado_Actualizacion,
                Primer_Apellido: element.Primer_Apellido,
                Primer_Nombre: element.Primer_Nombre,
                Segundo_Apellido: element.Segundo_Apellido,
                Segundo_Nombre: element.Segundo_Nombre,
                nombre_control: element.nombre_control,
                ucontrol_campo: element.ucontrol_campo,
                fecha_campo: element.fecha_campo,
                tabla: element.tabla,
                usuario: element.usuario,
                btn_edit: true,
                btn_status: true,
                btn_details: false,
                icon_btn_edit: "mdi-pencil",
                icon_btn_status: "power_settings_new",
                icon_btn_details: "mdi-eye-settings",
                title: `${element.Primer_Nombre} ${element.Segundo_Nombre ? element.Segundo_Nombre : '' } ${element.Primer_Apellido} ${element.Segundo_Apellido ? element.Segundo_Apellido : ''}`,
              })
            });
          } else {
            this.$q.notify({
              message: 'No econtramos coincidencias',
              type: 'warning'
            })
          }
        } catch (e) {
          console.log(e);
          if (e.message === "Network Error") {
            e = e.message;
          }
          if (e.message === "Request failed with status code 404") {
            e = "URL de solicitud no existe, err 404";
          } else {
            e = e.message;
          }
        } finally {
          this.rederComponent = true;
          this.$q.loading.hide();
        }
      }, 2000);
    },
    reload() {
      // this.tab = "users";
      // this.rederComponent = false;
      // this.edit_form = false;
      // Se hace el reload, para ello se debe eliminar el componente componenTable antes de hacer las peticiones y luego rendereizarlo de nuevo
      setTimeout( ()=> {
        this.getData();
      }, 500)
    },
  }
}
</script>

<style scoped>
p{
  font-size: 55px;
}
</style>
