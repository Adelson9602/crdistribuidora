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
        <q-tab name="percentage" label="Porcentaje" icon="inventory_2" />
        <q-tab
          name="create_percentage"
          :label="!percentage_edit ? 'Agregar %' : 'Editar %'"
          icon="add_business"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="percentage">
          <component-table
            class="q-mt-md height-table"
            proptitle="Porcentaje"
            :propdata="data"
            :propcolumns="columns"
            :propgrid="true"
            :propflat="true"
            :propbtns="btns"
            :propactions="true"
            @onedit="editPorcentaje"
            @tostatus="openDialogStatus"
          />
          <!-- Dialogo para activar o inactivar una meta -->
          <component-dialog-enable
            :dialog="enable_diable"
            :options_dialog="options_status"
            @cancel="enable_diable = false"
            @changeStatus="changeStatus"
          />
        </q-tab-panel>

        <q-tab-panel name="create_percentage">
          <component-add-percent-sales
            @reload="reload"
            :edit_data="percentage_edit"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddPercentSales from "src/components/Master/ComponentAddPercentSales.vue";
import componentTable from "components/Generals/ComponentTable";
import ComponentDialogEnable from "components/Generals/ComponentDialogEnable";
import { mapActions, mapState } from "vuex";
let categorias = [];
let ums = [];
export default {
  name: "Percentage",
  components: {
    componentTable,
    ComponentDialogEnable,
    ComponentAddPercentSales
  },
  data() {
    return {
      tab: "percentage",
      date_range: {
        to: null,
        from: null
      },

     
                
                  
           
      columns: [
        {
          name: "Id",
          required: true,
          label: "Id ",
          align: "center",
          field: "Id",
          sortable: true
        },
        {
          name: "Pv_Descripcion",
          required: true,
          label: "Descripcion",
          align: "center",
          field: "Pv_Descripcion",
          sortable: true
        },
        {
          name: "Pv_Prcentaje",
          required: true,
          label: "% de Venta",
          align: "center",
          field: "Pv_Prcentaje",
          sortable: true
        },
        {
          name: "name_estado",
          required: true,
          label: "Estado",
          align: "center",
          field: "name_estado",
          sortable: true
        },
        {
          name: "Pv_User_control",
          required: true,
          label: "User control",
          align: "center",
          field: "Pv_User_control",
          sortable: true
        },
        {
          name: "Per_Nombre",
          required: true,
          label: "Nombre control",
          align: "center",
          field: "Per_Nombre",
          sortable: true
        },
        {
          name: "Pv_Fecha_control",
          required: true,
          label: "Fecha control",
          align: "center",
          field: "Pv_Fecha_control",
          sortable: true
        }
       
      ],
      data: [],
      btns: {
        range_date: false,
        btn_export_pdf: true,
        export_excel: true
      },
      percentage_edit: null,
      enable_diable: false,
      options_status: {
        title: null,
        msg: null
      }
    };
  },
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
  },
  created() {
    this.getData();
  },
  watch: {
    tab(value) {
      if (value == "percentage") {
        this.percentage_edit = null;
      }
    }
  },
  methods: {
    ...mapActions("master", [
      "getAllPorcentaje",
      "addPorcentaje",

    ]),
    ...mapActions("master", ["getAllUm"]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo Informacion existentes, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const resgetDataPorcentaje = await this.getAllPorcentaje().then(
            res => {
              return res.data;
            }
          );
          // console.log({
          //   msg: 'Repeusta get artículos',
          //   data: resgetDataArticles,
          // });
          if (resgetDataPorcentaje.ok) {
            if (resgetDataPorcentaje.result) {
              this.data.length = 0;
              resgetDataPorcentaje.data.forEach(element => {
                this.data.push({
                  Id: element.Id,
                  Pv_Id: element.Pv_Id,
                  Pv_Descripcion: element.Pv_Descripcion,
                  Pv_Prcentaje: element.Pv_Prcentaje,
                  name_estado: element.Pv_Estado == 1 ? "ACTIVO" : "INACTIVO",
                  Pv_Estado: element.Pv_Estado,
                  Pv_User_control: element.Pv_User_control,
                  Per_Nombre: element.Per_Nombre,
                  Pv_Fecha_control: element.Pv_Fecha_control,
                  title: element.Pv_Descripcion,
                  Estado: element.Pv_Estado,
                  status: element.Pv_Estado,
                  btn_edit: true,
                  btn_status: true,
                  // btn_details: true,
                  // btn_pdf: true,
                  icon_btn_edit: "mdi-pencil",
                  icon_btn_status: "power_settings_new"
                  // icon_btn_details: "mdi-eye-settings",
                });
              });
            } else {
              this.$q.notify({
                message: resgetDataPorcentaje.message,
                type: "warning"
              });
            }
          } else {
            this.data.length = 0;
            throw resgetDataPorcentaje.message;
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
            type: "negative"
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },

    editPorcentaje(row) {
      this.percentage_edit = row;
      this.tab = "create_percentage";
    },
    reload() {
      this.tab = "percentage";
      this.edit_form = false;
      setTimeout(() => {
        this.getData();
      }, 500);
    },
    openDialogStatus(row) {
      this.percentage_edit = {
        base: null,
        Id: row.Id,
        Pv_Id: row.Pv_Id,
        Pv_Descripcion: row.Pv_Descripcion,
        Pv_Prcentaje: row.Pv_Prcentaje,
        name_estado: row.Pv_Estado == 1 ? "ACTIVO" : "INACTIVO",
        Pv_Estado: row.Pv_Estado == 1 ? 0 : 1,
        Pv_User_control: this.data_user.Per_Num_documento,
        Per_Nombre: row.Per_Nombre,
        Pv_Fecha_control: row.Pv_Fecha_control,
        title: row.Pv_Descripcion,
        Estado: row.Pv_Estado,
        status: row.Pv_Estado
      };
      this.options_status.title =
        row.Pv_Estado == 1 ? "Desactivar Porcentaje" : "Activar Porcentaje";
      this.options_status.msg =
        row.Pv_Estado == 1
          ? "Está desactivando este Porcentaje, por lo que ya no estará disponible en el sistema, ¿está serguro que desea desactivar?"
          : "Está activando este Porcentaje, por lo que estará disponible para su uso en el sistema, ¿está seguro de activarlo?";
      this.enable_diable = true;
    },
    changeStatus() {
      this.$q.loading.show({
        message: "Estamos cambiando el estado del Porcentaje, por favor espere..."
      });
      setTimeout(async () => {
        try {
          this.percentage_edit.base = process.env.__BASE__;
          const res_update = await this.addPorcentaje(this.percentage_edit).then(
            res => {
              return res.data;
            }
          );
          // console.log({
          //   msg: "Respuesta insert update porcentaje",
          //   data: res_update
          // });
          if (res_update.ok) {
            if (res_update.data.affectedRows) {
              this.$q.notify({
                message: "Estado actualizado",
                type: "positive"
              });
              setTimeout(() => {
                this.enable_diable = false;
                this.getData();
              }, 500);
            } else {
              this.$q.notify({
                message: "No se actualizó el estado",
                type: "warning"
              });
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
            type: "negative"
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    }
  }
};
</script>

<style scoped>
p {
  font-size: 55px;
}
</style>
