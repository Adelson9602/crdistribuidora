<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-form
        @submit="getStockOnlyMovil"
      >
        <div class="row q-gutter-y-md">
          <div class="col-xs-12 col-md-3 col-lg-3 q-px-md">
            <q-select
              v-model="movil_selecte"
              :options="options_movil"
              hint="Seleccione una movil"
              :rules="[val => !!val || 'Debe seleccionar una movil']"
              clearable
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              @filter="filterMovil"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-md-3 col-lg-2 q-px-md row">
            <q-btn color="primary" icon="search" label="Buscar" type="submit" class="self-center"/>
          </div>
        </div>
      </q-form>
      <component-table
        class="q-mt-md"
        proptitle="Inventario actual"
        :propdata="data"
        :propcolumns="columns"
        :propgrid="true"
        :propflat="true"
         :propexcel="excel"
        :proppdf="optionpdf"
        :propbtns="btns"
        :proppagination="initial_pagination"
        :propactions="false"
      />
    </q-card>
  </q-page>
</template>

<script>
import componentTable from "components/Generals/ComponentTable";
import { mapActions } from 'vuex';
let all_movils = [];
export default {
  name: "Categories",
  components: {
    componentTable
  },
  data() {
    return {
      columns: [
        {
          name: 'id',
          align: 'center',
          label: 'ID',
          sortable: true,
          field: 'id'
        },
        {
          name: 'Art_Codigo_inv',
          align: 'center',
          label: 'Codigo articulo',
          sortable: true,
          field: 'Art_Codigo_inv'
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
          label: 'ID Movil',
          sortable: true,
          field: 'Mov_Id'
        },
        {
          name: 'Mov_Descripcion',
          align: 'center',
          label: 'Nombre Movil',
          sortable: true,
          field: 'Mov_Descripcion'
        },
        {
          name: 'Si_Cant',
          align: 'center',
          label: 'Cantidad en inventario',
          sortable: true,
          field: 'Si_Cant'
        },
      ],
       excel: {
        columns: [
        {
          label: 'ID',
          field: 'id'
        },
        {
          label: 'Codigo articulo',
          field: 'Art_Codigo_inv'
        },
        {
          label: 'Nombre articulo',
          field: 'Art_Nombre'
        },
        {
          label: 'ID Movil',
          field: 'Mov_Id'
        },
        {
          label: 'Nombre Movil',
          field: 'Mov_Descripcion'
        },
        {
          label: 'Cantidad en inventario',
          field: 'Si_Cant'
        },
      ],
        data: [],
        title: "Inventarios"
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
      
      options_movil: all_movils,
      movil_selecte: null,
      initial_pagination: {
        page: 1,
        rowsPerPage: 9,
      }
    };
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('warehouse', [
      'getStock',
      'getStockMovil'
    ]),
    ...mapActions('master', [
      'getMovil',
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo inventario, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_stock = await this.getStock().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get inventario general',
            data: res_stock
          });
          if(res_stock.ok){
            if(res_stock.result){
              this.data.length = 0 ;
              res_stock.data.forEach( stock => {
                this.data.push({
                  Art_Codigo_inv: stock.Art_Codigo_inv,
                  Art_Id: stock.Art_Id,
                  Art_Nombre: stock.Art_Nombre,
                  Mov_Descripcion: stock.Mov_Descripcion,
                  Mov_Id: stock.Mov_Id,
                  Si_Cant: stock.Si_Cant,
                  id: stock.id,
                  title: stock.Art_Nombre,
                  // btn_edit: true,
                  // btn_status: true,
                  // btn_details: true,
                  // btn_pdf: true,
                  // icon_btn_edit: "mdi-pencil",
                  // icon_btn_status: "power_settings_new",
                  // icon_btn_details: "mdi-eye-settings",
                })
              });
            } else {
              this.$q.notify({
                message: res_stock.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_stock.message);
          }

          const res_movil = await this.getMovil().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get moviles',
            data: res_movil
          });
          if(res_movil.ok){
            if(res_movil.result){
              all_movils.length = 0 ;
              res_movil.data.forEach( movil => {
                all_movils.push({
                  label: movil.Mov_Descripcion,
                  value: movil.Mov_Id,
                })
              });
            } else {
              this.$q.notify({
                message: res_stock.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_stock.message);
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
    getStockOnlyMovil(){
      this.$q.loading.show({
        message: 'Obteniendo inventario, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_stock = await this.getStockMovil(this.movil_selecte).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get inventario general',
            data: res_stock
          });
          if(res_stock.ok){
            if(res_stock.result){
              this.data.length = 0 ;
              res_stock.data.forEach( stock => {
                this.data.push({
                  Art_Codigo_inv: stock.Art_Codigo_inv,
                  Art_Id: stock.Art_Id,
                  Art_Nombre: stock.Art_Nombre,
                  Mov_Descripcion: stock.Mov_Descripcion,
                  Mov_Id: stock.Mov_Id,
                  Si_Cant: stock.Si_Cant,
                  id: stock.id,
                  title: stock.Art_Nombre,
                  btn_edit: true,
                  // btn_status: true,
                  // btn_details: true,
                  // btn_pdf: true,
                  icon_btn_edit: "mdi-pencil",
                  // icon_btn_status: "power_settings_new",
                  // icon_btn_details: "mdi-eye-settings",
                })
              });
            } else {
              this.$q.notify({
                message: res_stock.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_stock.message);
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
    editStock(row){
      this.category_edit = row;
    },
    reload(){
      setTimeout(()=> {
        this.getData()
      }, 200)
    },
    // Buscador para el select movil
    filterMovil (val, update, abort) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              this.options_movil = all_movils
            }
            else {
              const needle = val.toLowerCase()
              this.options_movil = all_movils.filter(v => v.lable.toLowerCase().indexOf(needle) > -1)
            }
          },
          // next function is available in Quasar v1.7.4+;
          // "ref" is the Vue reference to the QSelect
          ref => {
            if (val !== '' && ref.options.length > 0) {
              ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
            }
          }
        )
      }, 300)
    },
  }
};
</script>

<style scoped></style>
