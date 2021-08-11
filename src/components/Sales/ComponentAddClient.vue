<template>
  <div>
    <q-form @submit="onSubmit">
      <div class="row">
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="new_cliente.CP_Razon_social"
            type="text"
            hint="Nombre cliente"
            :rules="[val => !!val || 'Nombre cliente es obligatorio']"
          />
        </div>

        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="new_cliente.Td_Id"
            :options="options_documento"
            hint="Tipo documento"
            :rules="[val => !!val || 'Tipo documento es obligatorio']"
         emit-value
         map-options
          />
         
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="new_cliente.CP_Nit"
            type="text"
            hint="Número documento"
            mask="###########"
            :rules="[val => !!val || 'Número documento es obligatorio']"
            :disable="this.edit_data ? true : false"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="new_cliente.CP_Digito_verificacion"
            type="text"
            hint="Digito verificacion"
            mask="##"
            :rules="[val => !!val || 'Digito verificacion es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="new_cliente.CP_Direccion"
            type="text"
            hint="Dirección"
            maxlength="500"
            counter
           
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="new_cliente.CP_Telefono"
            type="text"
            hint="Teléfono"
            mask="##########"
            :rules="[val => !!val || 'Teléfono es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="new_cliente.CP_Email"
            type="email"
            hint="Email"
           
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="departamento_selecte"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="options_departamento"
            hint="Departamento"
            :rules="[val => !!val || 'Departamento es obligatorio']"
            @filter="filterDepartamento"
           
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
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="new_cliente.Ciu_Id"
            :options="options_ciudades"
            hint="Ciudad"
            :rules="[val => !!val || 'Ciudad es obligatorio']"
             emit-value
             map-options
          />
         
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="new_cliente.CP_Urlweb"
            type="text"
            hint="Pagina web"
            maxlength="100"
            counter
          />
        </div>
      </div>
      <div class="row justify-end">
        <q-btn label="Guardar" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
let departamentos = []; //Contiene todos los departamentos
let ciudades = [];

export default {
  name: "ComponentAddClient",
  data() {
    return {
      options_departamento: departamentos,
      model: null,
      options_ciudades: ciudades,
      options_documento: [],
      departamento_selecte: null,
      new_cliente: {
        base: null,
        Dcp_Id: null,
        Dcp_Contacto: null,
        Dcp_Telefono: null,
        Dcp_Estado: null,
        Ciu_Id: null,
        CP_Nit: null,
        CP_Razon_social: null,
        CP_Digito_verificacion: null,
        Td_Id: null,
        Tp_Id: 1,
        CP_Direccion: null,
        CP_Email: null,
        CP_Urlweb: null,
        CP_Telefono: null,
        Ciu_Id: null,
        CP_Estado: null,
        CP_User_control: null
      }
    };
  },
  props: ["edit_data"],
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
  },
  watch: {
    departamento_selecte(value) {
      if (value) {
        ciudades.length = 0;
        this.new_cliente.Ciu_Id = null;
        value.ciudades.forEach(ciudad => {
          ciudades.push(ciudad);
        });
     
      }
    },

  },

  created() {
    this.getData();
  },
  methods: {
    ...mapActions("master", ["getCities"]),
    ...mapActions("shopping", ["getTpDoc", "addProviders"]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos del servidor, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const res_ciudade = await this.getCities().then(res => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get ciudades",
          //   data: res_ciudade
          // });
          if (res_ciudade.ok) {
            if (res_ciudade.result) {
              //Creamos un nuevo objeto donde vamos a almacenar por ciudades.
              let nuevoObjeto = {};
              //Recorremos el arreglo
              res_ciudade.data.forEach(x => {
                //Si la ciudad no existe en nuevoObjeto entonces
                //la creamos e inicializamos el arreglo de profesionales.
                if (!nuevoObjeto.hasOwnProperty(x.Dep_Id)) {
                  nuevoObjeto[x.Dep_Id] = {
                    label: x.Dep_Descripcion,
                    value: x.Dep_Id,
                    ciudades: []
                  };
                }

                //Agregamos los datos de ciudades.
                if (x.Ciu_Estado == 1) {
                  nuevoObjeto[x.Dep_Id].ciudades.push({
                    label: x.Ciu_Nombre,
                    value: x.Ciu_Id
                  });
                }
              });
              departamentos.length = 0;
              for (const key in nuevoObjeto) {
                departamentos.push(nuevoObjeto[key]);
              }
            } else {
              this.$q.notify({
                message: "Sin resultados",
                type: "warning"
              });
            }
          } else {
            throw new Error(res_ciudade.message);
          }

          // Obtenemos los tipos de documento
          const res_tpdoc = await this.getTpDoc().then(res => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get tipos documentos",
          //   data: res_tpdoc
          // });
          if (res_tpdoc.ok) {
            if (res_tpdoc.result) {
              this.options_documento.length = 0;
              res_tpdoc.data.forEach(element => {
                if (element.Td_Estado == 1) {
                  this.options_documento.push({
                    value: element.Td_Id,
                    label: element.Tp_Desc_corta
                  });
                }
              });
            } else {
              this.$q.notify({
                message: res_tpdoc.message,
                type: "warning"
              });
            }
          } else {
            throw new Error(res_tpdoc.message);
          }

          if (this.edit_data) {
            // Buscamos la categoria del producto asignada
            // let categoria = options_categorias.find( categoria => categoria.label.toLowerCase() == this.edit_data.Cat_Nombre.toLowerCase());
            // Buscamos la unidad de medida asiganada
            // let um = options_um.find( um => um.prefijo.toLowerCase() == this.edit_data.Prefijo.toLowerCase())
            this.new_cliente = {
              base: null,
              Dcp_Id: null,
              Dcp_Contacto: null,
              Dcp_Telefono: null,
              Dcp_Estado: null,
              CP_Nit: this.edit_data.CP_Nit,
              CP_Razon_social: this.edit_data.CP_Razon_social,
              CP_Digito_verificacion: this.edit_data.CP_Digito_verificacion,
              Td_Id: this.edit_data.Td_Id,
              Tp_Id: 1,
              CP_Direccion: this.edit_data.CP_Direccion,
              CP_Email: this.edit_data.CP_Email,
              CP_Urlweb: this.edit_data.CP_Urlweb,
              CP_Telefono: this.edit_data.CP_Telefono,
              Ciu_Id: this.edit_data.Ciu_Id,
              CP_Estado: this.edit_data.CP_Estado,
              CP_User_control: this.data_user.Per_Num_documento
            };
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
      }, 2000);
    },
    onSubmit() {
      this.$q.loading.show({
        message: "Agregando Proveedor, por favor espere..."
      });
      setTimeout(async () => {
        try {
          this.new_cliente.base = process.env.__BASE__;
          this.new_cliente.CP_User_control = this.data_user.Per_Num_documento;
          this.new_cliente.CP_Estado = 1;

          const res_add = await this.addProviders(this.new_cliente).then(
            res => {
              return res.data;
            }
          );
          // console.log({
          //   msg: "Respuesta insert update proveedores",
          //   data: res_add
          // });
          if (res_add.ok) {
            this.$q.notify({
              message: "Guardado",
              type: "positive"
            });
            this.$emit("reload");
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
      }, 2000);
    },
    onReset() {
      (this.departamento_selecte = null),
        (this.new_cliente = {
          base: null,
          Dcp_Id: null,
          Dcp_Contacto: null,
          Dcp_Telefono: null,
          Dcp_Estado: null,
          Ciu_Id: null,
          CP_Nit: null,
          CP_Razon_social: null,
          CP_Digito_verificacion: null,
          Td_Id: null,
          Tp_Id: 1,
          CP_Direccion: null,
          CP_Email: null,
          CP_Urlweb: null,
          CP_Telefono: null,
          Ciu_Id: null,
          CP_Estado: null,
          CP_User_control: null
        });
    },
    // Buscador para el select departamento
    filterDepartamento(val, update, abort) {
      setTimeout(() => {
        update(
          () => {
            const needle = val.toLowerCase();
            this.options_departamento = departamentos.filter(
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
    }
  }
};
</script>
