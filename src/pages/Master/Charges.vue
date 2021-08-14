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
        <q-tab name="charges" label="Cargos" icon="inventory_2" />
        <q-tab
          name="create_charges"
          :label="!charges_edit ? 'Agregar Cargos' : 'Editar Cargos'"
          icon="add_business"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="charges">
          <component-table
            class="q-mt-md height-table"
            proptitle="Cargos"
            :propdata="data"
            :propcolumns="columns"
            :propgrid="true"
            :propflat="true"
            :propbtns="btns"
            :propactions="true"
            @onedit="editCargos"
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

        <q-tab-panel name="create_charges">
          <component-add-charges
            @reload="reload"
            :edit_data="charges_edit"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddCharges from "src/components/Master/ComponentAddCharges.vue";
import componentTable from "components/Generals/ComponentTable";
import ComponentDialogEnable from "components/Generals/ComponentDialogEnable";
import { mapActions, mapState } from "vuex";
let categorias = [];
let ums = [];
export default {
  name: "charges",
  components: {
    componentTable,
    ComponentDialogEnable,
    ComponentAddCharges
  },
  data() {
    return {
      tab: "charges",
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
          name: "Car_Descripcion",
          required: true,
          label: "Descripcion",
          align: "center",
          field: "Car_Descripcion",
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
          name: "Car_User_control",
          required: true,
          label: "User control",
          align: "center",
          field: "Car_User_control",
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
          name: "Car_Fecha_control",
          required: true,
          label: "Fecha control",
          align: "center",
          field: "Car_Fecha_control",
          sortable: true
        }
       
      ],
      data: [],
      btns: {
        range_date: false,
        btn_export_pdf: true,
        export_excel: true
      },
      charges_edit: null,
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
      if (value == "charges") {
        this.charges_edit = null;
      }
    }
  },
  methods: {
    ...mapActions("master", [
      "getCargos",
      "addCargos",

    ]),
    ...mapActions("master", ["getAllUm"]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo Informacion existentes, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const resgetDataCargos = await this.getCargos().then(
            res => {
              return res.data;
            }
          );
          // console.log({
          //   msg: 'Repeusta get artículos',
          //   data: resgetDataArticles,
          // });
          if (resgetDataCargos.ok) {
            if (resgetDataCargos.result) {
              this.data.length = 0;
              resgetDataCargos.data.forEach(element => {
                this.data.push({
                  Id: element.Id,
                  Car_Id: element.Car_Id,
                  Car_Descripcion: element.Car_Descripcion,
                  name_estado: element.Car_Estado == 1 ? "ACTIVO" : "INACTIVO",
                  Car_Estado: element.Car_Estado,
                  Car_User_control: element.Car_User_control,
                  Per_Nombre: element.Per_Nombre,
                  Car_Fecha_control: element.Car_Fecha_control,
                  title: element.Car_Descripcion,
                  Estado: element.Car_Estado,
                  status: element.Car_Estado,
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
                message: resgetDataCargos.message,
                type: "warning"
              });
            }
          } else {
            this.data.length = 0;
            throw resgetDataCargos.message;
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

    editCargos(row) {
      this.charges_edit = row;
      this.tab = "create_charges";
    },
    reload() {
      this.tab = "charges";
      this.edit_form = false;
      setTimeout(() => {
        this.getData();
      }, 500);
    },
    openDialogStatus(row) {
      this.charges_edit = {
        base: null,
        Id: row.Id,
        Car_Id: row.Car_Id,
        Car_Descripcion: row.Car_Descripcion,
        Pv_Prcentaje: row.Pv_Prcentaje,
        name_estado: row.Car_Estado == 1 ? "ACTIVO" : "INACTIVO",
        Car_Estado: row.Car_Estado == 1 ? 0 : 1,
        Car_User_control: this.data_user.Per_Num_documento,
        Per_Nombre: row.Per_Nombre,
        Car_Fecha_control: row.Car_Fecha_control,
        title: row.Car_Descripcion,
        Estado: row.Car_Estado,
        status: row.Car_Estado
      };
      this.options_status.title =
        row.Car_Estado == 1 ? "Desactivar Cargos" : "Activar Cargos";
      this.options_status.msg =
        row.Car_Estado == 1
          ? "Está desactivando este Cargos, por lo que ya no estará disponible en el sistema, ¿está serguro que desea desactivar?"
          : "Está activando este Cargos, por lo que estará disponible para su uso en el sistema, ¿está seguro de activarlo?";
      this.enable_diable = true;
    },
    changeStatus() {
      this.$q.loading.show({
        message: "Estamos cambiando el estado del Cargos, por favor espere..."
      });
      setTimeout(async () => {
        try {
          this.charges_edit.base = process.env.__BASE__;
          const res_update = await this.addCargos(this.charges_edit).then(
            res => {
              return res.data;
            }
          );
          // console.log({
          //   msg: "Respuesta insert update Cargos",
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
