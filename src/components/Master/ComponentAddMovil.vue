<template>
  <div>
    <q-form
      @submit="addPerson"
      ref="form_movil"
      class="q-gutter-y-md"
    >
      <div class="row q-gutter-y-md">
        <div class="col-xs-12 col-sm-6 q-px-sm">
          <q-input
            v-model="movil.Mov_Descripcion"
            type="text"
            hint="Nombre móvil"
            :rules="[val => !!val || 'Nombre móvil es obligatorio']"
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
      />
      <div class="row justify-end" v-if="data_integrantes.length > 0">
        <q-btn icon="save" label="Guardar" @click="onSubmit" color="green"/>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
let all_persons = []; //Contiene todos los usuarios
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
      'insertIntegranteMovil'
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
          console.log({
            msg: "Respuesta get personal",
            data: res_persons
          });
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
          console.log({
            msg: "Respuesta insert update movil",
            data: res_mov
          });
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
