<template>
  <div>
    <q-form
      @submit="addProduct"
      ref="form_salida"
      autocomplete="off"
    >
      <div class="row">
        <div class="col-xs-12 q-px-sm q-gutter-x-sm">
          <div class="text-body1">Tipo de salida a realizar</div>
          <q-radio keep-color v-model="tipo_salida" val="1" label="Salida a proveedor" color="teal" />
          <q-radio keep-color v-model="tipo_salida" val="2" label="Salida a garantía" color="orange" />
          <q-radio keep-color v-model="tipo_salida" val="3" label="Salida a almacen" color="red" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="enc_salida.CP_Nit"
            dense
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
                  Sin resultado
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="enc_salida.Esp_Cedula_Autoriza"
            dense
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Quíen autoriza"
            :options="options_person"
            @filter="filterPerson"
            map-options
            emit-value
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultado
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-input
            v-model="enc_salida.Esp_Autoriza_cliente"
            dense
            type="text"
            hint="Cliente que autoriza"
            maxlength="100"
            counter
            :rules="[val => !!val || 'Cliente que autoriza es obligatorio']"
            @input="val => { enc_salida.Esp_Autoriza_cliente = val.toUpperCase() }"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-input
            v-model="enc_salida.Esp_Nombre_Recibe"
            dense
            type="text"
            hint="Cliente que recibe"
            maxlength="100"
            counter
            :rules="[val => !!val || 'Quién recibe es obligatorio']"
            @input="val => { enc_salida.Esp_Nombre_Recibe = val.toUpperCase() }"
          />
        </div>
        <div class="col-xs-12 col-sm-12 q-px-sm">
          <q-input
            v-model="enc_salida.Esp_Observacion"
            dense
            type="textarea"
            hint="Observación"
            rows="3"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
          <q-select
            v-model="producto_selected"
            dense
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Producto"
            :options="options_products"
            @filter="filterProducts"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultado
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
          <q-field hint="Cantidad disponible" dense stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{cantidad_disponible}}</div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm">
          <q-input
            v-model="cantidad"
            dense
            type="text"
            hint="Cantidad"
          />
        </div>
        <div class="col-xs-12 q-px-sm">
          <q-input
            v-model="dsp_observacion"
            dense
            type="textarea"
            hint="Observaciones"
            rows="3"
          />
        </div>
      </div>
      <div>
        <q-btn label="Submit" type="submit" color="primary" class="hide-btn_submit"/>
      </div>
    </q-form>
    <div class="row">
      <div class="col-xs-12">
        <q-table
          title="Productos agregados"
          :data="data_product"
          :columns="columns"
          row-key="name"
          flat
          class="height"
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
    <q-page-sticky position="bottom-right" :offset="[18,18]">
      <q-btn color="green" icon="save" label="Guardar" @click="onSubmit" />
    </q-page-sticky>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
let all_providers = []; //Contiene todos los proveedores
let all_productos = []; //Contiene todos los productos
let all_person = []; //Contiene todos los productos
export default {
  name: 'ComponentAddWarranties',
  data () {
    return {
      options_providers: all_providers, //Opciones para el select proveedores
      options_products: all_productos, //Opciones para el select productos
      options_person: all_person, //Opciones para el select quien autoriza
      tipo_salida: null,
      producto_selected: null,
      enc_salida: {
        base: null,
        Esp_Cedula_Autoriza: null, 
        Esp_Autoriza_cliente: null, //Nombre digitado
        CP_Nit: null,
        Esp_Nombre_Recibe: null, //Nombre digitado
        Esp_Observacion: null,
        Esp_User_control: null,
      },
      dsp_observacion: null, //Obs para detalle salida
      cantidad: null, //Cantidad productos par la salida
      cantidad_disponible: null, //Cantidad disponible
      columns: [
        {
          name: 'codigo',
          aling: 'center',
          label: 'Código',
          sortable: true,
          field: 'codigo'
        },
        {
          name: 'descripcion',
          aling: 'center',
          label: 'Descripción producto',
          sortable: true,
          field: 'descripcion'
        },
        {
          name: 'Art_Id',
          aling: 'center',
          label: 'ID Artículo',
          sortable: true,
          field: 'Art_Id'
        },
        {
          name: 'Dsp_Cant',
          aling: 'center',
          label: 'Cantidad',
          sortable: true,
          field: 'Dsp_Cant'
        },
        {
          name: 'Dsp_Observacion',
          aling: 'center',
          label: 'Observación',
          sortable: true,
          field: 'Dsp_Observacion'
        },
      ],
      data_product: [],
    }
  },
  created(){
    this.getData();
  },
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
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
                      codigo: product.Art_Codigo_inv,
                      cantidad: product.Si_Cant
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
              const res_stock_garantia = await this.getStockGarantias(1).then( res => {
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
                      codigo: product.Art_Codigo_inv,
                      cantidad: product.Sg_Cant,
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
    },
    producto_selected(value){
      if(value){
        this.cantidad_disponible = value.cantidad;
      }
    }
  },
  methods: {
    ...mapActions('shopping', [
      'getProviders',
      'getStockGarantias',
      'getPersonAuthorized',
      'insertEncSalidaProv',
      'insertDetSalidaProv',
    ]),
    ...mapActions("warehouse", [
      "getStockMovil",
      "updateInventarioMovil"
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

          const res_autorized = await this.getPersonAuthorized().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get personas autorizadas',
            data: res_autorized
          });
          if(res_autorized.ok){
            if(res_autorized.result){
              all_person.length = 0 ;
              res_autorized.data.forEach( person => {
                if(person.Qa_Estado == 1){
                  all_person.push({
                    value: person.Per_Num_documento,
                    label: person.Per_Nombre,
                  })
                }
              });
            } else {
              this.$q.notify({
                message: res_autorized.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_autorized.message);
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
        message: 'Realizando salida, por favor espere...'
      });
      setTimeout(async() => {
        try {
          if(this.tipo_salida == 1 || this.tipo_salida == 3){
            this.enc_salida.Esp_User_control = this.data_user.Per_Num_documento,
            this.enc_salida.base = process.env.__BASE__;
            const res_enc = await this.insertEncSalidaProv(this.enc_salida).then( res => {
              return res.data;
            });
            console.log({
              msg: 'Respuesta insert enc salida',
              data: res_enc
            });
            if(res_enc.ok){
              let promesas = [];
              this.data_product.forEach(product => {
                product.Esp_Id = res_enc.data.insertId;
                promesas.push(this.insertDetSalidaProv(product).then( res => {
                  res.data.msg = 'Respuesta insert det traslado';
                  return res.data;
                }))
                promesas.push(this.updateInventarioMovil(product).then( res => {
                  res.data.msg = 'Respuesta update inventario';
                  return res.data
                }))
              });
              Promise.all(promesas).then( data => {
                data.forEach( res => {
                  console.log({
                    msg: res.msg,
                    data: res
                  });
                  if(!res.data.affectedRows){
                    throw new Error('No pudimos realizar el traslado')
                  }
                })
              })
            } else {
              throw new Error(res_enc.message)
            }
            this.$q.notify({
              message: 'Salida realizada',
              type: 'positive'
            })
            this.$emit('reload')
          } else {
            
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
    },
    addProduct(){
      let det_salida = {
        base: process.env.__BASE__,
        Esp_Id: null, //Id del encabezado
        codigo: this.producto_selected.codigo,
        descripcion: this.producto_selected.label,
        Art_Id: this.producto_selected.value,
        Dsp_Cant: this.cantidad,
        Dsp_Observacion: this.dsp_observacion,
        Mov_Id: 1,
        Si_Cant: this.cantidad,
        simbol: '-'
      };
      // Movil siempre es 1
      // proveedor, descuenta del stock consulta de siempre,

      if(this.cantidad > this.cantidad_disponible ){
        this.$q.notify({
          message: 'La cantidad es mayor a la disponible',
          type: 'warning'
        });
      } else {
        let exits_product = this.data_product.find( product => product.codigo == det_salida.codigo );
        if(exits_product){
          this.$q.notify({
            message: 'Este producto ya esta gregado',
            type: 'warning'
          });
        } else {
          this.data_product.push(det_salida);
          this.onReset();
        }
      }
    },
    onReset(){
      this.cantidad = null;
      this.cantidad_disponible = null;
      this.producto_selected = null;
      setTimeout(this.$refs.form_salida.resetValidation(), 300);
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
    // Buscador para el select quién autoriza
    filterPerson (val, update, abort) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              this.options_person = all_person
            }
            else {
              const needle = val.toLowerCase()
              this.options_person = all_person.filter(v => v.label.toLowerCase().indexOf(needle) > -1 || v.codigo.toLowerCase().indexOf(needle) > -1)
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
.height{
  height: 450px !important;
}
</style>