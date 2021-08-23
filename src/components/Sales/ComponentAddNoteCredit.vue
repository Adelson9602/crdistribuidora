<template>
  <div>
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
          <q-select
            v-model="descuento_art"
            :options="options_des_products"
            hint="Descuento articulo"
            :rules="[val => !!val || 'Descuento articulo es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 q-px-sm">
          <q-field hint="Cantidad vendida" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{cant_vendida}}</div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 q-px-sm">
          <q-input
            v-model="cantidad"
            hint="Cantidad"
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
        <div class="col-xs-12 col-sm-12 col-md-6">
          <q-table
            title="Productos vendidos"
            :data="data_products_sales"
            :columns="columns_products"
            flat
            class="alto_tabla"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <q-table
            title="Productos modificados"
            :data="data_products_sales"
            :columns="columns_products"
            flat
            class="alto_tabla"
          />
        </div>
      </div>
    </q-form>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn color="green" icon="save" label="Guardar" />
    </q-page-sticky>
  </div>
</template>

<script>
let all_product = []; //Contiene todos los productos vendidos
export default {
  name: 'ComponentNoteCredit',
  data () {
    return {
      encabezado: null,
      producto_selecte: null,
      options_products: all_product,
      descuento_art: null,
      options_des_products: null,
      cant_vendida: null,
      cantidad: null,
      data_products_sales: [],
      columns_products: [
        {
          name: 'Art_Id',
          align: 'center',
          label: 'ID Artículo',
          sortable: true,
          field: 'Art_Id',
        },
        {
          name: 'Art_Descripcion',
          align: 'center',
          label: 'Descripción articulo',
          sortable: true,
          field: 'Art_Descripcion',
        },
        {
          name: 'Dv_Precio_compra',
          align: 'center',
          label: 'Precio de compra',
          sortable: true,
          field: 'Dv_Precio_compra',
        },
        {
          name: 'Dv_precio_venta',
          align: 'center',
          label: 'Precio de venta',
          sortable: true,
          field: 'Dv_precio_venta',
        },
        {
          name: 'Dv_valor_descuento',
          align: 'center',
          label: 'Valor descuento',
          sortable: true,
          field: 'Dv_valor_descuento',
        },
        {
          name: 'categoria',
          align: 'center',
          label: 'Categoría producto',
          sortable: true,
          field: 'categoria',
        },
      ],
    }
  },
  props: [
    'prop_encabezado',
    'prop_product'
  ],
  created(){
    this.getData();
  },
  methods: {
    getData(){
      this.encabezado = this.prop_encabezado;
      this.data_products_sales = this.prop_product; //Mostramos los productos vendidos en la tabla
      this.prop_product.forEach(element => {
        all_product.push({
          label: element.Art_Descripcion,
          value: element.Art_Id,
          codigo: element.Art_Codigo_inv,
          cantidad: element.Dv_Cant,
          porcentaje_venta: element.Dv_valor_descuento,
          precio_compra: element.Dv_Precio_compra,
          precio_venta: element.Dv_precio_venta,
          pv_id: element.Pv_Id,
          Ev_Id: element.Ev_Id
        })
      });
    },
    addProduct(){

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