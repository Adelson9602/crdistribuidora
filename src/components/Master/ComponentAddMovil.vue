<template>
  <div>
    <q-form
      @submit="addPerson"
      ref="form_movil"
      class="q-gutter-y-md"
      autocomplete="off"
    >
      <div class="row q-gutter-y-md">
        <div class="col-xs-12 col-sm-6 q-px-sm">
          <q-input
            v-model="movil.Mov_Descripcion"
            type="text"
            hint="Nombre móvil"
            :rules="[val => !!val || 'Nombre móvil es obligatorio']"
            @input="val => {movil.Mov_Descripcion = val.toUpperCase()}"
          />
        </div>
        <div class="col-xs-12 col-sm-6 q-px-sm">
          <q-select
            v-model="movil.Mov_Estado"
            :options="options_state"
            hint="Estado"
            :rules="[validatSelect]"
            map-options
            emit-value
          />
        </div>
      </div>
      <div class="row q-gutter-y-md">
        <div class="col-xs-12 col-sm-6 q-px-sm">
          <q-select
            v-model="person_selected"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Integrante"
            :options="options_person"
            @filter="searchUser"
            :rules="[val => !!val || 'Seleccione un integrante']"
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
        <div class="col-xs-12 col-sm-6 q-px-sm">
          <q-select
            v-model="tipo_person_selecte"
            :options="options_tipo"
            hint="Tipo vendedor"
            :rules="[validatSelect]"
            map-options
            emit-value
          />
        </div>
      </div>
      <div class="row justify-end">
        <q-btn label="Agregar integrante" type="submit" color="primary"/>
      </div>
      <q-table
        title="Integrantes de la móvil"
        :data="data_integrantes"
        :columns="columns_integrantes"
        flat
        style="height: 350px;"
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
              <q-btn
                :icon="props.row.agregado ? 'power_settings_new' : 'delete'"
                size="sm"
                :color="props.row.Estado == 1 && props.row.agregado ? 'green' : 'negative'"
                round
                dense
                @click="deltePerson(props.row)"
              />
            </q-td>
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{col.value}}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="row justify-end" v-if="data_integrantes.length > 0">
        <q-btn icon="save" label="Guardar" @click="onSubmit" color="green"/>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
let all_persons = []; //Contiene todos los usuarios
import dialog from 'components/Generals/ComponentDialogWarning';
export default {
  name: 'ComponentAddMovil',
  data () {
    return {
      options_state: [
        {
          label: 'ACTIVO',
          value: 1
        },
        {
          label: 'INACTIVO',
          value: 0
        },
      ],
      movil: {
        base: null,
        Mov_Id: null,
        Mov_Descripcion: null,
        Mov_Estado: null,
        Mov_User_control: null
      },
      data_integrantes: [],
      columns_integrantes: [
        {
          name: 'Nombre_persona',
          align: 'center',
          label: 'Nombres',
          field: 'Nombre_persona'
        },
        {
          name: 'Per_Num_documento',
          align: 'center',
          label: 'Documento',
          field: 'Per_Num_documento'
        },
        {
          name: 'name_estado',
          align: 'center',
          label: 'Estado',
          field: 'name_estado'
        },
      ],
      options_person: all_persons,
      person_selected: null,
      options_tipo: [
        {
          label: 'VENDEDOR PRINCIPAL',
          value: 1
        },
        {
          label: 'VENDEDOR AUXILIAR',
          value: 0
        },
      ],
      tipo_person_selecte: null,
    }
  },
  props: ["edit_data"],
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions("access", [
      "getPersons",
    ]),
    ...mapActions('master', [
      'insertMovil',
      'insertIntegranteMovil',
      'getMembersMovil'
    ]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const res_persons = await this.getPersons().then(res => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta get personal",
          //   data: res_persons
          // });
          if (res_persons.ok) {
            if (res_persons.result) {
              all_persons.length = 0;
              res_persons.data.forEach(persona => {
                if(persona.Per_Estado == 1){
                  all_persons.push({
                    label: persona.Per_Nombre,
                    value: persona.Per_Num_documento,
                  });
                }
              });
            } else {
              this.$q.notify({
                message: 'Sin resultado',
                type: "warning"
              });
            }
          } else {
            throw new Error(res_persons.message);
          }

          if(this.edit_data){
            this.movil = this.edit_data;
            const res_integrantes = await this.getMembersMovil(this.edit_data.Mov_Id).then( res =>{
              return res.data;
            });
            // console.log({
            //   msg: 'Respuesta integrantes de la movil',
            //   data: res_integrantes
            // });
            if (res_integrantes.ok) {
              if (res_integrantes.result) {
                this.data_integrantes.length = 0;
                res_integrantes.data.forEach(persona => {
                  let persona_added = all_persons.find( user => user.value == persona.Per_Num_documento )
                  persona.base = process.env.__BASE__;
                  persona.Nombre_persona = persona_added.label;
                  persona.agregado = true;
                  persona.name_estado = persona.Estado == 1 ? 'ACTIVO' : 'INACTIVO';
                  this.data_integrantes.push(persona)
                });
              } else {
                this.$q.notify({
                  message: 'Sin resultado',
                  type: "warning"
                });
              }
            } else {
              throw new Error(res_integrantes.message);
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
            type: "negative"
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    onSubmit(){
      this.$q.loading.show({
        message: "Guardando, por favor espere..."
      });
      setTimeout(async () => {
        try {
          this.movil.Mov_User_control = this.data_user.Per_Num_documento;
          this.movil.base = process.env.__BASE__;
          const res_mov = await this.insertMovil(this.movil).then(res => {
            return res.data;
          });
          // console.log({
          //   msg: "Respuesta insert update movil",
          //   data: res_mov
          // });
          if (res_mov.ok) {
            let promesas = [];
            this.data_integrantes.forEach( pesona => {
              pesona.Mov_Id = res_mov.data.insertId;
              promesas.push(this.insertIntegranteMovil(pesona).then( res => {
                return res.data
              }))
            });
            Promise.all(promesas).then( res => {
              console.log(res)
              this.$emit('reload');
              this.$q.notify({
                message: 'Guardado',
                type: 'positive'
              })
            })
          } else {
            throw new Error(res_mov.message);
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
    addPerson(){
      let add_integrante = {
        base: process.env.__BASE__,
        Movp_Id: null, //Auto incrementable
        Mov_Id: null,
        Nombre_persona: this.person_selected.label,
        Per_Num_documento: this.person_selected.value,
        integrante_ppl: this.tipo_person_selecte, // 0 Si es auxiliar, 1 si es el principal
        Estado: 1,
        name_estado: 'SIN ASOCIAR',
        agregado: false, //Asignamos el valor en falso porque aun no esta asociado a la movil
        Movp_User_control: this.data_user.Per_Num_documento,
      }
      let person_added = this.data_integrantes.find( person => person.Per_Num_documento == this.person_selected.value)
      if(person_added){
        this.$q.notify({
          message: 'Esta persona ya esta agregada',
          type: 'warning'
        })
      } else {
        this.data_integrantes.push(add_integrante);
        this.onReset();
      }
    },
    // Borra productos de la tabla productos a vender
    deltePerson(row){
      console.log(row)
      this.$q.dialog({
        component: dialog,
        parent: this,
        title: `${row.agregado && row.Estado == 1 ? 'Inactivar integrante' : row.agregado && row.Estado == 0 ? 'Activar integrante' :'Eliminar persona'}`,
        msg: `Este usuario ya está ${row.agregado ? 'asociado a la móvil' : 'agregado a la tabla' }, vas a ${row.agregado && row.Estado == 1 ? 'inactivar' : row.agregado && row.Estado == 0 ? 'activar' : 'eliminar'} un integrante agregado a la ${row.agregado ? 'móvil' : 'tabla'}, ¿Seguro que desea continuar?`,
      }).onOk( async () => {
        if(this.edit_data){
          this.$q.loading.show({
            message: 'Actualizando estado del integrante, por favor espere...'
          })
          setTimeout(async() => {
            try {
              row.Estado = row.Estado == 1 ? 0 : 1;
              const res_update = await this.insertIntegranteMovil(row).then( res => {
                return res.data
              });
              // console.log({
              //   res: 'Respuesta update estado integrante',
              //   data: res_update
              // })
              if(res_update.ok){
                this.$q.notify({
                  message: 'Estado actualizado',
                  type: 'positive'
                })
                setTimeout(this.getData, 500);
              } else {
                throw new Error(res_update.message)
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
          }, 1000)
        } else {
          let index = this.data_integrantes.indexOf(row)
          this.data_integrantes.splice(index, 1)
        }
      })
    },
    // Buscador
    searchUser(val, update, abort){
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              this.options_person = all_persons
            }
            else {
              const needle = val.toLowerCase()
              this.options_person = all_persons.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
            }
          },

          // next function is available in Quasar v1.7.4+;
          // "ref" is the Vue reference to the QSelect
          ref => {
            if (val !== '' && ref.options.length > 0) {
              ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
            }
          }
        )
      }, 300)

    },
    onReset(){
      this.person_selected = null;
      this.tipo_person_selecte = null;
      setTimeout(() => {
        this.$refs.form_movil.resetValidation();
      }, 300)
    },
    validatSelect(val){
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if(!val && val != 0){
            resolve(!!val || 'Seleccione una opción')
          }
          resolve(true);
        }, 500)
      })
    }
  }
}
</script>
