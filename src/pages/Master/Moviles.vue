<template>
  <q-page padding>
    <q-card class="height-card_page">
      <q-card-section>
        <q-btn color="primary" icon="add" label="Agregar móvil" @click="dialog_add_cargo = true" />
        <q-dialog v-model="dialog_add_movil" persistent>
          <q-card style="width: 700px; max-width: 80vw;">
            <q-bar dark class="bg-primary text-white">
              <div class="col text-center text-weight-bold">
                {{ edit_form ? 'Editar cargo' : 'Agregar cargo'}}
              </div>
              <q-btn text-color="white" flat round icon="close" size="8.5px" color="green" v-close-popup/>
            </q-bar>
            <q-card-section>
              <!-- <component-add-charges @reload="reload" :edit_data="charges_edit" /> -->
            </q-card-section>
          </q-card>
        </q-dialog>
        <component-table
          class="q-mt-md height-table"
          proptitle="Moviles"
          :propdata="data_moviles"
          :propcolumns="columns_moviles"
          :propgrid="true"
          :propflat="true"
          :propbtns="btns"
          :propactions="true"
          @onedit="editMovil"
          @tostatus="openDialogStatus"
        />
        <!-- Dialogo para activar o inactivar una meta -->
        <!-- <component-dialog-enable
          :dialog="enable_diable"
          :options_dialog="options_status"
          @cancel="enable_diable = false"
          @changeStatus="changeStatus"
        /> -->
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import componentTable from "components/Generals/ComponentTable";
import componentDialogEnable from "components/Generals/ComponentDialogEnable";
import { mapActions } from 'vuex';
export default {
  name: 'PageMoviles',
  components: {
    componentTable,
    componentDialogEnable,
  },
  data(){
    return {
      data_moviles: [],
      columns_moviles: [
        {
          name: 'Mov_Id',
          align: 'center',
          label: 'ID Movil',
          sortable: true,
          field: 'Mov_Id'
        },
        {
          name: 'Mov_Descripcion',
          align: 'center',
          label: 'Nombre móvil',
          sortable: true,
          field: 'Mov_Descripcion'
        },
        {
          name: 'Mov_Fecha_control',
          align: 'center',
          label: 'Fecha creación',
          sortable: true,
          field: 'Mov_Fecha_control'
        },
        {
          name: 'Mov_User_control',
          align: 'center',
          label: 'Usuario creador',
          sortable: true,
          field: 'Mov_User_control'
        },
        {
          name: 'Estado',
          align: 'center',
          label: 'Estado',
          sortable: true,
          field: 'Estado'
        },
      ],
      btns: {
        range_date: true,
        btn_export_pdf: false,
        export_excel: false
      },
      charges_edit: null,
      enable_diable: false,
      options_status: {
        title: null,
        msg: null
      },
      dialog_add_movil: false,
      edit_form: false,
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('master', [
      'getAllMoviles'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo moviles, por favor espere...'
      });
      setTimeout(async() => {
        try {
          const res_mov = await this.getAllMoviles().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get moviles',
          //   data: res_mov
          // });
          if(res_mov.ok){
            if(res_mov.result){
              this.data_moviles.length = 0;
              res_mov.data.forEach( movil => {
                this.data_moviles.push({
                  Mov_Id: movil.Mov_Id,
                  Mov_Descripcion: movil.Mov_Descripcion,
                  Mov_Fecha_control: movil.Mov_Fecha_control,
                  Mov_User_control: movil.Mov_User_control,
                  Mov_Estado: movil.Mov_Estado,
                  Estado: movil.Mov_Estado == 1 ? 'ACTIVO' : 'INACTIVO',
                  title: movil.Mov_Descripcion,
                  status: movil.Mov_Estado,
                  btn_edit: true,
                  btn_status: true,
                  // btn_details: true,
                  // btn_pdf: true,
                  icon_btn_edit: "mdi-pencil",
                  icon_btn_status: "power_settings_new"
                  // icon_btn_details: "mdi-eye-settings",
                })
              });
            } else {
              this.$q.notify({
                methods: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_mov.message);
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
      }, 1000)
    },
    editMovil(){

    },
    openDialogStatus(){

    }
  }
}
</script>
