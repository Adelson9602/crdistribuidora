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
        <q-tab name="warranties" label="Salidas" icon="task_alt"/>
        <q-tab name="add_warranties" label="Agregar salida" icon="add_task"/>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="warranties">
          <component-table
              class="q-mt-md"
              proptitle="Salidas"
              :propdata="data"
              :propcolumns="columns"
              :propgrid="true"
              :propflat="true"
               :propexcel="excel"
              :proppdf="optionpdf"
              :propbtns="btns"
              :proppagination="initial_pagination"
              @onedit="editWarranty"
            />
        </q-tab-panel>

        <q-tab-panel name="add_warranties">
          <component-add-warranties @reload="reload"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import ComponentAddWarranties from 'components/Purchase/ComponentAddWarranties';
import componentTable from "components/Generals/ComponentTable";
import { mapActions } from 'vuex';
export default {
  name: 'DeparturesGuarantees',
  components: {
    ComponentAddWarranties,
    componentTable
  },
  data(){
    return {
      tab: 'warranties',
      columns: [
        {
          name: 'Art_Id',
          align: 'center',
          label: 'ID articulo',
          sortable: true,
          field: 'Art_Id'
        },
        {
          name: 'Art_Nombre',
          align: 'center',
          label: 'Nombre articulo',
          sortable: true,
          field: 'Art_Nombre'
        },
        {
          name: 'Mov_Id',
          align: 'center',
          label: 'ID movimiento',
          sortable: true,
          field: 'Mov_Id'
        },
        {
          name: 'Mov_Descripcion',
          align: 'center',
          label: 'Descripción movimiento',
          sortable: true,
          field: 'Mov_Descripcion'
        },
        {
          name: 'Sg_Cant',
          align: 'center',
          label: 'Cantidad',
          sortable: true,
          field: 'Sg_Cant'
        },
      ],
       excel: {
        columns:[
        {
          label: 'ID articulo',
          field: 'Art_Id'
        },
        {
          label: 'Nombre articulo',
          field: 'Art_Nombre'
        },
        {
          label: 'ID movimiento',
          field: 'Mov_Id'
        },
        {
          label: 'Descripción movimiento',
          field: 'Mov_Descripcion'
        },
        {
          label: 'Cantidad',
          field: 'Sg_Cant'
        },
      ],
        data: [],
        title: "Salidas proveedor"
      },
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
        btn_export_pdf: false,
        export_excel: true
      },
      initial_pagination: {
        page: 1,
        rowsPerPage: 9,
      },
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('shopping', [
      'getWaraniesOutput',
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo salidas, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_waranties = await this.getWaraniesOutput().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get garantias',
            data: res_waranties
          });
          if(res_waranties.ok){
            if(res_waranties.result){
              this.data.length = 0 ;
              res_waranties.data.forEach( warranty => {
                this.data.push({
                  Art_Id: warranty.Art_Id,
                  Art_Nombre: warranty.Art_Nombre,
                  Mov_Descripcion: warranty.Mov_Descripcion,
                  Mov_Id: warranty.Mov_Id,
                  Sg_Cant: warranty.Sg_Cant,
                  title: warranty.Art_Nombre,
                  btn_edit: true,
                  icon_btn_details: 'visibility',
                  btn_details: true,
                  icon_btn_edit: 'edit',
                })
              });
            } else {
              this.$q.notify({
                message: 'No hay salidas',
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_waranties.message);
          }
          this.excel.data = this.data;
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
    editWarranty(){

    },
    reload(){
      this.tab = 'warranties';
      setTimeout(this.getData(), 200)
    }
  }
}
</script>

<style scoped>

</style>