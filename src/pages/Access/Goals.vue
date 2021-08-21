<template>
  <q-page padding>
    <!-- content -->
    <q-card class="height-card_page q-pa-md">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="goals" label="Metas" />
        <q-tab name="formGoals" :label="label" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="goals" class="q-gutter-sm">
          <list-metas
            :propdata="data"
            :propcolumns="columns"
            proptitle="Metas"
            :proppdf="optionpdf"
            :propflat="true"
            :propgrid="true"
            :propexcel="excel"
            :propactions="true"
            :propbtns="btns"
            @tostatus="openDialogStatus"
            :proppagination="initial_pagination"
            @onedit="editGoal"
          />
          <!-- Dialogo para activar o inactivar una meta -->
          <component-dialog-enable
            :dialog="enable_diable"
            :options_dialog="options_status"
            @cancel="enable_diable = false"
            @changeStatus="changeStatus"
          />
        </q-tab-panel>

        <q-tab-panel name="formGoals">
          <component-form-goals
            @reload="reload"
            :data_edit="goal_edit"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ListMetas from "components/Generals/ComponentTable";
import ComponentDialogEnable from "components/Generals/ComponentDialogEnable";
import ComponentFormGoals from "components/Access/ComponentFormGoals";
export default {
  name: 'PageIndex',
  components: {
    ListMetas,
    ComponentDialogEnable,
    ComponentFormGoals
  },
  data(){
    return {
      columns: [
        {
          name: 'Met_Fecha_control',
          aling: 'center',
          label: 'Fecha creación',
          sortable: true,
          field: 'Met_Fecha_control',
        },
        {
          name: 'Met_User_control',
          aling: 'center',
          label: 'Creado por',
          sortable: true,
          field: 'Met_User_control',
        },
        {
          name: 'Met_porcentaje',
          aling: 'center',
          label: 'Porcentaje meta',
          sortable: true,
          field: 'Met_porcentaje',
        },
        {
          name: 'Met_vdesde',
          aling: 'center',
          label: 'Incio',
          sortable: true,
          field: 'Met_vdesde',
        },
        {
          name: 'Met_vhasta',
          aling: 'center',
          label: 'Hasta',
          sortable: true,
          field: 'Met_vhasta',
        },
        {
          name: 'Per_Nombre',
          aling: 'center',
          label: 'Nombres',
          sortable: true,
          field: 'Per_Nombre',
        },
        {
          name: 'name_estado',
          aling: 'center',
          label: 'Estado',
          sortable: true,
          field: 'name_estado',
        },
      ],
      excel: {
        columns:  [
        {
          label: 'Fecha creación',
          field: 'Met_Fecha_control',
        },
        {
         
          label: 'Creado por',
         
          field: 'Met_User_control',
        },
        {
         
          label: 'Porcentaje meta',
         
          field: 'Met_porcentaje',
        },
        {
         
          label: 'Incio',
         
          field: 'Met_vdesde',
        },
        {
         
          label: 'Hasta',
         
          field: 'Met_vhasta',
        },
        {
         
          label: 'Nombres',
         
          field: 'Per_Nombre',
        },
        {
         
          label: 'Estado',
        
          field: 'name_estado',
        },
      ],
        data: [],
        title: 'Metas',
      },
      data: [],
      initial_pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 6
      },
      optionpdf: {
        columns: [
          { header: "Nombre", dataKey: "Pers_Nombres" },
          { header: "Apellido", dataKey: "Pers_Apellidos" },
          { header: "Cedula", dataKey: "UsuarioUser" },
          { header: "Celular", dataKey: "Pers_Celular" },
          { header: "Email", dataKey: "Pers_Email" },
          { header: "Rol", dataKey: "Rol_Nombre" },
          { header: "Descripción del rol", dataKey: "Rol_Descripcion" },
          { header: "Estado", dataKey: "Usuario_Estado" }
        ],
        data: [],
        orientation: 'l', // l => landscape, p => portrait
        title: {
          title: 'Usuarios registrados',
          potitionx: 300,
          potitiony: 30,
        },
        styles: {
          font_size: 7,
        }
      },
      btns: {
        range_date: false,
        btn_export_pdf: false,
        export_excel: true
      },
      label: 'Agregar metas',
      tab: "goals",
      enable_diable: false,
      options_status: {
        title: null,
        msg: null
      },
      goal_edit: null
    }
  },
  watch: {
    tab(value){
      if(value == 'goals'){
        this.goal_edit = null
      }
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('access', [
      'getGoals',
      'insertUpdateGoals'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo metas, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_metas = await this.getGoals().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get metas',
            data: res_metas
          });
          if(res_metas.ok){
            if(res_metas.result){
              this.data.length = 0 ;
              res_metas.data.forEach( metas => {
                this.data.push({
                  Met_Estado: metas.Met_Estado,
                  Met_Fecha_control: metas.Met_Fecha_control,
                  Met_Id: metas.Met_Id,
                  Met_User_control: metas.Met_User_control,
                  Met_porcentaje: metas.Met_porcentaje,
                  Met_vdesde: metas.Met_vdesde,
                  Met_vhasta: metas.Met_vhasta,
                  Per_Nombre: metas.Per_Nombre,
                  name_estado: metas.name_estado,
                    
                  status: metas.Met_Estado,
                  btn_status: true,
                  icon_btn_status: 'power_settings_new',
                  btn_edit: true,
                  icon_btn_edit: 'edit',
                })
              });
            } else {
              this.$q.notify({
                message: res_metas.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_metas.message);
          }
          
          this.excel.data=this.data
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
    reload(){
      this.tab = "goals";
      setTimeout( () => {
        this.getData();
      }, 300)
    },
    openDialogStatus(row){
      this.goal_edit = {
        base: process.env.__BASE__,
        Met_Estado: row.Met_Estado == 1 ? 0 : 1,
        Met_Fecha_control: row.Met_Fecha_control,
        Met_Id: row.Met_Id,
        Met_User_control: row.Met_User_control,
        Met_porcentaje: row.Met_porcentaje,
        Met_vdesde: row.Met_vdesde,
        Met_vhasta: row.Met_vhasta,
        Per_Nombre: row.Per_Nombre,
        name_estado: row.name_estado,
      };
      this.options_status.title = row.Met_Estado == 1 ? 'Desactivar meta' : 'Activar meta';
      this.options_status.msg = row.Met_Estado == 1 ? 'Está desactivando esta meta, por lo que ya no estará disponible en el sistema, ¿está serguro que desea desactivar?' : 'Está activando esta meta, por lo que estará disponible para su uso en el sistema, ¿está seguro de activarla?';
      this.enable_diable = true;
    },
    changeStatus(){
      this.$q.loading.show({
        message: 'Estamos cambiando el estado de la meta, por favor espere...'
      });
      setTimeout(async()=> {
        try {
          const res_update = await this.insertUpdateGoals(this.goal_edit).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta update state meta',
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
          } else {
            throw new Error(res_update.message)
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
      })
    },
    editGoal(row){
      this.goal_edit = {
        base: process.env.__BASE__,
        Met_Estado: row.Met_Estado,
        Met_Fecha_control: row.Met_Fecha_control,
        Met_Id: row.Met_Id,
        Met_User_control: row.Met_User_control,
        Met_porcentaje: row.Met_porcentaje,
        Met_vdesde: row.Met_vdesde,
        Met_vhasta: row.Met_vhasta,
        Per_Nombre: row.Per_Nombre,
        name_estado: row.name_estado,
      };
      this.tab = "formGoals"
    }
  }
}
</script>

<style scoped>
p{
  font-size: 55px;
}
</style>