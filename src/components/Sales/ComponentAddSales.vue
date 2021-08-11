<template>
  <div>
    <q-form
      @submit="addProduct"
      class="q-gutter-md"
    >
      <!-- Encabezado -->
      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="enc_entrada.Tc_Id"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Tipo comprobante"
            :options="options_comprobante"
            @filter="filterComprobante"
            :rules="[val => !!val || 'Tipo comprobante es obligatorio']"
            emit-value
            map-options
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
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="enc_entrada.CP_Nit"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Cliente"
            :options="options_clientes"
            @filter="filterClients"
            :rules="[val => !!val || 'Cliente es obligatorio']"
            map-options
            emit-value
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
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="tipo_documento"
            :options="options_tipo_documento"
            hint="Tipo documento"
            :rules="[val => !!val || 'Cliente es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-input
            v-model="numero_documento"
            type="text"
            hint="Número documento"
            :rules="[val => !!val || 'Número documento es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="forma_pago"
            :options="options_me_pago"
            hint="Forma de pago"
            :rules="[val => !!val || 'Forma de pago es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-input
            v-model="numero"
            type="text"
            hint="Número"
            disable
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-input
            v-model="impuesto"
            type="text"
            hint="Impuesto"
            :rules="[val => !!val || 'Impuesto es obligatorio']"
          />
        </div>
      </div>
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
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-input
            v-model="cantidad"
            hint="Cantidad"
            :rules="[val => !!val || 'Cantidad es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="precio_venta"
            :options="options_pre_venta"
            hint="Precio de venta"
            :rules="[validatePrecio]"
            map-options
            emit-value
          />
        </div>
      </div>
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>
    <q-table
      title="Productos a vender"
      :data="data_sales"
      :columns="columns_sales"
      row-key="name"
      flat
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn icon="delete" size="sm" color="negative" round dense @click="delteProduct(props.row)" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
let all_providers = []; // Contiene todos los proveedores clientes
let all_comprobante = []; //Contiene todos los tipos de comprobantes
let all_product = []; //Contiene todos los productos
let all_medios = []; //Contiene los medios de pago
import { mapActions, mapState } from 'vuex';
import dialog from 'components/Generals/ComponentDialogWarning';
export default {
  // name: 'ComponentName',
  data () {
    return {
      options_comprobante: all_comprobante,
      options_clientes: all_providers,
      options_tipo_documento: [],
      options_me_pago: all_medios,
      options_products: all_product,
      options_pre_venta: [
        {
          label: '0%',
          value: 0,
        },
        {
          label: '3%',
          value: 3,
        },
        {
          label: '5%',
          value: 5,
        },
        {
          label: '10%',
          value: 10,
        },
      ],
      precio_venta: null,
      producto_selecte: null,
      model: null,
      options: [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
      ],
      enc_entrada: {
        base: null,
        Ecb_Id: null,
        CP_Nit: null,
        Tc_Id: null, //Tipo comprobante
        Mp_Id: null, //Medio pago
        Enc_dias_credito: null,
        Enc_num_comprobante: null, //Numero comprobante
        Enc_impuesto: null, //Numero impuesto
        Enc_subtotal_compra: null, //
        Enc_total_compra: null,
        Enc_Estado: null,
        Enc_User_control: null
      },
      tipo_documento: null,
      numero_documento: null,
      forma_pago: null,
      impuesto: null,
      cantidad: null,
      numero: null,
      data_sales: [], //Productos a vender
      columns_sales: [
        {
          name: 'id_producto',
          align: 'center',
          label: 'ID Producto',
          sortable: true,
          field: 'id_producto'
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
          name: 'cantidad',
          align: 'center',
          label: 'Cantidad',
          sortable: true,
          field: 'cantidad'
        },
        {
          name: 'precio_venta',
          align: 'center',
          label: 'Precio venta',
          sortable: true,
          field: 'precio_venta'
        },
      ], //Columnas para la tabla productos a vender
    }
  },
  computed: {
    ...mapState('auth', ['user_logged']),
    data_user(){
      return this.user_logged;
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('shopping', [
      'getProviders',
      'getTpDoc'
    ]),
    ...mapActions('warehouse', [
      'updateInventarioMovil',
      'getAllArticles'
    ]),
    ...mapActions('master', [
      'getTiposComprobante',
      'getMedioPago'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo datos del servidor, por favor espere...'
      });
      setTimeout(async()=> {
        try {
          const res_provider = await this.getProviders().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get proveedor',
          //   data: res_provider
          // });
          if(res_provider.ok){
            if(res_provider.result){
              all_providers.length = 0;
              res_provider.data.forEach( element => {
                if(element.Tp_Id == 1 && element.CP_Razon_social){
                  all_providers.push({
                    label: element.CP_Razon_social,
                    value: element.CP_Nit
                  })
                }
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_provider.message);
          }

          const res_compro = await this.getTiposComprobante().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get tipo de comprobante',
          //   data: res_compro
          // });
          if(res_compro.ok){
            if(res_compro.result){
              all_comprobante.length = 0;
              res_compro.data.forEach(element => {
                if(element.Tc_Estado == 1){
                  all_comprobante.push({
                    label: element.Tc_Descripcion,
                    value: element.Tc_Id
                  });
                }
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_compro.message);
          }

           const res_docu = await this.getTpDoc().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get tipo documento',
          //   data: res_docu
          // });
          if(res_docu.ok){
            if(res_docu.result){
              this.options_tipo_documento.length = 0;
              res_docu.data.forEach( t_docu => {
                this.options_tipo_documento.push({
                  label: t_docu.Td_Descripcion,
                  value: t_docu.Td_Id
                })
              });
            } else {
              this.$q.notify({
                message: 'Ops! sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_docu.message);
          }

          const res_medio = await this.getMedioPago().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get medio pago',
          //   data: res_medio
          // });
          if(res_medio.ok){
            all_medios.length = 0;
            res_medio.data.forEach( element => {
              if(element.Mp_Estado == 1){
                all_medios.push({
                  label: element.Mp_Descripcion,
                  value: element.Mp_Id
                });
              }
            })
          } else {
            throw new Error(res_medio.message);
          }

          const res_product = await this.getAllArticles().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get productos',
          //   data: res_product
          // });
          if(res_product.ok){
            all_product.length = 0;
            res_product.data.forEach( element => {  
              if(element.Art_Estado == 1){
                all_product.push({
                  label: element.Art_Nombre,
                  value: element.Art_Id,
                  codigo: element.Art_Codigo_inv
                });
              }
            })
          } else {
            throw new Error(res_product.message);
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
      let product_add = {
        codigo: this.producto_selecte.codigo,
        producto: this.producto_selecte.label,
        id_producto: this.producto_selecte.value,
        cantidad: this.cantidad,
        precio_venta: this.precio_venta,
      }

      let exits_product = this.data_sales.find( product => product.codigo == product_add.codigo );
      if(exits_product){
        this.$q.notify({
          message: 'Producto ya está agregado',
          type: 'warning'
        })
      } else {
        this.data_sales.push(product_add);
      }
    },
    delteProduct(row){
      this.$q.dialog({
        component: dialog,
        parent: this,
        title: 'Eliminar producto',
        msg: 'Atención! vas a eliminar un producto agregado a la tabla, ¿Seguro que desea continuar?',
      }).onOk(() => {
        let index = this.data_sales.indexOf(row)
        this.data_sales.splice(index, 1)
      })
    },
    onReset(){

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
    // Buscador para el select proveedor
    filterClients(val, update, abort){
      setTimeout(() => {
        update(() => {
            const needle = val.toLowerCase()
            this.options_providers = all_providers.filter(v => v.label.toLowerCase().indexOf(needle) > -1 || v.value.toString().toLowerCase().indexOf(needle) > -1)
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
    // Buscador para el select comprobante
    filterComprobante(val, update, abort){
      setTimeout(() => {
        update(() => {
          const needle = val.toLowerCase();
          this.options_comprobantes = all_comprobante.filter( v => v.label.toLowerCase().indexOf(needle) > -1 || v.value.toString().toLowerCase().indexOf(needle) > -1 );
        },
        ref => {
          if (val !== '' && ref.options.length > 0) {
            ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
            ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
          }
        })
      }, 300)
    },
    // Valida el select precio venta
    validatePrecio(val){
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if(!val && val != 0){
            resolve(false || 'Precio es requerido')  
          }
          // call
           resolve(true)
        }, 300)
      })
    }
  }
}
</script>
