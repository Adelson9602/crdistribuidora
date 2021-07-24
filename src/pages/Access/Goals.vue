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
          />
        </q-tab-panel>

        <q-tab-panel name="formGoals">
          
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions, } from 'vuex';
import ListMetas from "components/Generals/ComponentTable";
export default {
  name: 'PageIndex',
  components: {
    ListMetas,
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
      data: [],
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
      label: 'Agregar metas',
      tab: "goals",
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('access', [
      'getGoals'
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
    }
  }
}
</script>

<style scoped>
p{
  font-size: 55px;
}
</style>