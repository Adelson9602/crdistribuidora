<template>
  <q-page padding>
    <q-card class="height-card_page">
      <q-card-section>
        <q-btn color="primary" icon="add" label="Agregar porcentaje" @click="dialog_add_percent = true" />
        <q-dialog v-model="dialog_add_percent" persistent>
          <q-card style="width: 700px; max-width: 80vw;">
            <q-bar dark class="bg-primary text-white">
              <div class="col text-center text-weight-bold">
                {{ edit_form ? 'Editar porcentaje' : 'Agregar porcentaje' }}
              </div>
              <q-btn flat round text-color="white" icon="close" size="8.5px" color="red" v-close-popup/>
            </q-bar>
            <q-card-section>
              <component-add-percent-sales
                @reload="reload"
                :edit_data="percentage_edit"
              />
            </q-card-section>
          </q-card>
        </q-dialog>
        <component-table
          class="q-mt-md height-table"
          proptitle="Porcentaje"
          :propdata="data"
          :propcolumns="columns"
          :propgrid="true"
          :propflat="true"
          :propbtns="btns"
          :propexcel="excel"
          :propactions="true"
          @onedit="editPorcentaje"
          @tostatus="openDialogStatus"
          @ondetails="addedIntegrante"
        />
        <!-- Dialogo para activar o inactivar una meta -->
        <component-dialog-enable
          :dialog="enable_diable"
          :options_dialog="options_status"
          @cancel="enable_diable = false"
          @changeStatus="changeStatus"
        />

        <q-dialog v-model="added_person" persistent>
          <q-card style="width: 700px; max-width: 80vw">
            <q-form @submit="savePersons">
              <q-bar dark class="bg-primary text-white">
                <div class="col text-center text-weight-bold">
                  Personas asociadas al porcentaje
                </div>
                <q-btn dense flat round icon="close" color="white" v-close-popup/>
              </q-bar>
              <q-card-section>
                <q-list bordered separator>
                  <q-item clickable v-ripple v-for="item in persons_percents" :key="item.documento">
                    <q-item-section>
                      <q-toggle v-model="item.associate" :label="item.nombre" color="green" checked-icon="check" unchecked-icon="clear"/>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="Guardar" color="primary" type="submit" />
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddPercentSales from "src/components/Master/ComponentAddPercentSales.vue";
import componentTable from "components/Generals/ComponentTable";
import ComponentDialogEnable from "components/Generals/ComponentDialogEnable";
import { mapActions, mapState } from "vuex";
let all_percent_user = [];
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
      excel: {
        columns: [
          {
            label: "Id ",
            field: "Id"
          },
          {
            label: "Descripcion",
            field: "Pv_Descripcion"
          },
          {
            label: "% de Venta",
            field: "Pv_Prcentaje"
          },
          {
            label: "Estado",
            field: "name_estado"
          },
          {
            label: "User control",
            field: "Pv_User_control"
          },
          {
            label: "Nombre control",
            field: "Per_Nombre"
          },
          {
            label: "Fecha control",
            field: "Pv_Fecha_control"
          }
        ],
        data: [],
        title: "Porcentaje"
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
        btn_export_pdf: false,
        export_excel: true
      },
      percentage_edit: null,
      enable_diable: false,
      options_status: {
        title: null,
        msg: null
      },
      dialog_add_percent: false,
      edit_form: false,
      added_person: false,
      persons_percents: [],
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
    dialog_add_percent(value) {
      if (!value) {
        this.percentage_edit = null;
        this.edit_form = false;
      }
    }
  },
  methods: {
    ...mapActions("master", ["getAllPorcentaje", "addPorcentaje", "percentsPersons", "getAllUm"]),
    ...mapActions("access", ["getPersons"]),
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
                  btn_details: true,
                  // btn_pdf: true,
                  icon_btn_edit: "mdi-pencil",
                  icon_btn_status: "power_settings_new",
                  icon_btn_details: "group_add",
                });
              });
              this.excel.data = this.data;
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

          const res_persons = await this.getPersons().then(res => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get personal",
          //   data: res_persons
          // });
          if (res_persons.ok) {
            if (res_persons.result) {
              this.persons_percents.length = 0;
              res_persons.data.forEach(persona => {
                if(persona.Usu_Estado == 1){
                  this.persons_percents.push({
                    nombre: persona.Per_Nombre,
                    documento: persona.Per_Num_documento,
                    associate: false,
                    Pv_Id: null,
                  });
                }
              });
            } else {
              this.$q.notify({
                message: res_persons.message,
                type: "warning"
              });
            }
          } else {
            throw new Error(res_persons.message);
          }
          const res_perc_persons = await this.percentsPersons().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get porcentaje con usuario',
            data: res_perc_persons
          });
          if (res_perc_persons.ok) {
            if (res_perc_persons.result) {
              all_percent_user.length = 0;
              res_perc_persons.data.forEach(porcentaje => {
                all_percent_user.push({
                  Pv_Id: porcentaje.Pv_Id,
                  Integrante: porcentaje.Integrante,
                  Estado: porcentaje.Estado
                })
              });
            } else {
              this.$q.notify({
                message: res_perc_persons.message,
                type: "warning"
              });
            }
          } else {
            throw new Error(res_perc_persons.message);
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
      this.edit_form = true;
      this.percentage_edit = row;
      this.dialog_add_percent = true;
    },
    reload() {
      this.tab = "percentage";
      this.edit_form = false;
      this.dialog_add_percent = false;
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
        message:
          "Estamos cambiando el estado del Porcentaje, por favor espere..."
      });
      setTimeout(async () => {
        try {
          this.percentage_edit.base = process.env.__BASE__;
          const res_update = await this.addPorcentaje(
            this.percentage_edit
          ).then(res => {
            return res.data;
          });
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
    },
    // Abre el dialog para agregar personas a los porcentajes
    addedIntegrante(row){
      this.percentage_edit = row;
      this.added_person = true;
      this.persons_percents.forEach( persona => {
        let result = all_percent_user.find( porcentaje => porcentaje.Integrante == persona.documento );
        console.log(result)
      })
    },
    savePersons(){
      this.$q.loading.show({
        message: 'Guardando, por favor espere...'
      });
      setTimeout(async() => {
        try {
          
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
      }, 1000)
    }
  }
};
</script>

<style scoped>
p {
  font-size: 55px;
}
</style>
