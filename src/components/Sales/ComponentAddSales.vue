<template>
  <div>
    <q-form
      @submit="addProduct"
      class="q-gutter-md"
    >
      <q-btn color="primary" icon="add" label="Agregar cliente" @click="dialog_create_user = true" />
      <q-dialog v-model="dialog_create_user" persistent>
        <q-card style="width: 920px; max-width: 90vw;">
          <q-bar dark class="bg-primary text-white">
            <div class="col text-center text-weight-bold">
              Crear cliente
            </div>
            <q-btn icon="close" flat round dense v-close-popup />
          </q-bar>
          <q-card-section class="row items-center">
            <component-add-client @reload="reload"/>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!-- Encabezado -->
      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="enc_venta.Tc_Id"
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
            v-model="cliente_selected"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Cliente"
            :options="options_clientes"
            @filter="filterClients"
            :rules="[val => !!val || 'Cliente es obligatorio']"
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
          <q-field hint="Tipo documento" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{tipo_documento}}</div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-field hint="Número documento" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{numero_documento}}</div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="enc_venta.Mp_Id"
            :options="options_me_pago"
            hint="Forma de pago"
            :rules="[val => !!val || 'Forma de pago es obligatorio']"
            map-options
            emit-value
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm" v-if="enc_venta.Mp_Id == 2">
          <q-input
            v-model="enc_venta.Ev_dias_credito"
            mask="#######"
            hint="Días de credito"
            :rules="[val => !!val || 'Días de credito es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-input
            v-model="enc_venta.Ev_Impuesto"
            type="text"
            hint="Impuesto"
            :rules="[val => !!val || 'Impuesto es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="enc_venta.Ev_Descuentog"
            :options="options_pre_venta"
            hint="Precio de venta"
            :rules="[validatePrecio]"
            map-options
            emit-value
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="movil_selecte"
            :options="options_moviles"
            hint="Movil"
            :rules="[val => !!val || 'Movil es requerido']"
            map-options
            emit-value
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
        <div class="col-xs-12 col-sm-6 col-md-2 q-px-sm">
          <q-field hint="Cantidad disponible" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{cant_disponible}}</div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 q-px-sm">
          <q-input
            v-model="cantidad"
            hint="Cantidad"
            :rules="[val => !!val || 'Cantidad es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
          <q-select
            v-model="descuento_art"
            :options="options_des_products"
            hint="Descuento articulo"
            :rules="[val => !!val || 'Producto es obligatorio']"
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
let all_clients = []; // Contiene todos los proveedores clientes
let all_comprobante = []; //Contiene todos los tipos de comprobantes
let all_product = []; //Contiene todos los productos
let all_medios = []; //Contiene los medios de pago
import { mapActions, mapState } from 'vuex';
import dialog from 'components/Generals/ComponentDialogWarning';
import ComponentAddClient from "components/Sales/ComponentAddClient";
export default {
  name: 'ComponentAddSales',
  components: {
    ComponentAddClient
  },
  data () {
    return {
      options_comprobante: all_comprobante,
      options_clientes: all_clients,
      options_tipo_documento: [],
      options_me_pago: all_medios,
      options_products: all_product,
      options_des_products: [],
      options_moviles: [],
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
      producto_selecte: null,
      model: null,
      cliente_selected: null,
      tipo_documento: null,
      numero_documento: null,
      cant_disponible: null,
      cantidad: null,
      precio_venta_art: null,
      descuento_art: null,
      movil_selecte: null,
      enc_venta: {
        base: null,
        Ev_Id: null,
        Tc_Id: null,
        CP_Nit: null,
        Per_Num_documento: null, //Vendedor
        Mov_Id: null,
        Mp_Id: null,
        Ev_dias_credito: 0,
        Ev_Impuesto: null, // Para iva si lleva iva si no 0
        Ev_Subtotal: null,
        Ev_Des_total_art: null, //Descuento 
        Ev_Descuentog: 0, //Porcentaje de descuento a la factura final osea 1% 2%
        Ev_Des_gen_venta: 0, //Valor total en pesos 
        Ev_Total_venta: 0,
        Ev_Estado: null,
        Ev_conf_pago: null,
        Ev_Entregado: null,
        Ev_Fecha_venta: null,
        Ev_Usuario_control: null, //Si es a credito es 0
      },
      data_sales: [], //Productos a vender
      columns_sales: [
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
      ], //Columnas para la tabla productos a vender
      dialog_create_user: false,
    }
  },
  computed: {
    ...mapState('auth', ['user_logged']),
    data_user(){
      return this.user_logged;
    }
  },
  watch: {
    cliente_selected(value){
      if(value){
        this.numero_documento = value.value;
        this.tipo_documento = value.tip_doc;
        this.enc_venta.CP_Nit = value.value;
      }
    },
    movil_selecte(value){
      this.$q.loading.show({
        message: 'Obteniendo stock, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_product = await this.getStockMovil(value).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get productos',
            data: res_product
          });
          if(res_product.ok){
            all_product.length = 0;
            res_product.data.forEach( element => {  
              all_product.push({
                label: element.Art_Nombre,
                value: element.Art_Id,
                codigo: element.Art_Codigo_inv,
                cantidad: element.Si_Cant
              });
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
    producto_selecte(value){
      if(value){
        console.log(value)
        this.cant_disponible = value.cantidad;
      }
    }
  },
  created(){
    this.getData();
  },
  methods: {
    // Insert update stock con simbolo -
    ...mapActions('shopping', [
      'getProviders',
      'getTpDoc',
    ]),
    ...mapActions('warehouse', [
      'updateInventarioMovil',
      'getStockMovil'
    ]),
    ...mapActions('master', [
      'getTiposComprobante',
      'getMedioPago'
    ]),
    ...mapActions('sales', [
      'getPercentSaleArt',
      'getMovilUser'
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
              all_clients.length = 0;
              res_provider.data.forEach( element => {
                if(element.Tp_Id == 1 && element.CP_Razon_social){
                  all_clients.push({
                    label: element.CP_Razon_social,
                    value: element.CP_Nit,
                    tip_doc: element.Tp_Desc_corta
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

          const res_mov = await this.getMovilUser(this.data_user.Per_Num_documento).then( res => {
            return res.data;
          });
          // console.log({
          //   message: 'Respuesta get moviles usuario',
          //   data: res_mov
          // });
          if(res_mov.ok){
            if(res_mov.result){
              this.options_moviles.length = 0;
              res_mov.data.forEach( element => {
                if(element.Estado == 1){
                  this.options_moviles.push({
                    label: element.Mov_Descripcion,
                    value: element.Mov_Id,
                  })
                }
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_mov.message);
          }

          const res_por_prod = await this.getPercentSaleArt().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get procentaje descuento productos',
          //   data: res_por_prod
          // });
          if(res_por_prod.ok){
            this.options_des_products.length = 0;
            res_por_prod.data.forEach( element => {  
              if(element.Pv_Estado == 1){
                this.options_des_products.push({
                  label: element.Pv_Descripcion,
                  value: element.Pv_Id,
                });
              }
            })
          } else {
            throw new Error(res_por_prod.message);
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
      this.$q.loading.show({
        message: 'Realizando venta, por favor espere...'
      });
      setTimeout(async() => {
        try {
          this.enc_venta.Per_Num_documento = this.data_user.Per_Num_documento
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
    addProduct(){
      let product_add = {
        Ev_Id: null,
        base: process.env.__BASE__,
        codigo: this.producto_selecte.codigo,
        producto: this.producto_selecte.label,
        Art_Id: this.producto_selecte.value,
        Dv_Cant: this.cantidad,
        Dv_Precio_compra: null,
        Dv_precio_venta: this.precio_venta_art,
        Dv_valor_descuento: this.descuento_art,
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
    // Borra productos de la tabla productos a vender
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
    // Recarga el select luego de crear un cliente
    reload(){
      this.dialog_create_user = false;
      setTimeout(()=> {
        this.$q.loading.show({
          message: 'Actualizando lista de cliente, por favor espere...'
        })
        setTimeout(async() => {
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
                all_clients.length = 0;
                res_provider.data.forEach( element => {
                  if(element.Tp_Id == 1 && element.CP_Razon_social){
                    all_clients.push({
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
      }, 200)
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
            if (val === '') {
              this.options_clientes = all_clients
            }
            else {
              const needle = val.toLowerCase();
              this.options_clientes = all_clients.filter( v => v.label.toLowerCase().indexOf(needle) > -1 || v.value.toString().toLowerCase().indexOf(needle) > -1 );
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
    // Buscador para el select comprobante
    filterComprobante(val, update, abort){
      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.options_comprobantes = all_comprobante
          }
          else {
            const needle = val.toLowerCase();
            this.options_comprobantes = all_comprobante.filter( v => v.label.toLowerCase().indexOf(needle) > -1 || v.value.toString().toLowerCase().indexOf(needle) > -1 );
          }
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
