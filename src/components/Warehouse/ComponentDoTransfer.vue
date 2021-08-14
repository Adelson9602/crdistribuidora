<template>
  <div>
    <q-form
      @submit="addProduct"
      class="q-gutter-md"
      ref="form_add_product"
      autocapitalize="off"
      autocomplete="off"
    >
      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="movil_origen"
            :options="options_movil_origen"
            hint="Origen"
            :rules="[val => !!val || 'Origen es requerido']"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="integrante_movil"
            :options="opt_inte_origen"
            hint="Integrante origen"
            :rules="[val => !!val || 'Integrante es requerido']"
            map-options
            emit-value
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="movil_destino"
            :options="options_movil_destino"
            hint="Destino"
            :rules="[val => !!val || 'Destino es requerido']"
            :option-disable="opt => Object(opt) === opt ? opt.inactive === true : true"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="enc_traslado.Etm_Estado"
            :options="options_state"
            hint="Entregado"
            :rules="[validateState]"
            map-options
            emit-value
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm" v-if="enc_traslado.Etm_Estado == 1">
          <q-select
            v-model="integ_movil_destino"
            :options="opt_inte_destino"
            hint="Integrante destino"
            :rules="[val => !!val || 'Integrante es requerido']"
            map-options
            emit-value
          />
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <q-input
            v-model="enc_traslado.Etm_Observaciones"
            type="textarea"
            label="Observaciones"
            rows="2"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
          <q-select
            v-model="product_transfer"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Producto a trasladar"
            :rules="[val => !!val || 'Producto es requerido']"
            :options="opt_products"
            @filter="filterProducts"
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
              <div class="self-center full-width no-outline" tabindex="0">{{cantidad_disponible}}</div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 q-px-sm">
          <q-input
            v-model="cantidad_trasladar"
            mask="##########"
            hint="Cantidad trasladar"
            :rules="[validateCantidad]"
          />
        </div>
        <div class="col-xs-12 col-md-4 q-px-sm">
          <q-input
            v-model="dtm_Observacion"
            type="text"
            label="Observaciones"
          />
        </div>
      </div>
      <!-- btn subtmit para el formulario -->
      <div>
        <q-btn label="Submit" type="submit" color="primary" class="hide-btn_submit"/>
      </div>
    </q-form>
    <div class="row">
      <div class="col-xs-12">
        <q-table
          title="Productos a trasladar"
          :data="data_transfer"
          :columns="columns"
          row-key="prod_codigo"
          flat
          class="height-table"
          :grid="$q.screen.xs"
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
                <q-btn size="sm" color="accent" round dense @click="deleteItem(props.row)" icon="delete"/>
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
          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-card>
                <q-card-actions align="right">
                  <!-- Btns -->
                  <q-btn color="negative" icon="delete" round size="sm"/>
                </q-card-actions>
                <q-separator />
                <q-list dense>
                  <q-item v-for="col in props.cols" :key="col.name">
                    <q-item-section>
                      <q-item-label>{{ col.label }}</q-item-label>
                      <q-item-label caption>{{ col.value }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18,18]" expand>
      <q-btn color="positive" icon="save" label="Guardar" @click="onSubmit" v-if="data_transfer.length > 0"/>
    </q-page-sticky>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { date } from 'quasar'
import dialog from 'components/Generals/ComponentDialogWarning';
let moviles_origen = []; // Contiene las opciones para los selects de moviles
let moviles_destino = []; // Contiene las opciones para los selects de moviles
let integrantes_movil = []; //Contiene las opciones para el select integrantes moviles
let integ_movil_destino = []; //Contiene las opciones para el select integrantes moviles
let opt_products_transfer = []; //Contiene las opciones para el select producto a trasladar
export default {
  name: 'ComponentDoTransfer',
  data () {
    return {
      options_movil_origen: moviles_origen, //Opciones para el select origen
      options_movil_destino: moviles_destino, //Opciones para el sect destino
      columns: [
        {
          name: 'prod_codigo',
          align: 'center',
          label: 'CÓDIGO PRODUCTO',
          sortable: true,
          field: 'prod_codigo'
        },
        {
          name: 'prod_descripcion',
          align: 'center',
          label: 'DESCRIPCIÓN',
          sortable: true,
          field: 'prod_descripcion'
        },
        {
          name: 'Dtm_Cant',
          align: 'center',
          label: 'CANTIDAD TRASLADAR',
          sortable: true,
          field: 'Dtm_Cant'
        },
        {
          name: 'Dtm_Observacion',
          align: 'center',
          label: 'OBSERVACIÓN PRODUCTO',
          sortable: true,
          field: 'Dtm_Observacion'
        },
        {
          name: 'movil_origen',
          align: 'center',
          label: 'MOVIL ORIGEN',
          sortable: true,
          field: 'movil_origen'
        },
        {
          name: 'integrante_movil',
          align: 'center',
          label: 'INTEGRANTE MOVIL',
          sortable: true,
          field: 'integrante_movil'
        },
        {
          name: 'movil_destino',
          align: 'center',
          label: 'MOVIL DESTINO',
          sortable: true,
          field: 'movil_destino'
        },
        {
          name: 'integ_movil_destino',
          align: 'center',
          label: 'INTEGRANTE MOVIL DESTINO',
          sortable: true,
          field: 'integ_movil_destino'
        },
        {
          name: 'Etm_Observaciones',
          align: 'center',
          label: 'OBSERVACIONES',
          sortable: true,
          field: 'Etm_Observaciones'
        },
      ],
      data_transfer: [],
      movil_origen: null, //Origen seleccionada
      movil_destino: null, //Destino seleccionado
      enc_traslado: {
        base: null,
        Etm_Id: null,
        Etm_Mov_ID_entrega: null,
        Etm_Usuario_entrega: null,
        Etm_Fecha_entrega: null,
        Etm_Mov_Id_recibe: null,
        Etm_Usuario_recibe: null,
        Etm_Fecha_recibe: null,
        Etm_Observaciones: null,
        Etm_Estado: null
      },
      dtm_Observacion: null,
      cantidad_trasladar: null,
      cantidad_disponible: null,
      integrante_movil: null, //Integrante movil origen seleccionado
      integ_movil_destino: null, //Integrante movil destino seleccionado
      opt_inte_origen: integrantes_movil,
      opt_inte_destino: integ_movil_destino,
      product_transfer: null, //producto seleccionado para trasladar
      opt_products: opt_products_transfer,
      dialog_warning: false, //Controla el dialogo de advertensia de reseteo de datos
      options_state: [
        {
          label: 'ENTREGADO',
          value: 1
        },
        {
          label: 'PENDIENTE',
          value: 0
        },
      ],
    }
  },
  watch: {
    movil_origen(value, old_value){
      // Comparamos si el nuevo el valor del select es distinto al antiguo
      if(old_value && value && value.value != old_value.value && this.data_transfer.length > 0){
        this.$q.dialog({
          component: dialog,
          parent: this,
          title: 'Reseteo de datos',
          msg: 'Atención! Estas cambiando el valor del select, esto borrará todos los datos agregados hasta ahora, ¿Está seguro que desea continuar?',
        }).onOk(() => {
          this.onReset();
          this.getDataMovilOrigen(value);
        })
        return;
      }
      // Cuando selecciona una opción por primera vez
      if(value){
        this.integrante_movil = null;
        this.getDataMovilOrigen(value);
      }
    },
    movil_destino(value, old_value){
      if(old_value && value && value.value != old_value.value && this.data_transfer.length > 0 ){
        this.$q.dialog({
          component: dialog,
          parent: this,
          title: 'Reseteo de datos',
          msg: 'Atención! Estas cambiando el valor del select, esto borrará todos los datos agregados hasta ahora, ¿Está seguro que desea continuar?',
        }).onOk(() => {
          this.onReset();
          this.getDataMovilDestino(value);
        })
        return;
      }
      // Cuando selecciona una opción por primera vez
      if(value){
        this.integ_movil_destino = null;
        this.getDataMovilDestino(value);
      }
    },
    integrante_movil(value, old_value){
      this.enc_traslado.Etm_Usuario_entrega = value;
      // Comparamos si el nuevo el valor del select es distinto al antiguo
      if(old_value && value && value.value != old_value.value && this.data_transfer.length > 0){
        this.$q.dialog({
          component: dialog,
          parent: this,
          title: 'Reseteo de datos',
          msg: 'Atención! Estas cambiando el valor del select, esto borrará todos los datos agregados hasta ahora, ¿Está seguro que desea continuar?',
        }).onOk(() => {
          this.onReset();
        })
        return;
      }
    },
    integ_movil_destino(value, old_value){
      // Comparamos si el nuevo el valor del select es distinto al antiguo
      if(old_value && value && value.value != old_value.value && this.data_transfer.length > 0){
        this.$q.dialog({
          component: dialog,
          parent: this,
          title: 'Reseteo de datos',
          msg: 'Atención! Estas cambiando el valor del select, esto borrará todos los datos agregados hasta ahora, ¿Está seguro que desea continuar?',
        }).onOk(() => {
          this.onReset();
        })
        return;
      }
    },
    product_transfer(value){
      if(value){
        this.cantidad_disponible = value.cantidad
      }
    },
  },
  created(){
    this.mode_grid = this.device_mobile;
    if(!this.mode_grid){
      this.visible_columns = [
        'prod_codigo',
        'prod_descripcion',
        'Dtm_Cant',
        'Dtm_Observacion',
      ]
    }
    this.getData();
  },
  methods: {
    ...mapActions('warehouse', [
      'getStockMovil',
      'insertEncTransfer',
      'insertDetTraslado',
      'updateInventarioMovil'
    ]),
    ...mapActions('master', [
      'getMovil',
      'getMembersMovil'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo datos, por favor espere...'
      });
      setTimeout(async() => {
        try {
          const res_moviles = await this.getMovil().then( res => {
            return res.data;
          });
          // console.log({
          //   message: 'Repuesta get moviles',
          //   data: res_moviles
          // });
          if(res_moviles.ok){
            if(res_moviles.result){
              moviles_origen.length = 0;
              moviles_destino.length = 0;
              res_moviles.data.forEach( movil => {
                if(movil.Mov_Estado == 1){
                  moviles_origen.push({
                    label: movil.Mov_Descripcion,
                    value: movil.Mov_Id,
                    inactive: false,
                  });
                  
                  moviles_destino.push({
                    label: movil.Mov_Descripcion,
                    value: movil.Mov_Id,
                    inactive: false,
                  });
                }
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_moviles.message)
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
    // Realiza el traslado
    onSubmit(){
      this.$q.loading.show({
        message: 'Guardando traslado, por favor espere...',
      });
      setTimeout( async() => {
        try {
          let timeStamp = Date.now()
          let formattedString = date.formatDate(timeStamp, 'YYYY-MM-DD');
          this.enc_traslado.Etm_Fecha_entrega = formattedString;
          if(this.enc_traslado.Etm_Estado == 1){
            this.enc_traslado.Etm_Fecha_recibe = formattedString;
            this.enc_traslado.Etm_Usuario_recibe = this.integ_movil_destino;
          }
          this.enc_traslado.base = process.env.__BASE__;
          const res_enc = await this.insertEncTransfer(this.enc_traslado).then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta insert update encabezado traslado',
            data: res_enc
          });
          if(!res_enc.ok){
            throw new Error(res_enc.message);
          }

          let det_traslado = []; //Arrary de promesas del detalle del traslado
          let update_cant = []; // Array de promesas para actulizar las cantidades de los productos a actualizar
          this.data_transfer.forEach( producto => {
            producto.Etm_Id = res_enc.data.insertId;
            let peticion = this.insertDetTraslado(producto).then( res => {
              return res.data;
            });
            det_traslado.push(peticion);
            if(this.enc_traslado.Etm_Estado == 1){
              // Resta los productos de la movil origen
              producto.simbol = '-';
              producto.Mov_Id = this.enc_traslado.Etm_Mov_ID_entrega;
              producto.Si_Cant = producto.Dtm_Cant;

              let res_produ = this.updateInventarioMovil(producto).then( res => {
                return res.data;
              });
              update_cant.push(res_produ);
              // Suma los productos en la movil destino
              producto.simbol = '+';
              producto.Mov_Id = this.enc_traslado.Etm_Mov_Id_recibe;
              producto.Si_Cant = producto.Dtm_Cant;
              let suma_produ = this.updateInventarioMovil(producto).then( res => {
                return res.data;
              });
              update_cant.push(suma_produ);
            }
          })

          Promise.all(det_traslado).then( res_det => {
            res_det.forEach( res => {
              console.log({
                msg: 'Respuesta insert update detalle traslado',
                data: res.data
              });
              if(!res.ok){
                throw new Error(res.message);
              }
            })
          });
          // Actualizamos las cantidades si el estado es entregado
          if(this.enc_traslado.Etm_Estado == 1){
            Promise.all(update_cant).then( res_det => {
              res_det.forEach( res => {
                console.log({
                  msg: 'Respuesta insert update cantidades traslado',
                  data: res.data
                });
                if(!res.ok){
                  throw new Error(res.message);
                }
              })
            });
          }
          this.$q.notify({
            message: 'Guardado',
            type: 'positive'
          });
          this.$emit('reload');
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
    // Agrega los productos a trasladar a la tabla
    addProduct(){
      let product_add = {
        movil_origen: this.movil_origen.label,
        integrante_movil: this.integrante_movil.label,
        movil_destino: this.movil_destino.label,
        integ_movil_destino: this.enc_traslado.Etm_Estado == 1 ? this.integ_movil_destino.label : 0,
        Etm_Observaciones: this.enc_traslado.Etm_Observaciones,
        // Detalle
        base: process.env.__BASE__,
        Etm_Id: null,
        Art_Id: this.product_transfer.Art_Id,
        prod_descripcion: this.product_transfer.label,
        prod_codigo: this.product_transfer.value,
        Dtm_Cant: this.cantidad_trasladar,
        Dtm_Observacion: this.dtm_Observacion,
      }
      let exist_product = this.data_transfer.find( product => product.prod_codigo == product_add.prod_codigo );
      if(exist_product){
        this.$q.notify({
          message: 'Este producto ya esta agregado',
          type: 'warning'
        });
      } else {
        this.data_transfer.push(product_add);
        this.product_transfer = null;
        this.cantidad_disponible = null;
        this.cantidad_trasladar = null;
        this.dtm_Observacion = null;
        setTimeout(()=> {
          this.$refs.form_add_product.resetValidation();
        }, 300)
      }
    },
    getDataMovilOrigen(value){
      this.enc_traslado.Etm_Mov_ID_entrega = value.value; //Asignamos el id de la movil que entrega
      moviles_destino.forEach( opt => {
        if(opt.value == value.value){
          opt.inactive = true;
        } else {
          opt.inactive = false;
        }
      });
      this.$q.loading.show({
        message: 'Obteniendo integrantes de la movil, por favor espere...'
      });
      setTimeout( async () => {
        try {
          const member_movil = await this.getMembersMovil(value.value).then( res => {
            return res.data;
          });
          // console.log({
          //   message: 'Repuesta get integrantes movile',
          //   data: member_movil
          // });
          if(member_movil.ok){
            if(member_movil.result){
              integrantes_movil.length = 0;
              member_movil.data.forEach( member => {
                if(member.Estado == 1){
                  integrantes_movil.push({
                    label: member.Per_Nombre.toUpperCase(),
                    value: member.Per_Num_documento,
                  });
                }
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(member_movil.message)
          }
          
          // Obtiene el stock de la movil
          const res_stock = await this.getStockMovil(value.value).then( res => {
            return res.data;
          });
          // console.log({
          //   message: 'Repuesta get stock',
          //   data: res_stock
          // });
          if(res_stock.ok){
            if(res_stock.result){
              opt_products_transfer.length = 0;
              res_stock.data.forEach( product => {
                opt_products_transfer.push({
                  label: product.Art_Nombre,
                  value: product.Art_Codigo_inv,
                  Art_Id: product.Art_Id,
                  cantidad: product.Si_Cant
                });
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_stock.message)
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
    getDataMovilDestino(value){
      this.enc_traslado.Etm_Mov_Id_recibe = value.value; //Asignamos el id de la movil que recibe
      this.$q.loading.show({
        message: 'Obteniendo integrantes de la movil, por favor espere...'
      });
      setTimeout( async () => {
        try {
          const member_movil = await this.getMembersMovil(value.value).then( res => {
            return res.data;
          });
          // console.log({
          //   message: 'Repuesta get integrantes movile',
          //   data: member_movil
          // });
          if(member_movil.ok){
            if(member_movil.result){
              integ_movil_destino.length = 0;
              member_movil.data.forEach( member => {
                if(member.Estado == 1){
                  integ_movil_destino.push({
                    label: member.Per_Nombre.toUpperCase(),
                    value: member.Per_Num_documento,
                  });
                }
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(member_movil.message)
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
    // Borra productos de la tabla productos a trasladar
    deleteItem(row){
      this.$q.dialog({
          component: dialog,
          parent: this,
          title: 'Eliminar producto agregado',
          msg: `Atención! Estas a un paso de eliminar un producto agregado para trasladar (${row.prod_codigo} - ${row.prod_descripcion}) ¿Está seguro que desea continuar?`,
        }).onOk(() => {
          this.data_transfer.splice(this.data_transfer.indexOf(row), 1)
        })
    },
    onReset(){
      this.movil_origen = null;
      this.integrante_movil = null;
      this.movil_destino = null;
      this.integ_movil_destino = null;
      this.product_transfer = null;
      this.enc_traslado = {
        base: null,
        Etm_Id: null,
        Etm_Mov_ID_entrega: null,
        Etm_Usuario_entrega: null,
        Etm_Fecha_entrega: null,
        Etm_Mov_Id_recibe: null,
        Etm_Usuario_recibe: null,
        Etm_Fecha_recibe: null,
        Etm_Observaciones: null,
        Etm_Estado: null
      },
      this.det_traslado = {
        base: null,
        Etm_Id: null,
        Art_Id: null,
        Dtm_Cant: null,
        Dtm_Observacion: null
      }
      this.cantidad_disponible = null;
      this.cantidad_trasladar = null;
      this.data_transfer.splice(0)
      setTimeout(()=> {
        this.$refs.form_add_product.resetValidation();
      }, 300)
    },
    // validador del input cantidad a trasladar
    validateCantidad(val){
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if(this.cantidad_disponible < val){
            resolve(false || 'La cantidad a trasladar es mayor a la disponible')  
          } else if(!val){
            resolve(false || 'Cantidad a trasladar es requerido')
          } else if (val == 0) {
            resolve(false || 'Cantidad a trasladar deber ser diferente de 0')
          }
          // call
           resolve(true)
        }, 300)
      })
    },
    // Valida el select estado
    validateState(val){
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if(!val && val != 0){
            resolve(false || 'Entregado es requerido')  
          }
          // call
           resolve(true)
        }, 300)
      })
    },
    // Buscador para el select productos
    filterProducts (val, update, abort) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              this.opt_products = opt_products_transfer
            }
            else {
              const needle = val.toLowerCase()
              this.opt_products = opt_products_transfer.filter(v => v.label.toLowerCase().indexOf(needle) > -1 || v.value.toString().toLowerCase().indexOf(needle) > -1)
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
