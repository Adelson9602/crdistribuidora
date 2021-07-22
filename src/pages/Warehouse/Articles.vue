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
          label="Agregar articulo"
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
            @getrangedata="getArticleRang"
          />
        </q-tab-panel>

        <q-tab-panel name="create_article">
          <component-add-article @reload="reload"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddArticle from "components/Warehouse/ComponentAddArticle";
import componentTable from "components/Generals/ComponentTable";
import { mapActions } from "vuex";
export default {
  name: "Articles",
  components: {
    ComponentAddArticle,
    componentTable,
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
          name: "Art_Estado",
          required: true,
          label: "Estado",
          align: "center",
          field: "Art_Estado",
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
    };
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("warehouse", [
      "getAllArticles",
      "requestgetDataArticlesRange",
    ]),

    getData() {
      this.$q.loading.show({
        message:
          "Obteniendo los ultimos 10 articulos existentes, por favor espere...",
      });
      setTimeout(async () => {
        try {
          const resgetDataArticles = await this.getAllArticles().then(
            (res) => {
              return res.data;
            }
          );
          console.log({
            msg: resgetDataArticles.message,
            data: resgetDataArticles,
          });
          if (resgetDataArticles.ok) {
            if (resgetDataArticles.result) {
              this.data.length = 0;
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
                  Art_Estado:
                  element.Art_Estado == 1 ? "ACTIVO" : "INACTIVO",
                  Art_User_control: element.Art_User_control,
                  Per_Nombre: element.Per_Nombre,
                  Art_Fecha_control: element.Art_Fecha_control,
                  title: element.Art_Nombre,
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
                c;
                // console.log(element);
                this.data.push({
                  Id: element.Id,
                  Art_Id: element.Art_Id,
                  Art_Codigo_inv: element.Art_Codigo_inv,
                  Art_Nombre: element.Art_Nombre,
                  Art_Descripcion: element.Art_Descripcion,
                  Prefijo: element.Prefijo,
                  Art_Stockminimo: element.Art_Stockminimo,
                  Cat_Nombre: element.Cat_Nombre,
                  Art_Estado:
                    element.Art_Estado == 1 ? "ACTIVO" : "INHABILITADO",
                  Art_User_control: element.Art_User_control,
                  Per_Nombre: element.Per_Nombre,
                  Art_Fecha_control: element.Art_Fecha_control,

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
    reload() {
      this.tab = "articles";
      this.edit_form = false;
      setTimeout( ()=> {
        this.getData();
      }, 500)
    },
  },
};
</script>

<style scoped>
p {
  font-size: 55px;
}
</style>
