<template>
  <div>
    <div class="row q-gutter-y-md">
      <div class="col-xs-12 col-sm-8 col-md-8 q-px-sm">
        <q-btn color="primary" icon="add" label="Agregar cliente" @click="dialog_create_user = true" />
        <q-toggle
          v-model="tipo_accion"
          color="green"
          :icon="tipo_accion ? 'shopping_cart' : 'receipt_long'"
          :label="tipo_accion ? 'Venta' : 'Cotización'"
        />
      </div>
      <q-form @submit="searchCotizacion" class="col-xs-12 col-sm-4 col-md-4 q-px-sm">
        <q-input
          bottom-slots
          v-model="id_cotizacion"
          label="Buscar No. Cotización"
          dense
          error-message="Número de cotización es obligatorio"
          :error="!isNumberCotiza"
          mask="#########"
          :rules="[val => !!val || 'Número de cotización es obligatorio']"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="search" @click="searchCotizacion"/>
          </template>
        </q-input>
        <q-btn color="white" text-color="black" type="submit" label="Buscar" class="hide-btn_submit"/>
      </q-form>
    </div>
    <q-form
      @submit="addProduct"
      class="q-gutter-md"
      ref="form_sales"
      autocomplete="off"
    >

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
            :disable="tipo_accion == false ? true : false"
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
            ref="select_client"
            :error="validation"
            error-message="Seleccione un cliente"
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
            mask="#.##"
            fill-mask="0"
            hint="Impuesto"
            input-class="text-right"
            :rules="[validateImpuesto]"
            @input="val => enc_venta.Ev_Impuesto = Number(val)"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="enc_venta.Ev_Descuentog"
            :options="options_pre_venta"
            hint="Descuento"
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
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-input hint="Fecha venta" v-model="enc_venta.Ev_Fecha_venta" :rules="[val => !!val || 'Ingrese fecha de venta']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="enc_venta.Ev_Fecha_venta" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-9 q-px-sm">
          <q-input
            v-model="ecn_garantia.Eg_Observacion"
            hint="Observación para productos con garantía"
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
          <q-select
            v-model="descuento_art"
            :options="options_des_products"
            hint="Descuento articulo"
            :rules="[val => !!val || 'Descuento articulo es obligatorio']"
          />
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
            mask="############"
            :rules="[val => !!val || 'Cantidad es obligatorio',
              val => val != 0 || 'La cantida no puede ser 0'
            ]"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 q-px-sm">
          <q-input
            v-model="cantidad_garantia"
            hint="Cantidad para garantía"
            mask="############"
            :rules="[val => !!val || 'Cantidad garantía es obligatorio']"
            v-if="tipo_accion"
          />
        </div>
      </div>
      <q-btn label="Submit" type="submit" color="primary" class="hide-btn_submit"/>
    </q-form>
    <q-table
      title="Productos a vender"
      :data="data_sales"
      :columns="columns_sales"
      row-key="name"
      flat
      class="height"
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
            {{ col.name != 'Dv_precio_venta' && col.name != 'subtotal_product' ? col.value : new Intl.NumberFormat().format(col.value)}}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="row">
      <div class="col-xs-12 col-sm-6 q-pa-sm">
        <q-field label="Subtotal" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">$ {{new Intl.NumberFormat().format(subtotal_venta)}}</div>
          </template>
        </q-field>
      </div>
      <div class="col-xs-12 col-sm-6 q-pa-sm">
        <q-field label="Total" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">$ {{new Intl.NumberFormat().format(total_venta)}}</div>
          </template>
        </q-field>
      </div>
      <div class="col-xs-12 col-sm-6 q-pa-sm">
        <q-field label="Descuento total de artículos" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">$ {{new Intl.NumberFormat().format(Ev_Des_total_art)}}</div>
          </template>
        </q-field>
      </div>
      <div class="col-xs-12 col-sm-6 q-pa-sm">
        <q-field label="Descuento general" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">$ {{new Intl.NumberFormat().format(Ev_Des_gen_venta)}}</div>
          </template>
        </q-field>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18,18]">
      <q-btn color="green" icon="save" label="Guardar" @click="onSubmit" v-if="data_sales.length > 0"/>
    </q-page-sticky>
  </div>
</template>

<script>
let all_clients = []; // Contiene todos los proveedores clientes
let all_comprobante = []; //Contiene todos los tipos de comprobantes
let all_product = []; //Contiene todos los productos
let all_medios = []; //Contiene los medios de pago
let percent_genres = []; //Contiene los procentajes generales
let percent_persona = []; //Contiene los procentajes personalizados
import { mapActions, mapState } from 'vuex';
import dialog from 'components/Generals/ComponentDialogWarning';
import ComponentAddClient from "components/Sales/ComponentAddClient";
import { date } from 'quasar';
let date_now = null;
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
      total_venta: null,
      subtotal_venta: null,
      enc_venta: {
        base: null,
        Ev_Id: null,
        Tc_Id: null,
        CP_Nit: null,
        Per_Num_documento: null, //Vendedor
        Mov_Id: null,
        Mp_Id: null,
        Ev_dias_credito: 0,
        Ev_Impuesto: 0, // Para iva si lleva iva si no 0
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
        {
          name: 'Dv_precio_venta',
          align: 'center',
          label: 'Precio venta',
          sortable: true,
          field: 'Dv_precio_venta'
        },
        {
          name: 'des_articulo',
          align: 'center',
          label: 'Descuento aplicado',
          sortable: true,
          field: 'des_articulo'
        },
        {
          name: 'subtotal_product',
          align: 'center',
          label: 'Subtotal',
          sortable: true,
          field: 'subtotal_product'
        },
      ], //Columnas para la tabla productos a vender
      dialog_create_user: false,
      Ev_Des_total_art: 0,
      Ev_Subtotal: 0,
      Ev_Des_gen_venta: 0,
      cantidad_garantia: null,
      ecn_garantia: {
        base: null,
        Eg_Id: null,
        Eg_Quien_autoriza: null,
        Ev_Id: null,
        Eg_Observacion: null,
        Eg_estado: null,
        Eg_User_control: null,
      },
      tipo_accion: true, //Determina que acción va a realizar el usuario, si es cotización o venta
      validation: false, //Valida el cliente seleccionado
      id_cotizacion: null, //Id de la cotización a concretar como venta
      isNumberCotiza: true, //Valida si se ha ingresado un número de cotización
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
        this.validation = false;
      }
    },
    movil_selecte(value){
      this.$q.loading.show({
        message: 'Obteniendo stock, por favor espere...'
      });
      setTimeout( async() => {
        try {
          this.producto_selecte = null;
          this.cant_disponible = null;
          const res_product = await this.getStockMovil(value).then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get productos',
          //   data: res_product
          // });
          if(res_product.ok){
            all_product.length = 0;
            res_product.data.forEach( element => {  
              all_product.push({
                label: element.Art_Nombre,
                value: element.Art_Id,
                codigo: element.Art_Codigo_inv,
                cantidad: element.Si_Cant,
                porcentaje_venta: element.porcentaje_venta,
                precio_compra: element.precio_compra,
                precio_venta: element.precio_venta,
                art_porce_general: element.Art_porce_general,
                pv_id: element.Pv_Id
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
        this.cant_disponible = value.cantidad;
        let resultado = new Promise((resolve, reject) => {
          if(value.art_porce_general){
            this.options_des_products.length = 0;
            percent_genres.forEach( element => {
              this.options_des_products.push(element);
            })
          } else {
            let porcentaje_productos = percent_persona.filter( porcentaje => porcentaje.Art_Id == value.value);
            this.options_des_products.length = 0;
            porcentaje_productos.forEach(element => {
              this.options_des_products.push({
                label: element.Pv_Descripcion,
                value: element.Pv_Prcentaje,
                pv_id: element.Pv_Id
              })
            })
          }
          resolve(this.options_des_products);
        });
        resultado.then( opciones => {
          this.descuento_art = opciones.find( porcentaje => porcentaje.pv_id == value.pv_id);
        })
      }
    },
    tipo_accion(value){
      if(!value){
        this.cliente_selected = {
          value: 1,
          tip_doc: 0,
          value: 0,
          label: 'COTIZACIÓN'
        }
        this.enc_venta.Tc_Id = 5;
        this.cantidad_garantia = 0;
      }
    }
  },
  created(){
    let timeStamp = Date.now()
    date_now = date.formatDate(timeStamp, 'YYYY-MM-DD')
    this.enc_venta.Ev_Fecha_venta = date_now;
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
      'getMedioPago',
      'percentsPersons'
    ]),
    ...mapActions('sales', [
      'getPercentSaleArt',
      'getMovilUser',
      'insertEncVenta',
      'insertDetVenta',
      'insertUpdateEncGarantia',
      'insertDetGarantia',
      'insertUpdateStockGarantia',
      'getPerSalePersona',
      'insertEncCotizacion',
      'insertDetCotizacion',
      'getEncCotizacion',
      'getDetCotizacion'
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

          const res_por_prod = await this.percentsPersons().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get procentaje descuento productos',
          //   data: res_por_prod
          // });
          if(res_por_prod.ok){
            percent_genres.length = 0;
            res_por_prod.data.forEach( element => {
              if(element.Estado == 1 && this.data_user.Per_Num_documento == element.Integrante){
                percent_genres.push({
                  label: element.Pv_Descripcion,
                  value: element.Pv_Prcentaje,
                  pv_id: element.Pv_Id
                });
              }
            })
          } else {
            throw new Error(res_por_prod.message);
          }

          const res_por_perso = await this.getPerSalePersona().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get procentaje personalizado descuento productos',
          //   data: res_por_perso
          // });
          if(res_por_perso.ok){
            percent_persona.length = 0;
            res_por_perso.data.forEach( element => {  
              percent_persona.push(element);
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
          // this.tipo_accion = true, se realiza venta, caso contrario es cotización
          if(this.tipo_accion){
            this.enc_venta.Per_Num_documento = this.data_user.Per_Num_documento;
            this.enc_venta.Ev_Estado = this.enc_venta.Mp_Id;
            this.enc_venta.Ev_Entregado = this.enc_venta.Tc_Id == 2 ? 0 : 1;
            this.enc_venta.Ev_conf_pago = this.enc_venta.Mp_Id == 1 ? 1 : 0;
            this.enc_venta.Ev_Subtotal = this.subtotal_venta;
            this.enc_venta.Ev_Des_total_artt = this.Ev_Des_total_art;
            this.enc_venta.Ev_Des_gen_venta = (this.enc_venta.Ev_Subtotal - this.enc_venta.Ev_Des_total_art) * (this.enc_venta.Ev_Descuentog / 100)
            this.enc_venta.Ev_Total_venta = this.enc_venta.Ev_Subtotal - this.Ev_Des_total_art - this.Ev_Des_gen_venta;
            this.enc_venta.Mov_Id = this.movil_selecte;
            this.enc_venta.Ev_Usuario_control = this.data_user.Per_Num_documento;
            this.enc_venta.base = process.env.__BASE__;
            this.enc_venta.Ev_Total_venta = this.enc_venta.Ev_Impuesto > 0 ? this.enc_venta.Ev_Total_venta * this.enc_venta.Ev_Impuesto : this.enc_venta.Ev_Total_venta;
            const res_enc = await this.insertEncVenta(this.enc_venta).then( res => {
              return res.data;
            });
            // console.log({
            //   msg: 'Respuesta insert enc venta',
            //   data: res_enc
            // });
            let promesas = [];
            this.data_sales.forEach( product => {
              product.Ev_Id = res_enc.data.insertId;
              promesas.push(this.insertDetVenta(product).then( res => {
                res.data.msg = 'Respuesta insert det venta';
                return res.data;
              }));
              promesas.push(this.updateInventarioMovil(product).then( res => {
                res.data.msg = 'Respuesta update inventario movil';
                return res.data;
              }))
            });
            if(this.cantidad_garantia){
              this.ecn_garantia = {
                base: process.env.__BASE__,
                Eg_Id: null,
                Eg_Quien_autoriza: 0,
                Ev_Id: res_enc.data.insertId,
                Eg_Observacion: null,
                Eg_estado: 0,
                Eg_User_control: this.data_user.Per_Num_documento,
              }
              const res_gara = await this.insertUpdateEncGarantia(this.ecn_garantia).then( res => {
                return res.data;
              });
              // console.log({
              //   msg: 'Respuesta insert enc garantia',
              //   data: res_gara
              // });
              if(!res_gara.data.affectedRows){
                throw new Error(res_gara.message)
              }
              this.data_sales.forEach( product => {
                product.Eg_Id = res_gara.data.insertId;
                product.Dg_Cant = this.cantidad_garantia;
                promesas.push(this.insertDetGarantia(product).then( res => {
                  res.data.msg = 'Respuesta insert det garantía';
                  return res.data;
                }))
                product.Sg_Cant = this.cantidad_garantia;
                product.simbol = '+';
                promesas.push(this.insertUpdateStockGarantia(product).then( res => {
                  res.data.msg = 'Respuesta update stock garantía';
                  return res.data;
                }))
              })
            }
            Promise.all(promesas).then( data => {
              data.forEach( res => {
                console.log(res)
              })
            }).catch( e => {
              throw new Error(e)
            })
          } else {
            if(this.cliente_selected.value == 0){
              this.$refs.select_client.focus();
              this.validation = true;
              return;
            } else {
              let enc_cotizacion = {
                base: process.env.__BASE__,
                Ec_Id: null,
                CP_Nit: this.cliente_selected.value,
                Per_Num_documento: this.data_user.Per_Num_documento,
                Mov_Id: this.movil_selecte,
                Mp_Id: this.enc_venta.Mp_Id,
                Tc_Id: 1,
                Ec_vigencia: date_now,
                Ec_Impuesto: this.enc_venta.Ev_Impuesto > 0 ? this.enc_venta.Ev_Impuesto : 0,
                Ec_Subtotal: this.subtotal_venta,
                Ec_Des_total_art: this.Ev_Des_total_art,
                Ec_Descuentog: this.enc_venta.Ev_Descuentog,
                Ec_Des_gen_venta: (this.subtotal_venta - this.Ev_Des_total_art) * (this.enc_venta.Ev_Descuentog / 100),
                Ec_Total_venta: this.subtotal_venta - this.Ev_Des_total_art - this.Ev_Des_gen_venta,
                Ec_Estado: 1,
                Ec_Usuario_control: this.data_user.Per_Num_documento,
              }
              enc_cotizacion.Ec_Total_venta = this.enc_venta.Ev_Impuesto > 0 ? enc_cotizacion.Ec_Total_venta * this.enc_venta.Ev_Impuesto : enc_cotizacion.Ec_Total_venta
              const res_enc = await this.insertEncCotizacion(enc_cotizacion).then( res => {
                return res.data;
              });
              // console.log({
              //   msg: 'Respuesta insert encabezado cotización',
              //   data: res_enc
              // })
              if(res_enc.ok){
                let promesas = [];
                this.data_sales.forEach( product => {
                  product.Ec_Id = res_enc.data.insertId;
                  promesas.push(this.insertDetCotizacion(product).then( res => {
                    res.data.msg = 'Respuesta insert detalle cotización'
                    return res.data;
                  }))
                });
                Promise.all(promesas).then( data => {
                  // data.forEach( res => {
                  //   console.log(res)
                  // })
                }).catch( e => {
                  throw new Error(e)
                })
              } else {
                throw new Error(res_enc.message)
              }
            }
          }
          this.$q.notify({
            message: 'Guardado',
            type: 'positive'
          });
          this.$emit('reload')
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
      }, 1000)
    },
    addProduct(){
      let product_add = {
        Ev_Id: null,
        base: process.env.__BASE__,
        codigo: this.producto_selecte.codigo,
        producto: this.producto_selecte.label,
        Art_Id: this.producto_selecte.value,
        Dv_Cant: this.cantidad,
        Dc_Pv_Id: this.descuento_art.pv_id,
        Dv_Precio_compra: this.producto_selecte.precio_compra,
        Dv_precio_venta: this.producto_selecte.precio_venta,
        Dv_valor_descuento: this.descuento_art.value,
        porcentaje_venta: this.producto_selecte.porcentaje_venta,
        subtotal_product: null, //Subtotal del producto
        subtotal_venta: null, //Subtotal sin descuentos al momento de agregar este producto
        total_venta: null, //Total de la venta al momento de agregar este producto
        diferencia_descuento: null,
        des_articulo: this.descuento_art.label,
        // Propiedade para actualizar el stock
        Mov_Id: this.movil_selecte,
        Si_Cant: Number(this.cantidad) + Number(this.cantidad_garantia),
        simbol: '-',
        // Art_Id: null, -> ya esa declarado
      }
      if(this.cantidad > this.cant_disponible){
        this.$q.notify({
          message: 'La cantidad es mayor a la disponible',
          type: 'warning'
        })
      } else {
        let exits_product = this.data_sales.find( product => product.codigo == product_add.codigo );
        if(exits_product){
          this.$q.notify({
            message: 'Producto ya está agregado',
            type: 'warning'
          })
        } else {
          // subtotal_product = precio_compra + (porcentaje_venta * precio_compra / 100) *

          // Ev_Subtotal => venta_total sin ningun descuento ***
          // Ev_Des_total_art => Suma total de lo que se desconto por cada articulo, cliente aa ... *
          // Ev_Total_venta => Ev_Subtotal - Ev_Des_total_art - Ev_Des_gen_venta *
          // Ev_Descuentog => porcentaje descuento de la factura final (10% ...)
          // Ev_Des_gen_venta => ( Ev_subtotal - Ev_des_total_art) * (Ev_Descuentog / 100) *
          // diferencia entre precio venta y subtotal


          product_add.subtotal_product = Math.round((product_add.Dv_Precio_compra + (product_add.Dv_Precio_compra * (this.descuento_art.value / 100))) * this.cantidad); //calcula el subtotal por cada articulo
          this.Ev_Des_total_art = Math.round(this.Ev_Des_total_art + (product_add.Dv_precio_venta * this.cantidad - product_add.subtotal_product )); //Calculamos el descuento de cada articulo
          product_add.diferencia_descuento = this.Ev_Des_total_art;

          this.subtotal_venta = Math.round(this.subtotal_venta + (product_add.Dv_precio_venta * this.cantidad)); // se asigna el subtotal de la factura
          product_add.subtotal_venta = this.subtotal_venta;
          this.Ev_Subtotal = this.subtotal_venta;

          this.Ev_Des_gen_venta = ( this.Ev_Subtotal - this.Ev_Des_total_art ) * ( this.enc_venta.Ev_Descuentog / 100 );

          this.total_venta =  Math.round(this.Ev_Subtotal - this.Ev_Des_total_art - this.Ev_Des_gen_venta);
          this.total_venta =  Math.round(this.enc_venta.Ev_Impuesto > 0 ? this.total_venta * this.enc_venta.Ev_Impuesto : this.total_venta);
          product_add.total_venta = this.total_venta;

          // console.log(product_add)
          this.data_sales.push(product_add);
          this.onReset();
          setTimeout(() => {
            this.$refs.form_sales.resetValidation();
          }, 300)
        }
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
        this.Ev_Des_total_art = this.Ev_Des_total_art - row.diferencia_descuento;
        this.subtotal_venta = this.subtotal_venta - row.subtotal_venta;
        this.total_venta = this.total_venta - row.total_venta;
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
      this.producto_selecte = null;
      this.descuento_art = null;
      this.cantidad = null;
      this.cant_disponible = null;
      this.cantidad_garantia = null;
    },
    // Busca una cotización, para concretar la como venta
    searchCotizacion(){
      if(this.id_cotizacion){
        this.isNumberCotiza = true;
        this.$q.loading.show({
          message: 'Buscando cotización, por favor espere...'
        });
        setTimeout(async() => {
          try {
            const res_enc = await this.getEncCotizacion(this.id_cotizacion).then( res => {
              return res.data;
            });
            // console.log({
            //   message: 'Respuesta get encabezado cotización',
            //   data: res_enc
            // });
            if(res_enc.ok){
              if(res_enc.result){
                let encabezado = res_enc.data;
                // Asignamos los datos al frontend
                this.movil_selecte = encabezado.Mov_Id;
                this.cliente_selected = all_clients.find( cliente => cliente.value == encabezado.CP_Nit)
                this.enc_venta.Tc_Id = encabezado.Tc_Id;
                this.enc_venta.Mp_Id = encabezado.Mp_Id;
                this.enc_venta.Ev_Impuesto = encabezado.Ec_Impuesto;
                this.enc_venta.Ev_Descuentog = encabezado.Ec_Descuentog;

                // this.Ev_Des_total_art = encabezado.Ec_Des_total_art;
                // this.subtotal_venta = encabezado.Ec_Subtotal;
                // this.Ev_Subtotal = encabezado.Ec_Total_venta;
                // this.Ev_Des_gen_venta = encabezado.Ec_Des_gen_venta;
                // this.total_venta = encabezado.Ec_Total_venta;

                // Obtenemos el detalle de la cotización
                const res_det = await this.getDetCotizacion(this.id_cotizacion).then( res => {
                  return res.data;
                });
                // console.log({
                //   msg: 'Respuesta get detalle cotización',
                //   data: res_det
                // })

                this.data_sales.length = 0;
                if(res_det.ok){
                  if(res_det.result){
                    res_det.data.forEach( product => {
                      let product_add = {
                        Ev_Id: null,
                        base: process.env.__BASE__,
                        codigo: product.cond_inventario,
                        producto: product.Art_Nombre,
                        Art_Id: product.Art_Id,
                        Dv_Cant: product.Dc_Cant,
                        Dv_Precio_compra: product.Dc_Precio_compra,
                        Dv_precio_venta: product.Dc_precio_venta,
                        Dv_valor_descuento: product.Dc_valor_descuento,
                        porcentaje_venta: product.prc_venta,
                        subtotal_product: null, //Subtotal del producto
                        subtotal_venta: null, //Subtotal sin descuentos al momento de agregar este producto
                        total_venta: null, //Total de la venta al momento de agregar este producto
                        diferencia_descuento: null,
                        des_articulo: product.name_porcentaje,
                        // Propiedade para actualizar el stock
                        Mov_Id: res_enc.data.Mov_Id,
                        Si_Cant: product.Dc_Cant,
                        simbol: '-',
                        // Art_Id: null, -> ya esa declarado
                      }
                      product_add.subtotal_product = Math.round((product_add.Dv_Precio_compra + (product_add.Dv_Precio_compra * (product_add.Dv_valor_descuento / 100))) * product_add.Dv_Cant); //calcula el subtotal por cada articulo
                      this.Ev_Des_total_art = Math.round(this.Ev_Des_total_art + (product_add.Dv_precio_venta * product_add.Dv_Cant - product_add.subtotal_product )); //Calculamos el descuento de cada articulo
                      product_add.diferencia_descuento = this.Ev_Des_total_art;

                      this.subtotal_venta = Math.round(this.subtotal_venta + (product_add.Dv_precio_venta * product_add.Dv_Cant)); // se asigna el subtotal de la factura
                      product_add.subtotal_venta = this.subtotal_venta;
                      this.Ev_Subtotal = this.subtotal_venta;
                      console.log(product_add)

                      this.Ev_Des_gen_venta = ( this.Ev_Subtotal - this.Ev_Des_total_art ) * ( this.enc_venta.Ev_Descuentog / 100 );

                      this.total_venta =  Math.round(this.Ev_Subtotal - this.Ev_Des_total_art - this.Ev_Des_gen_venta);
                      this.total_venta =  Math.round(this.enc_venta.Ev_Impuesto > 0 ? this.total_venta * this.enc_venta.Ev_Impuesto : this.total_venta);
                      product_add.total_venta = this.total_venta;

                      this.data_sales.push(product_add)
                    })
                  } else {
                    this.$q.notify({
                      message: 'Sin resultados',
                      type: 'warning'
                    })
                  }
                } else {
                  throw new Error(res_det.message)
                }
              } else {
                this.$q.notify({
                  message: 'Sin resultados',
                  type: 'warning'
                })
              }
            } else {
              throw new Error(res_enc.message)
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
        }, 1000)
      } else {
        this.isNumberCotiza = false;
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
    },
    // Valida el campo impuesto
    validateImpuesto(val){
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if(val == 0){
            resolve(true)
          }
          // call
           resolve(true)
        }, 300)
      })
    }
  }
}
</script>
<style scoped>
.height{
  height: 350px !important;
}
.my-custom-toggle{
  border: 1px solid #027be3
}
</style>