<template>
  <div>
    <q-form
      @submit="addProduct"
      @reset="onReset"
      class="q-gutter-md"
    >
      <div class="row">
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="tipo_salida"
            :options="options_salida"
            hint="Tipo salida"
            map-options
            emit-value
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="proveedor_selected"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Proveedor"
            :options="options_providers"
            @filter="filterProvider"
            map-options
            emit-value
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
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="proveedor_selected"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Proveedor"
            :options="options_providers"
            @filter="filterProvider"
            map-options
            emit-value
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
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="proveedor_selected"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Quién autoriza"
            :options="options_providers"
            @filter="filterProvider"
            map-options
            emit-value
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
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="producto_selected"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Quíen recibe"
            :options="options_products"
            @filter="filterProducts"
            map-options
            emit-value
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
      </div>
      <div>
        <q-btn label="Submit" type="submit" color="primary" class="hide-btn_submit"/>
      </div>
    </q-form>
    <div class="row">
      <div class="col-xs-12">
        <q-table
          title="Garantías a agregar"
          :data="data"
          :columns="columns"
          row-key="name"
          flat
        >
          <template v-slot:header-cell-calories="props">
            <q-th :props="props">
              <q-icon name="thumb_up" size="1.5em" />
              {{ props.col.label }}
            </q-th>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
let all_providers = []; //Contiene todos los proveedores
let all_productos = []; //Contiene todos los productos
export default {
  name: 'ComponentAddWarranties',
  data () {
    return {
      options_providers: all_providers, //Opciones para el select proveedores
      options_products: all_productos, //Opciones para el select productos
      options_salida: [
        {
          label: 'SALIDA A PROVEEDOR',
          value: 1
        },
        {
          label: 'SALIDA A GARANTÍA',
          value: 2
        },
        {
          label: 'SALIDA A ALMACEN',
          value: 3
        },
      ],
      tipo_salida: null,
      producto_selected: null,
      proveedor_selected: null,
      enc_salida: {
        base: null,
        Esp_Id: null,
        Esp_Cedula_Autoriza: null,
        Esp_Autoriza_cliente: null,
        CP_Nit: null,
        Esp_Nombre_Recibe: null,
        Esp_Observacion: null,
        Esp_User_control: null,
      },
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      data: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: '8%',
          iron: '1%'
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: '6%',
          iron: '7%'
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: '3%',
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: '7%',
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: '0%',
          iron: '0%'
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: '0%',
          iron: '2%'
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: '0%',
          iron: '45%'
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: '2%',
          iron: '22%'
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: '12%',
          iron: '6%'
        }
      ],
    }
  },
  created(){
    this.getData();
  },
  watch: {
    tipo_salida(value){
      if(value){
        this.$q.loading.show({
          message: 'Obteniendo productos, par favor espere...'
        });
        setTimeout(async() => {
          try {
            // Proveedor o para punto de venta
            if(value == 1 || value == 3){
              const res_stock_mv = await this.getStockMovil(1).then((res) => {
                  return res.data;
                }
              );
              console.log({
                msg: 'Repeusta get artículos',
                data: res_stock_mv,
              });
              if (res_stock_mv.ok) {
                if (res_stock_mv.result) {
                  all_productos.length = 0;
                  res_stock_mv.data.forEach( product => {
                    all_productos.push({
                      label: product.Art_Nombre,
                      value: product.Art_Id,
                      codigo: product.Art_Codigo_inv
                    })
                  });
                } else {
                  this.$q.notify({
                    message: 'Sin stock',
                    type: "warning",
                  });
                }
              } else {
                throw new Error(res_stock_mv.message);
              }
            } else if (value == 2){
              // Para garantias
              const res_stock_garantia = await this.getStockGarantias().then( res => {
                return res.data;
              });
              console.log({
                msg: 'Respuesta get stock garantías',
                data: res_stock_garantia
              });
              if(res_stock_garantia.ok){
                if(res_stock_garantia.result){
                  all_productos.length = 0;
                  res_stock_garantia.data.forEach( product => {
                    all_productos.push({
                      label: product.Art_Nombre,
                      value: product.Art_Id,
                      codigo: product.Art_Codigo_inv
                    })
                  });
                } else {
                  this.$q.notify({
                    message: 'Sin stock',
                    type: 'warning'
                  })
                }
              } else {
                throw new Error(res_stock_garantia.message);
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
              type: "negative",
            });
          } finally {
            this.$q.loading.hide();
          }
        }, 2000)
      }
    }
  },
  methods: {
    ...mapActions('shopping', [
      'getProviders',
      'getStockGarantias'
    ]),
    ...mapActions("warehouse", [
      "getStockMovil",
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
              all_providers.length = 0 ;
              res_provider.data.forEach( provider => {
                if(provider.Tp_Id == 0 && provider.CP_Razon_social){
                  all_providers.push({
                    value: provider.CP_Nit,
                    label: provider.CP_Razon_social,
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
    onSubmit(){

    },
    addProduct(){

    },
    onReset(){

    },
    // Buscador para el select proveedor
    filterProvider (val, update, abort) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              this.options_providers = all_providers
            }
            else {
              const needle = val.toLowerCase()
              this.options_providers = all_providers.filter(v => v.label.toLowerCase().indexOf(needle) > -1 || v.value.toString().toLowerCase().indexOf(needle) > -1)
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
    // Buscador para el select proveedor
    filterProducts (val, update, abort) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              this.options_products = all_productos
            }
            else {
              const needle = val.toLowerCase()
              this.options_products = all_productos.filter(v => v.label.toLowerCase().indexOf(needle) > -1 || v.codigo.toLowerCase().indexOf(needle) > -1)
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
    // inventario_single
  }
}
</script>
