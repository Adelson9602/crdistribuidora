<template>
  <div>
    <q-form
      @submit="addProduct"
      class="q-gutter-md"
      ref="form_entry"
      autocomplete="off"
    >
      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-select
            v-model="enc_entrada.CP_Nit"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Proveedor"
            :options="options_providers"
            @filter="filterProviders"
            :rules="[val => !!val || 'Proveedor es obligatorio']"
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
            v-model="enc_entrada.Tc_Id"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Tipo comprobante"
            :options="options_comprobantes"
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
            v-model="enc_entrada.Mp_Id"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="options_medios"
            hint="Medio de pago"
            :rules="[val => !!val || 'Medio de pago es obligatorio']"
            @filter="filterMedios"
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
        <div
          class="col-xs-12 col-sm-6 col-md-3 q-px-sm"
          v-if="enc_entrada.Mp_Id == 2"
        >
          <q-input
            v-model="enc_entrada.Enc_dias_credito"
            mask="####"
            hint="Días de crédito"
            :rules="[val => !!val || 'Días de crédito es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-input
            v-model="enc_entrada.Enc_num_comprobante"
            hint="Número comprobante"
            :rules="[val => !!val || 'Númerocompra es obligatorio']"
            @input="
              val => {
                enc_entrada.Enc_num_comprobante = val.toUpperCase();
              }
            "
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-input
            v-model="enc_entrada.Enc_subtotal_compra"
            hint="Subtotal compra"
            mask="############"
            :rules="[val => !!val || 'Subtotal compra es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-input
            v-model="enc_entrada.Enc_total_compra"
            hint="Total compra"
            mask="############"
            :rules="[val => !!val || 'Total compra es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-px-sm">
          <q-input
            v-model="enc_entrada.Enc_impuesto"
            hint="Impuesto"
            mask="######"
            :rules="[val => !!val || 'Impuesto es obligatorio']"
          />
        </div>
      </div>
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
          <q-field hint="Precio compra anterior" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                $ {{ new Intl.NumberFormat().format(precio_old) }}
              </div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 q-px-sm">
          <q-input
            v-model="precio_compra"
            mask="#########"
            hint="Precio de compra"
            :rules="[
              val => !!val || 'Precio es requerido',
              val => val > 0 || 'El precio no puede ser 0'
            ]"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 q-px-sm">
          <q-input
            v-model="cantidad_compra"
            mask="#########"
            hint="Cantidad"
            :rules="[
              val => !!val || 'Cantidad es requerido',
              val => val > 0 || 'La cantidad no puede ser 0'
            ]"
          />
        </div>
      </div>
      <div>
        <q-btn
          label="Submit"
          type="submit"
          color="primary"
          class="hide-btn_submit"
        />
      </div>
    </q-form>
    <div class="row">
      <div class="col-xs-12">
        <q-table
          title="Productos a ingresar"
          :data="data_products"
          :columns="columns_product"
          row-key="name"
          flat
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  icon="delete"
                  size="sm"
                  color="negative"
                  round
                  dense
                  @click="delteProduct(props.row)"
                />
              </q-td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
      expand
      v-if="data_products.length > 0"
    >
      <q-btn color="primary" icon="save" label="Guardar" @click="onSubmit" />
    </q-page-sticky>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import dialog from "components/Generals/ComponentDialogWarning";
let all_providers = []; //Opciones para el select proveedores
let all_comprobante = []; //Opciones para el select tipo comprobante
let all_medios = []; //Opciones para el select medios de pago
let all_product = []; //Opciones para el select productos
export default {
  name: "ComponentAddIncome",
  data() {
    return {
      options_providers: all_providers, //Opciones para el select proveedores
      options_comprobantes: all_comprobante, //Opciones para el select proveedores
      options_medios: all_medios, //Opciones para el select medios de pago
      options_products: all_product, //Opciones para el select medios de pago
      model: null,
      options: [],
      text: null,
      columns: [],
      data_products: [],
      columns_product: [
        {
          name: "Art_Id",
          label: "ID Producto",
          align: "center",
          field: "Art_Id"
        },
        {
          name: "Codigo_art",
          label: "Código artículo",
          align: "center",
          field: "Codigo_art"
        },
        {
          name: "Descripcion_art",
          label: "Descripción",
          align: "center",
          field: "Descripcion_art"
        },
        {
          name: "Dei_Cant",
          label: "Cantidad",
          align: "center",
          field: "Dei_Cant"
        },
        {
          name: "Dei_Precio_compra",
          label: "Precio compra",
          align: "center",
          field: "Dei_Precio_compra"
        }
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
      // Detalle de la entrada
      producto_selecte: null,
      precio_compra: null,
      cantidad_compra: null,
      precio_old: null
    };
  },
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
  },
  watch: {
    producto_selecte(value) {
      if (value) {
        this.precio_old = value.precio_old ? value.precio_old : 0;
      } else {
        this.precio_old = 0;
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("shopping", [
      "insertEncEntry",
      "insertDetEntry",
      "getProviders",
      "insertArtVenta"
    ]),
    ...mapActions("warehouse", ["updateInventarioMovil", "getAllArticles"]),
    ...mapActions("master", ["getTiposComprobante", "getMedioPago"]),
    async getData() {
      this.$q.loading.show({
        message: "Obteniendo datos del servidor, por favor espere..."
      });
      try {
        const res_provider = await this.getProviders().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get proveedor',
        //   data: res_provider
        // });
        if (res_provider.ok) {
          if (res_provider.result) {
            all_providers.length = 0;
            res_provider.data.forEach(element => {
              if (element.Tp_Id == 0 && element.CP_Razon_social) {
                all_providers.push({
                  label: element.CP_Razon_social,
                  value: element.CP_Nit
                });
              }
            });
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_provider.message);
        }

        const res_compro = await this.getTiposComprobante().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get tipo de comprobante',
        //   data: res_compro
        // });
        if (res_compro.ok) {
          if (res_compro.result) {
            all_comprobante.length = 0;
            res_compro.data.forEach(element => {
              if (element.Tc_Estado == 1) {
                all_comprobante.push({
                  label: element.Tc_Descripcion,
                  value: element.Tc_Id
                });
              }
            });
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_compro.message);
        }

        const res_medio = await this.getMedioPago().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get medio pago',
        //   data: res_medio
        // });
        if (res_medio.ok) {
          all_medios.length = 0;
          res_medio.data.forEach(element => {
            if (element.Mp_Estado == 1) {
              all_medios.push({
                label: element.Mp_Descripcion,
                value: element.Mp_Id
              });
            }
          });
        } else {
          throw new Error(res_medio.message);
        }

        const res_product = await this.getAllArticles().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get productos',
        //   data: res_product
        // });
        if (res_product.ok) {
          all_product.length = 0;
          res_product.data.forEach(element => {
            if (element.Art_Estado == 1) {
              all_product.push({
                label: element.Art_Nombre,
                value: element.Art_Id,
                codigo: element.Art_Codigo_inv,
                precio_old: element.Av_Precio_venta
              });
            }
          });
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
          type: "negative"
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async onSubmit() {
      this.$q.loading.show({
        message: "Guardando, por favor espere..."
      });
      try {
        this.enc_entrada.Enc_dias_credito =
          this.enc_entrada.Mp_Id == 1 ? 0 : this.enc_entrada.Enc_dias_credito;
        this.enc_entrada.Enc_Estado = this.enc_entrada.Mp_Id == 1 ? 1 : 2;
        this.enc_entrada.base = process.env.__BASE__;
        this.enc_entrada.Enc_User_control = this.data_user.Per_Num_documento;
        const res_ingreso = await this.insertEncEntry(this.enc_entrada).then(
          res => {
            return res.data;
          }
        );
        // console.log({
        //   msg: 'Respuesta insert encabezado entrada',
        //   data: res_ingreso
        // })
        if (res_ingreso.ok) {
          let insert_produc = [];
          let upd_stock = [];
          this.data_products.forEach(product => {
            product.Enc_Id = res_ingreso.data.insertId;
            let save_product = this.insertDetEntry(product)
              .then(res => {
                return res.data;
              })
              .catch(e => {
                throw new Error(e);
              });
            insert_produc.push(save_product);

            let product_venta = this.insertArtVenta(product)
              .then(res => {
                return res.data;
              })
              .catch(e => {
                throw new Error(e);
              });
            insert_produc.push(product_venta);

            let new_art = {
              base: process.env.__BASE__,
              Art_Id: product.Art_Id,
              Mov_Id: 1,
              Si_Cant: product.Dei_Cant,
              simbol: "+"
            };
            let update_stock = this.updateInventarioMovil(new_art)
              .then(res => {
                return res.data;
              })
              .catch(e => {
                throw new Error(e);
              });
            upd_stock.push(update_stock);
          });
          Promise.all(insert_produc).then(res_insert => {
            // console.log({
            //   message: 'Respuesta insert detalle entrada',
            //   data: res_insert
            // })
            res_insert.forEach(res => {
              if (!res.ok) {
                throw new Error(res.message);
              }
            });
          });
          Promise.all(upd_stock).then(res_insert => {
            // console.log({
            //   message: 'Respuesta update stock',
            //   data: res_insert
            // })
            res_insert.forEach(res => {
              if (!res.ok) {
                throw new Error(res.message);
              }
            });
          });
          this.$q.notify({
            message: "Guardado",
            type: "positive"
          });
          this.$emit("reload");
        } else {
          throw new Error(res_ingreso.message);
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
          type: "negative"
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    addProduct() {
      let product_add = {
        base: process.env.__BASE__,
        Enc_Id: null,
        Art_Id: this.producto_selecte.value,
        Codigo_art: this.producto_selecte.codigo,
        Descripcion_art: this.producto_selecte.label,
        Dei_Cant: this.cantidad_compra,
        Dei_Precio_compra: this.precio_compra,
        Av_Precio_venta: this.precio_compra,
        Av_Estado: 1,
        Av_User_control: this.data_user.Per_Num_documento
      };
      let exits_product = this.data_products.find(
        product => product.Art_Id == product_add.Art_Id
      );
      if (exits_product) {
        this.$q.notify({
          message: "El producto ya esta agregado",
          type: "warning"
        });
      } else {
        this.precio_compra = Number(this.precio_compra);
        if (this.precio_old != this.precio_compra && this.precio_old != 0) {
          this.$q
            .dialog({
              component: dialog,
              parent: this,
              title: "Diferencia de precios",
              msg: `Atención! Hemos encontrado diferencia de precios en el producto a ingresar, este es el precio anterior ${new Intl.NumberFormat().format(
                this.precio_old
              )}, precio nuevo ${new Intl.NumberFormat().format(
                this.precio_compra
              )}, ¿Desea reemplazar el precio anterior?`
            })
            .onOk(() => {
              product_add.Dei_Precio_compra = this.precio_compra;
              this.data_products.push(product_add);
              this.onReset();
            })
            .onCancel(() => {
              product_add.Dei_Precio_compra = this.producto_selecte.precio_old;
              this.data_products.push(product_add);
              this.onReset();
            });
        } else {
          this.data_products.push(product_add);
          this.onReset();
        }
      }
    },
    delteProduct(row) {
      this.$q
        .dialog({
          component: dialog,
          parent: this,
          title: "Eliminar producto",
          msg:
            "Atención! vas a eliminar un producto agregado a la tabla, ¿Seguro que desea continuar?"
        })
        .onOk(() => {
          let index = this.data_products.indexOf(row);
          this.data_products.splice(index, 1);
        });
    },
    onReset() {
      this.producto_selecte = null;
      this.precio_compra = null;
      this.cantidad_compra = null;
      setTimeout(() => {
        this.$refs.form_entry.resetValidation();
        // this.$refs.select_products.focus();
      }, 300);
    },
    // Buscador para el select proveedor
    filterProviders(val, update, abort) {
      setTimeout(() => {
        update(
          () => {
            const needle = val.toLowerCase();
            this.options_providers = all_providers.filter(
              v =>
                v.label.toLowerCase().indexOf(needle) > -1 ||
                v.value
                  .toString()
                  .toLowerCase()
                  .indexOf(needle) > -1
            );
          },
          ref => {
            if (val !== "" && ref.options.length > 0) {
              ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
            }
          }
        );
      }, 300);
    },
    // Buscador para el select comprobante
    filterComprobante(val, update, abort) {
      setTimeout(() => {
        update(
          () => {
            const needle = val.toLowerCase();
            this.options_comprobantes = all_comprobante.filter(
              v =>
                v.label.toLowerCase().indexOf(needle) > -1 ||
                v.value
                  .toString()
                  .toLowerCase()
                  .indexOf(needle) > -1
            );
          },
          ref => {
            if (val !== "" && ref.options.length > 0) {
              ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
            }
          }
        );
      }, 300);
    },
    // Buscador para el select medio de pago
    filterMedios(val, update, abort) {
      setTimeout(() => {
        update(
          () => {
            if (val === "") {
              this.options_medios = all_medios;
            } else {
              const needle = val.toLowerCase();
              this.options_medios = all_medios.filter(
                v =>
                  v.label.toLowerCase().indexOf(needle) > -1 ||
                  v.value
                    .toString()
                    .toLowerCase()
                    .indexOf(needle) > -1
              );
            }
          },
          ref => {
            if (val !== "" && ref.options.length > 0) {
              ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
            }
          }
        );
      }, 300);
    },
    // Buscador para el select medio de pago
    filterProducts(val, update, abort) {
      setTimeout(() => {
        update(
          () => {
            if (val === "") {
              this.options_products = all_product;
            } else {
              const needle = val.toLowerCase();
              this.options_products = all_product.filter(
                v =>
                  v.label.toLowerCase().indexOf(needle) > -1 ||
                  v.codigo
                    .toString()
                    .toLowerCase()
                    .indexOf(needle) > -1
              );
            }
          },
          ref => {
            if (val !== "" && ref.options.length > 0) {
              ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
            }
          }
        );
      }, 300);
    }
  }
};
</script>
