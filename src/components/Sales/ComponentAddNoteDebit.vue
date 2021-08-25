<template>
  <div>
    <q-form
      @submit="addProduct"
      class="q-gutter-md"
      ref="form_sales"
      autocomplete="off"
    >
      <!-- Encabezado -->
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
          />
        </div>
      </div>
      <q-btn label="Submit" type="submit" color="primary" class="hide-btn_submit"/>
    </q-form>
    <div class="row">
      <div class="col-xs-12 col-md-6 q-px-sm">
        <q-table
          title="Productos vendidos"
          :data="data_sales_product"
          :columns="columns_sales_product"
          flat
          class="height"
        />
      </div>
      <div class="col-xs-12 col-md-6 q-px-sm">
        <q-table
          title="Productos a agregar"
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
      </div>
    </div>
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
import { date } from 'quasar';
let date_now = null;
export default {
  name: 'ComponentAddSales',
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
      data_sales_product: [],
      columns_sales_product: [
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
          label: 'Cantidad vendida',
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
      dialog_create_user: false,
      Ev_Des_total_art: null,
      Ev_Subtotal: null,
      Ev_Des_gen_venta: null,
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
      encebezado_venta: null,
      enc_nota_debito: null,
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
            this.options_des_products = percent_genres;
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
      }
    }
  },
  props: [
    'prop_encabezado',
    'prop_product'
  ],
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
    ]),
    ...mapActions('warehouse', [
      'updateInventarioMovil',
      'getStockMovil'
    ]),
    ...mapActions('sales', [
      'getPercentSaleArt',
      'insertUpdateStockGarantia',
      'getPerSalePersona',
      'getDetailSales'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo datos del servidor, por favor espere...'
      });
      setTimeout(async()=> {
        try {
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
          this.enc_nota_debito = this.prop_encabezado;

          const res_por_prod = await this.getPercentSaleArt().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get procentaje descuento productos',
          //   data: res_por_prod
          // });
          if(res_por_prod.ok){
            percent_genres.length = 0;
            res_por_prod.data.forEach( element => {  
              if(element.Pv_Estado == 1){
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

          const res_deta = await this.getDetailSales(this.prop_encabezado.Ev_Id).then(res => {
            return res.data;
          });
          console.log({
            msg: "Respuesta get detalle venta",
            data: res_deta
          });
          if (res_deta.ok) {
            if (res_deta.result) {
              this.data_sales_product.length = 0;
              res_deta.data.forEach(product => {
                product.producto = product.Art_Descripcion;
                product.codigo = product.Art_Codigo_inv;
                this.data_sales_product.push(product);
              });
              this.movil_selecte = this.enc_nota_debito.Mov_Id;
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning"
              });
            }
          } else {
            throw new Error(res_deta.message);
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
          this.enc_venta.Per_Num_documento = this.data_user.Per_Num_documento;
          this.enc_venta.Ev_Estado = this.enc_venta.Mp_Id;
          this.enc_venta.Ev_Entregado = this.enc_venta.Tc_Id == 2 ? 0 : 1;
          this.enc_venta.Ev_conf_pago = this.enc_venta.Mp_Id == 1 ? 1 : 0;
          this.enc_venta.Ev_Subtotal = this.subtotal_venta;
          this.enc_venta.Ev_Des_total_art = this.Ev_Des_total_art;
          this.enc_venta.Ev_Des_gen_venta = (this.enc_venta.Ev_Subtotal - this.enc_venta.Ev_Des_total_art) * (this.enc_venta.Ev_Descuentog / 100)
          this.enc_venta.Ev_Total_venta = this.enc_venta.Ev_Subtotal - this.Ev_Des_total_art - this.Ev_Des_gen_venta;
          this.enc_venta.Mov_Id = this.movil_selecte;
          this.enc_venta.Ev_Usuario_control = this.data_user.Per_Num_documento;
          this.enc_venta.base = process.env.__BASE__;
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
        Dv_Precio_compra: this.producto_selecte.precio_compra,
        Dv_precio_venta: this.producto_selecte.precio_venta,
        Dv_valor_descuento: this.descuento_art.value,
        porcentaje_venta: this.producto_selecte.porcentaje_venta,
        subtotal_product: null,
        des_articulo: this.descuento_art.label,
        // Propiedade para actualizar el stock
        Mov_Id: this.movil_selecte,
        Si_Cant: this.cantidad + this.cantidad_garantia,
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


          product_add.subtotal_product = product_add.Dv_Precio_compra + (this.descuento_art.value * product_add.Dv_Precio_compra) / 100 * this.cantidad; //calcula el subtotal por cada articulo
          this.Ev_Des_total_art = Math.round(this.Ev_Des_total_art + (product_add.Dv_precio_venta * this.cantidad ) - product_add.subtotal_product); //Calculamos el descuento de cada articulo

          this.subtotal_venta = Math.round(this.subtotal_venta + (product_add.Dv_precio_venta * this.cantidad)); // se asigna el subtotal de la factura
          this.Ev_Subtotal = this.subtotal_venta;

          this.Ev_Des_gen_venta = ( this.Ev_Subtotal - this.Ev_Des_total_art ) * ( this.enc_venta.Ev_Descuentog / 100 );

          this.total_venta = this.Ev_Subtotal - this.Ev_Des_total_art - this.Ev_Des_gen_venta;

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
        this.Ev_Des_total_art = this.Ev_Des_total_art - (row.subtotal_product * Number(row.Dv_Cant));
        this.subtotal_venta = this.subtotal_venta - (row.Dv_precio_venta * Number(row.Dv_Cant));
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
      this.producto_selecte = null;
      this.descuento_art = null;
      this.cantidad = null;
      this.cant_disponible = null;
      this.cantidad_garantia = null;
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
<style scoped>
.height{
  height: 350px !important;
}
</style>