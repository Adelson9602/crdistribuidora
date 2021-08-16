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
        <q-tab name="articles" label="Articulos" icon="inventory_2" />
        <q-tab
          name="create_article"
          :label="!article_edit ? 'Agregar articulo' : 'Editar articulo'" 
  
          icon="add_business"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="articles">
          <component-table
            class="q-mt-md height-table"
            proptitle="Articulos"
            :propdata="data"
            :propcolumns="columns"
            :propgrid="true"
            :propflat="true"
            :propactions="true"
            @getrangedata="getArticleRang"
            @onedit="editArticle"
            @tostatus="openDialogStatus"
           v-if="rendercomponent"
      >
       <template v-slot:toggle>
           
            <q-toggle v-model="filter_pendientes" label="Articulos pendientes" />
          </template>
      </component-table>
          <!-- Dialogo para activar o inactivar una meta -->
          <component-dialog-enable
            :dialog="enable_diable"
            :options_dialog="options_status"
            @cancel="enable_diable = false"
            @changeStatus="changeStatus"
          />
        </q-tab-panel>

        <q-tab-panel name="create_article">
          <component-add-article @reload="reload" :edit_data="article_edit"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddArticle from "components/Warehouse/ComponentAddArticle";
import componentTable from "components/Generals/ComponentTable";
import ComponentDialogEnable from "components/Generals/ComponentDialogEnable";
import { mapActions, mapState } from "vuex";
let categorias = [];
let ums = [];
export default {
  name: "Articles",
  components: {
    ComponentAddArticle,
    componentTable,
    ComponentDialogEnable,
  },
  data() {
    return {
      tab: "articles",
      date_range: {
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
          name: "Art_Codigo_inv",
          required: true,
          label: "Codigo",
          align: "center",
          field: "Art_Codigo_inv",
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
          name: "Art_Descripcion",
          required: true,
          label: "Descripcion articulo",
          align: "center",
          field: "Art_Descripcion",
          sortable: true,
        },
        {
          name: "Prefijo",
          required: true,
          label: "UNDM",
          align: "center",
          field: "Prefijo",
          sortable: true,
        },
        {
          name: "Art_Stockminimo",
          required: true,
          label: "Stock min articulo",
          align: "center",
          field: "Art_Stockminimo",
          sortable: true,
        },
        {
          name: "Cat_Nombre",
          required: true,
          label: "Categoria",
          align: "center",
          field: "Cat_Nombre",
          sortable: true,
        },
         {
          name: "Art_ubicacion",
          required: true,
          label: "Ubicacion",
          align: "center",
          field: "Art_ubicacion",
          sortable: true,
        },
        {
          name: "name_estado",
          required: true,
          label: "Estado",
          align: "center",
          field: "name_estado",
          sortable: true,
        },
        {
          name: "Art_User_control",
          required: true,
          label: "User Control",
          align: "center",
          field: "Art_User_control",
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
          name: "Art_Fecha_control",
          required: true,
          label: "Fecha Control",
          align: "center",
          field: "Art_Fecha_control",
          sortable: true,
        },
      ],
      data: [],
      datageneral:[],
      rendercomponent: true,
      filter_pendientes:false,
      article_edit: null,
      enable_diable: false,
      options_status: {
        title: null,
        msg: null
      },
    };
  },
  computed: {
    ...mapState('auth', ['user_logged']),
    data_user(){
      return this.user_logged;
    }
  },
  created() {
    this.getData();
  },
  watch: {
    tab(value){
      if(value == "articles"){
        this.article_edit = null;
      }
    },
     filter_pendientes(value) {
   
      if (value) {
       this.rendercomponent = false;
        let dataselect = this.datageneral.filter(credit => credit.Art_Estado == 0);
        this.data.length = 0;

        setTimeout(() => {
          this.data = dataselect;

          this.rendercomponent = true;
        }, 300);
      } else {
        setTimeout(this.getData(), 300);
      }
    },
  },
  methods: {
    ...mapActions("warehouse", [
      "getAllArticles",
      "requestgetDataArticlesRange",
      "addArticle",
      "getCategoriasAlmacen",
    ]),
    ...mapActions('master', [
      'getAllUm'
    ]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo articulos existentes, por favor espere...",
      });
      setTimeout(async () => {
        try {
          const resgetDataArticles = await this.getAllArticles().then(
            (res) => {
              return res.data;
            }
          );
          // console.log({
          //   msg: 'Repeusta get artículos',
          //   data: resgetDataArticles,
          // });
          if (resgetDataArticles.ok) {
            if (resgetDataArticles.result) {
              this.data.length = 0;
              this.datageneral.length=0;
              resgetDataArticles.data.forEach((element) => {
                this.data.push({
                  Id: element.Id,
                  Art_Id: element.Art_Id,
                  Art_Codigo_inv: element.Art_Codigo_inv,
                  Art_Nombre: element.Art_Nombre,
                  Art_Descripcion: element.Art_Descripcion,
                  Prefijo: element.Prefijo,
                  Art_Stockminimo: element.Art_Stockminimo,
                  Cat_Nombre: element.Cat_Nombre,
                  name_estado: element.Art_Estado == 1 ? "ACTIVO" : "INACTIVO",  
                  Art_Estado: element.Art_Estado,
                  Art_User_control: element.Art_User_control,
                  Per_Nombre: element.Per_Nombre,
                  Art_Fecha_control: element.Art_Fecha_control,
                  Art_ubicacion: element.Art_ubicacion,
                  title: element.Art_Nombre,
                  Estado: element.Art_Estado,
                  status: element.Art_Estado,
                  btn_edit: true,
                  btn_status: true,
                  // btn_details: true,
                  // btn_pdf: true,
                  icon_btn_edit: "mdi-pencil",
                  icon_btn_status: "power_settings_new",
                  // icon_btn_details: "mdi-eye-settings",
                });
                 this.datageneral.push({
                  Id: element.Id,
                  Art_Id: element.Art_Id,
                  Art_Codigo_inv: element.Art_Codigo_inv,
                  Art_Nombre: element.Art_Nombre,
                  Art_Descripcion: element.Art_Descripcion,
                  Prefijo: element.Prefijo,
                  Art_Stockminimo: element.Art_Stockminimo,
                  Cat_Nombre: element.Cat_Nombre,
                  name_estado: element.Art_Estado == 1 ? "ACTIVO" : "INACTIVO",  
                  Art_Estado: element.Art_Estado,
                  Art_User_control: element.Art_User_control,
                  Per_Nombre: element.Per_Nombre,
                  Art_Fecha_control: element.Art_Fecha_control,
                  Art_ubicacion: element.Art_ubicacion,
                  title: element.Art_Nombre,
                  Estado: element.Art_Estado,
                  status: element.Art_Estado,
                  btn_edit: true,
                  btn_status: true,
                  // btn_details: true,
                  // btn_pdf: true,
                  icon_btn_edit: "mdi-pencil",
                  icon_btn_status: "power_settings_new",
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

          // Obtenemos las categorías de los productos
          const res_categorias = await this.getCategoriasAlmacen().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get categorias articulos',
          //   data: res_categorias
          // });
          if(res_categorias.ok){
            if(res_categorias.result){
              categorias.length = 0;
              res_categorias.data.forEach(element => {
                if(element.Cat_Estado == 1){
                  categorias.push({
                    value: element.Cat_Id,
                    label: element.Cat_Nombre,
                  })
                }
              });
            } else {
              this.$q.notify({
                message: res_categorias.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_categorias.message);
          }

          // Obtenemos las unidades de medidadas
          const res_um = await this.getAllUm().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get unidades de medida',
          //   data: res_um
          // });
          if(res_um.ok){
            if(res_um.result){
              ums.length = 0;
              res_um.data.forEach(element => {
                if(element.Um_Estado == 1){
                  ums.push({
                    value: element.Um_Id,
                    label: element.Um_Unidad,
                    prefijo: element.Prefijo
                  })
                }
              });
            } else {
              this.$q.notify({
                message: res_um.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_um.message);
          }
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
      data.base = process.env.__BASE__;
      this.$q.loading.show({
        message:
          "Buscando Articulos en el rango de fecha solicitado, por favor espere...",
      });
      setTimeout(async () => {
        try {
          const resrequestgetDataArticlesRange =
            await this.requestgetDataArticlesRange(data).then((res) => {
              return res.data;
            });
          console.log({
            msg: "Respuesta get articulo por rango de fecha",
            data: resrequestgetDataArticlesRange,
          });
          this.data.length = 0;
          if (resrequestgetDataArticlesRange.ok) {
            if (resrequestgetDataArticlesRange.result) {
              resrequestgetDataArticlesRange.data.forEach((element) => {
                this.data.push({
                  Id: element.Id,
                  Art_Id: element.Art_Id,
                  Art_Codigo_inv: element.Art_Codigo_inv,
                  Art_Nombre: element.Art_Nombre,
                  Art_Descripcion: element.Art_Descripcion,
                  Prefijo: element.Prefijo,
                  Art_Stockminimo: element.Art_Stockminimo,
                  Cat_Nombre: element.Cat_Nombre,
                  Art_Estado: element.Art_Estado == 1 ? "ACTIVO" : "INHABILITADO",
                  Art_User_control: element.Art_User_control,
                  Per_Nombre: element.Per_Nombre,
                  Art_ubicacion: element.Art_ubicacion,
                  Art_Fecha_control: element.Art_Fecha_control,
                  status: element.Art_Estado,
                  btn_edit: true,
                  btn_status: true,
                  // btn_details: true,
                  // btn_pdf: true,
                  icon_btn_edit: "mdi-pencil",
                  icon_btn_status: "power_settings_new",
                  // icon_btn_details: "mdi-eye-settings",
                });
              });
            } else {
              this.$q.notify({
                message: resrequestgetDataArticlesRange.message,
                type: "warning",
              });
            }
          } else {
            this.data.length = 0;
            throw resrequestgetDataArticlesRange.message;
          }
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
    editArticle(row){
      this.article_edit = row;
      this.tab = "create_article";
    },
    reload() {
      this.tab = "articles";
      this.edit_form = false;
      setTimeout( ()=> {
        this.getData();
      }, 500)
    },
    openDialogStatus(row){
      // Buscamos la categoria del producto asignada
      let categoria = categorias.find( categoria => categoria.label.toLowerCase() == row.Cat_Nombre.toLowerCase());
      // Buscamos la unidad de medida asiganada
      let um = ums.find( um => um.prefijo.toLowerCase() == row.Prefijo.toLowerCase())
      this.article_edit = {
        base: null,
        Art_Id: row.Art_Id,
        Cat_Id: categoria.value,
        Art_Codigo_inv: row.Art_Codigo_inv,
        Art_Nombre: row.Art_Nombre,
        Art_Descripcion: row.Art_Descripcion,
        Art_Stockminimo: row.Art_Stockminimo,
        Art_ubicacion: row.Art_ubicacion,
        Um_Id: um.value,
        Art_Imagen: row.Art_Imagen,
        Art_Estado: row.Art_Estado == 1 ? 0 : 1,
        Art_User_control: this.data_user.Per_Num_documento
      }
      this.options_status.title = row.Art_Estado == 1 ? 'Desactivar artículo' : 'Activar artículo';
      this.options_status.msg = row.Art_Estado == 1 ? 'Está desactivando este artículo, por lo que ya no estará disponible en el sistema, ¿está serguro que desea desactivar?' : 'Está activando este artículo, por lo que estará disponible para su uso en el sistema, ¿está seguro de activarlo?';
      this.enable_diable = true;
    },
    changeStatus(){
      this.$q.loading.show({
        message: 'Estamos cambiando el estado del artículo, por favor espere...'
      });
      setTimeout( async() => {
        try {
          this.article_edit.base = process.env.__BASE__;
          const res_update = await this.addArticle(this.article_edit).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta insert update articulo',
            data: res_update
          });
          if(res_update.ok){
            if(res_update.data.affectedRows){
              this.$q.notify({
                message: 'Estado actualizado',
                type: 'positive'
              });
              setTimeout(() => {
                this.enable_diable = false;
                this.getData();
              }, 500)
            } else {
              this.$q.notify({
                message: 'No se actualizó el estado',
                type: 'warning'
              })
            }
          }
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
      }, 2000)
    },
  },
};
</script>

<style scoped>
p {
  font-size: 55px;
}
</style>
