<template>
  <div>
    <div class="row">
      <div
        class="col-xs-12 col-sm-6 col-md-2 col-lg-2 q-px-sm"
        v-for="(value, index) in encebezado_venta"
        :key="index"
      >
        <q-field :hint="index" stack-label dense>
          <template v-slot:control>
            <div
              class="self-center full-width no-outline"
              tabindex="0"
            >
              {{ value }}
            </div>
          </template>
        </q-field>
      </div>
    </div>
    <q-form
      @submit="addProduct"
      class="q-gutter-md"
    >
      <!-- Productos -->
      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
          <q-select
            v-model="producto_selecte"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Producto"
            :options="options_products"
            @filter="filterProducts"
            :rules="[val => !!val || 'Producto es obligatorio']"
            ref="select_products"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 q-px-sm">
          <q-field hint="Cantidad vendida" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{cant_vendida}}</div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 q-px-sm">
          <q-field hint="Precio vendido" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{precio_vendido}}</div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 q-px-sm">
          <q-input
            v-model="cantidad"
            hint="Nueva cantidad"
            mask="############"
            :rules="[val => !!val || 'Cantidad es obligatorio',
              val => val != 0 || 'La cantida no puede ser 0'
            ]"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 q-px-sm">
          <q-btn color="primary" icon="check" type="submit" label="OK" class="hide-btn_submit"/>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <q-table
            title="Productos"
            :data="data_products_sales"
            :columns="columns_products"
            flat
            class="alto_tabla"
          />
        </div>
      </div>
      <div class="row q-gutter-y-md">
        <div class="col-xs-6 col-sm-4 col-md-4 q-px-sm">
          <q-field hint="Subtotal" stack-label dense>
            <template v-slot:control>
              <div
                class="self-center full-width no-outline"
                tabindex="0"
              >
                {{enc_nota_credito.Ev_Subtotal}}
              </div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-6 col-sm-4 col-md-4 q-px-sm">
          <q-field hint="Descuento total artículos" stack-label dense>
            <template v-slot:control>
              <div
                class="self-center full-width no-outline"
                tabindex="0"
              >
                {{enc_nota_credito.Ev_Des_total_art}}
              </div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-6 col-sm-4 col-md-4 q-px-sm">
          <q-field hint="Total" stack-label dense>
            <template v-slot:control>
              <div
                class="self-center full-width no-outline"
                tabindex="0"
              >
                {{enc_nota_credito.Ev_Total_venta}}
              </div>
            </template>
          </q-field>
        </div>
      </div>
    </q-form>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn color="green" icon="save" label="Guardar" />
    </q-page-sticky>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
let all_product = []; //Contiene todos los productos vendidos
let percent_genres = []; //Contiene los procentajes generales
export default {
  name: 'ComponentNoteCredit',
  data () {
    return {
      encebezado_venta: null,
      producto_selecte: null,
      options_products: all_product,
      cant_vendida: null,
      precio_vendido: null,
      cantidad: null,
      data_products_sales: [],
      columns_products: [
        {
          name: 'Art_Id',
          align: 'center',
          label: 'ID Producto',
          sortable: true,
          field: 'Art_Id'
        },
        {
          name: 'codigo',
          align: 'center',
          label: 'Código',
          sortable: true,
          field: 'codigo'
        },
        {
          name: 'producto',
          align: 'center',
          label: 'Producto',
          sortable: true,
          field: 'producto'
        },
        {
          name: 'Dv_Cant',
          align: 'center',
          label: 'Cantidad',
          sortable: true,
          field: 'Dv_Cant'
        },
        {
          name: 'Dv_precio_venta',
          align: 'center',
          label: 'Precio venta',
          sortable: true,
          field: 'Dv_precio_venta'
        },
      ],
      enc_nota_credito: {
        base: null,
        Ev_Id: null,
        CP_Nit: null,
        Per_Num_documento: null,
        Mov_Id: null,
        Mp_Id: null,
        Tc_Id: null,
        Ev_dias_credito: null,
        Ev_Impuesto: null,
        Ev_Subtotal: null,
        Ev_Des_total_art: null,
        Ev_Descuentog: null,
        Ev_Des_gen_venta: null,
        Ev_Total_venta: null,
        Ev_Estado: null,
        Ev_conf_pago: null,
        Ev_Entregado: null,
        Ev_Fecha_venta: null,
        Ev_Usuario_control: null,
      }
    }
  },
  props: [
    'prop_encabezado',
    'prop_product'
  ],
  created(){
    this.getData();
  },
  watch: {
    producto_selecte(value){
      if(value){
        this.cant_vendida = value.cantidad;
        this.precio_vendido = new Intl.NumberFormat().format(value.precio_venta);
        console.log(value)
        console.log(this.precio_vendido)
      }
    }
  },
  methods: {
    ...mapActions('sales', [
      'getPercentSaleArt',
    ]),
    getData(){
      // Se asigna datos para el frontend
      this.encebezado_venta = {
        'NIT': this.prop_encabezado.CP_Nit,
        'Impuesto': this.prop_encabezado.Ev_Impuesto,
        'Días de crédito': this.prop_encabezado.Ev_dias_credito,
        'Nombre vendedor': this.prop_encabezado.Per_Nombre,
        'Documento vendedor': this.prop_encabezado.Per_Num_documento,
        'Autoriza garantía': this.prop_encabezado.name_qautorizqa,
        'Quién autoriza': this.prop_encabezado.Eg_Quien_autoriza,
        'Observación': this.prop_encabezado.Eg_Observacion,
        'Fecha venta': this.prop_encabezado.Ev_Fecha_venta,
        Estado: this.prop_encabezado.Estado,
      }

      // Se asigna datos para el encabezadoq que se guarda en base de datos
      this.enc_nota_credito = this.prop_encabezado;

      all_product.length = 0;
      this.prop_product.forEach(element => {
        all_product.push({
          label: element.Art_Descripcion,
          value: element.Art_Id,
          codigo: element.Art_Codigo_inv,
          cantidad: element.Dv_Cant,
          porcentaje_venta: element.Dv_valor_descuento,
          precio_compra: element.Dv_Precio_compra,
          precio_venta: element.Dv_precio_venta,
          Ev_Id: element.Ev_Id
        })
      });
      // this.$q.loading.show({
      //   message: 'Obteniendo datos del servidor, por favor espere...'
      // });
      // setTimeout(async() => {
      //   try {
      //   } catch (e) {
      //     console.log(e);
      //     if (e.message === "Network Error") {
      //       e = e.message;
      //     }
      //     if (e.message === "Request failed with status code 404") {
      //       e = "URL de solicitud no existe, err 404";
      //     } else if (e.message) {
      //       e = e.message;
      //     }
      //     this.$q.notify({
      //       message: e,
      //       type: "negative",
      //     });
      //   } finally {
      //     this.$q.loading.hide();
      //   }
      // }, 2000)
    },
    addProduct(){
      let product_add = {
        base: process.env.__BASE__,
        Ev_Id: this.producto_selecte.Ev_Id,
        codigo: this.producto_selecte.codigo,
        producto: this.producto_selecte.label,
        Art_Id: this.producto_selecte.value,
        Dv_Cant: this.cantidad,
        Dv_Precio_compra: this.producto_selecte.precio_compra,
        Dv_precio_venta: this.producto_selecte.precio_venta,
        Dv_valor_descuento: this.producto_selecte.porcentaje_venta,
        porcentaje_venta: this.producto_selecte.porcentaje_venta,
        subtotal_product: null,
        // Propiedade para actualizar el stock
        Mov_Id: this.movil_selecte,
        Si_Cant: this.cantidad + this.cantidad_garantia,
        simbol: '-',
      }
      if( this.cantidad > this.producto_selecte.cantidad ){
        this.$q.notify({
          message: 'la cantidad es mayor a la vendida',
          type: 'warning'
        })
      } else {
        this.data_products_sales.push(product_add)
      }
    },
    // Buscador para el select medio de pago
    filterProducts(val, update, abort){
      setTimeout(() => {
        update(() => {
            if (val === '') {
              this.options_products = all_product
            }
            else {
              const needle = val.toLowerCase()
              this.options_products = all_product.filter(v => v.label.toLowerCase().indexOf(needle) > -1 || v.codigo  .toString().toLowerCase().indexOf(needle) > -1)
            }
          },
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
}
</script>
<style scoped>
.alto_tabla{
  height: 450px;
}
</style>