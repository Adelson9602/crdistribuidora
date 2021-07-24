<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <q-tabs
          v-model="tab"
          dense
          class="text-primary"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="provider" label="proveedores" icon="person_add"/>
          <q-tab name="add_provider" label="Agregar proveedor" icon="people"/>
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="provider">
            <q-form
              @submit="searchProvider"
              class="q-gutter-md"
            >
              <div class="row q-gutter-y-md">
                <div class="col-xs-12 col-md-3 col-lg-3 q-px-md">
                  <q-input v-model="nit_provider" type="text" hint="Número ingreso" mask="###############" counter/>
                </div>
                <div class="col-xs-12 col-md-3 col-lg-2 q-px-md row">
                  <q-btn label="Buscar" type="submit" icon="search" color="primary" class="self-center"/>
                </div>
              </div>
            </q-form>
            <component-table
              class="q-mt-md"
              proptitle="Proveedores"
              :propdata="data"
              :propcolumns="columns"
              :propgrid="true"
              :propflat="true"
              :proppdf="optionpdf"
              :propbtns="btns"
              :proppagination="initial_pagination"
              @onedit="editEntry"
              @ondetails="detailsEntry"
            />
          </q-tab-panel>

          <q-tab-panel name="add_provider">
            <component-add-provider/>
          </q-tab-panel>
        </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddProvider from 'components/Purchase/ComponentAddProvider';
import componentTable from "components/Generals/ComponentTable";
import { mapActions } from 'vuex';
export default {
  name: 'Categories',
  components: {
    ComponentAddProvider,
    componentTable
  },
  data(){
    return {
      tab: 'provider',
      columns: [
        {
          name: 'CP_Digito_verificacion',
          align: 'center',
          label: 'Digito verificación',
          sortable: true,
          field: 'CP_Digito_verificacion'
        },
        {
          name: 'CP_Fecha_control',
          align: 'center',
          label: 'Fecha creación',
          sortable: true,
          field: 'CP_Fecha_control'
        },
        {
          name: 'CP_Nit',
          align: 'center',
          label: 'NIT',
          sortable: true,
          field: 'CP_Nit'
        },
        {
          name: 'CP_Razon_social',
          align: 'center',
          label: 'Razon social',
          sortable: true,
          field: 'CP_Razon_social'
        },
        {
          name: 'CP_Telefono',
          align: 'center',
          label: 'Teléfono',
          sortable: true,
          field: 'CP_Telefono'
        },
        {
          name: 'CP_Direccion',
          align: 'center',
          label: 'Dirección',
          sortable: true,
          field: 'CP_Direccion'
        },
        {
          name: 'CP_Email',
          align: 'center',
          label: 'Email',
          sortable: true,
          field: 'CP_Email'
        },
        {
          name: 'CP_Urlweb',
          align: 'center',
          label: 'Sitio web',
          sortable: true,
          field: 'CP_Urlweb'
        },
        {
          name: 'Ciu_Nombre',
          align: 'center',
          label: 'Ciudad',
          sortable: true,
          field: 'Ciu_Nombre'
        },
        {
          name: 'CP_User_control',
          align: 'center',
          label: 'Documento creador',
          sortable: true,
          field: 'CP_User_control'
        },
        {
          name: 'Per_Nombre',
          align: 'center',
          label: 'Creado por',
          sortable: true,
          field: 'Per_Nombre'
        },
        {
          name: 'Tp_Desc_corta',
          align: 'center',
          label: 'Tipo documento',
          sortable: true,
          field: 'Tp_Desc_corta'
        },
        {
          name: 'name_estado',
          align: 'center',
          label: 'Estado',
          sortable: true,
          field: 'name_estado'
        },
        {
          name: 'name_tp',
          align: 'center',
          label: 'Tipo cliente',
          sortable: true,
          field: 'name_tp'
        },
      ],
      data: [],
      optionpdf: {
        columns: [
          { header: "Art_Codigo_inv", datakey: "Art_Codigo_inv"},
          { header: "Art_Id", datakey: "Art_Id"},
          { header: "Art_Nombre", datakey: "Art_Nombre"},
          { header: "Mov_Descripcion", datakey: "Mov_Descripcion"},
          { header: "Mov_Id", datakey: "Mov_Id"},
          { header: "Si_Cant", datakey: "Si_Cant"},
          { header: "id", datakey: "id"},
        ],
        data: [],
        orientation: 'l', // l => landscape, p => portrait
        title: {
          title: 'Inventario actual',
          potitionx: 300,
          potitiony: 30,
        },
        styles: {
          font_size: 7,
        }
      },
      btns: {
        range_date: false,
        btn_export_pdf: true,
        export_excel: true
      },
      initial_pagination: {
        page: 1,
        rowsPerPage: 9,
      },
      nit_provider: null
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('shopping', [
      'getProviders',
      'searchProviders'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo proveedores, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_provider = await this.getProviders().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get proveedor',
            data: res_provider
          });
          if(res_provider.ok){
            if(res_provider.result){
              this.data.length = 0 ;
              res_provider.data.forEach( provider => {
                if(provider.name_tp == 'PROVEEDOR'){
                  this.data.push({
                    CP_Digito_verificacion: provider.CP_Digito_verificacion,
                    CP_Direccion: provider.CP_Direccion,
                    CP_Email: provider.CP_Email,
                    CP_Estado: provider.CP_Estado,
                    CP_Fecha_control: provider.CP_Fecha_control,
                    CP_Nit: provider.CP_Nit,
                    CP_Razon_social: provider.CP_Razon_social,
                    CP_Telefono: provider.CP_Telefono,
                    CP_Urlweb: provider.CP_Urlweb,
                    CP_User_control: provider.CP_User_control,
                    Ciu_Id: provider.Ciu_Id,
                    Ciu_Nombre: provider.Ciu_Nombre,
                    Per_Nombre: provider.Per_Nombre,
                    Td_Id: provider.Td_Id,
                    Tp_Desc_corta: provider.Tp_Desc_corta,
                    Tp_Id: provider.Tp_Id,
                    name_estado: provider.name_estado,
                    name_tp: provider.name_tp,
                    Id: provider.id,
                    title: provider.CP_Razon_social,
                    btn_edit: true,
                    icon_btn_details: 'visibility',
                    btn_details: true,
                    icon_btn_edit: 'edit',
                  })
                }
              });
            } else {
              this.$q.notify({
                message: res_provider.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_provider.message);
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
    detailsEntry(id){
      this.$q.loading.show({
        message: 'Obteniendo detalle del ingreso, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_detail = await this.getDetailsEntry(id).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get detalle ingreso',
            data: res_detail
          });
          if(res_detail.ok){
            if(res_detail.result){
              this.data.length = 0 ;
              res_detail.data.forEach( ingreso => {
                this.data.push({
                })
              });
            } else {
              this.$q.notify({
                message: res_detail.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_detail.message);
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
    searchProvider(){
      this.$q.loading.show({
        message: 'Buscando proveedor, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_provider = await this.searchProviders(this.nit_provider).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get proveedor',
            data: res_provider
          });
          if(res_provider.ok){
            if(res_provider.result){
              this.data.length = 0 ;
              this.data.push({
                CP_Digito_verificacion: res_provider.data.CP_Digito_verificacion,
                CP_Direccion: res_provider.data.CP_Direccion,
                CP_Email: res_provider.data.CP_Email,
                CP_Estado: res_provider.data.CP_Estado,
                CP_Fecha_control: res_provider.data.CP_Fecha_control,
                CP_Nit: res_provider.data.CP_Nit,
                CP_Razon_social: res_provider.data.CP_Razon_social,
                CP_Telefono: res_provider.data.CP_Telefono,
                CP_Urlweb: res_provider.data.CP_Urlweb,
                CP_User_control: res_provider.data.CP_User_control,
                Ciu_Id: res_provider.data.Ciu_Id,
                Ciu_Nombre: res_provider.data.Ciu_Nombre,
                Per_Nombre: res_provider.data.Per_Nombre,
                Td_Id: res_provider.data.Td_Id,
                Tp_Desc_corta: res_provider.data.Tp_Desc_corta,
                Tp_Id: res_provider.data.Tp_Id,
                name_estado: res_provider.data.name_estado,
                name_tp: res_provider.data.name_tp,
                Id: res_provider.data.id,
                title: res_provider.data.CP_Razon_social,
                btn_edit: true,
                icon_btn_details: 'visibility',
                btn_details: true,
                icon_btn_edit: 'edit',
              })
            } else {
              this.$q.notify({
                message: res_provider.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_provider.message);
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
    editEntry(){

    }
  }
}
</script>

<style scoped>

</style>