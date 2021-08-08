<template>
  <div>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <div class="row">
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Razon social"
            :rules="[val => !!val || 'Razon social es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Nombre"
            :rules="[val => !!val || 'Nombre es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Tipo documento"
            :rules="[val => !!val || 'Tipo documento es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Número documento"
            :rules="[val => !!val || 'Número documento es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Dirección"
            :rules="[val => !!val || 'Dirección es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Teléfono"
            :rules="[val => !!val || 'Teléfono es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Email"
            :rules="[val => !!val || 'Email es obligatorio']"
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
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Ciudad"
            :rules="[val => !!val || 'Ciudad es obligatorio']"
          />
        </div>
      </div>
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
let departamentos = []; //Contiene todos los departamentos
export default {
  name: 'ComponentAddProvider',
  data () {
    return {
      options_departamento: departamentos,
      model: null,
      options: [],
      text: null,
      departamento_selecte: null,
      proveedor: {
        base: null,
        Dcp_Id: null,
        Dcp_Contacto: null,
        Dcp_Telefono: null,
        Dcp_Estado: null,
        Ciu_Id: null,
        CP_Nit: null,
        Dcp_User_control: null
      }
    }
  },
  created() {
    this.getData();
  },
  methods:{
    ...mapActions('master', [
      'getCities'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo datos del servidor, por favor espere...'
      });
      setTimeout(async()=> {
        try {
          const res_ciudade = await this.getCities().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get ciudades',
            data: res_ciudade
          });
          if(res_ciudade.ok){
            if(res_ciudade.result){
              //Creamos un nuevo objeto donde vamos a almacenar por ciudades. 
              let nuevoObjeto = {}
              //Recorremos el arreglo 
              res_ciudade.data.forEach( x => {
                //Si la ciudad no existe en nuevoObjeto entonces
                //la creamos e inicializamos el arreglo de profesionales. 
                if( !nuevoObjeto.hasOwnProperty(x.Dep_Id)){
                  nuevoObjeto[x.Dep_Id] = {
                    label: x.Dep_Descripcion,
                    value: x.Dep_Id,
                    ciudades: []
                  }
                }
                
                //Agregamos los datos de ciudades. 
                if(x.Ciu_Estado == 1){
                  nuevoObjeto[x.Dep_Id].ciudades.push({
                    label: x.Ciu_Nombre,
                    value: x.Ciu_Id,
                  })
                }
              })
              departamentos.length = 0;
              for (const key in nuevoObjeto) {
                departamentos.push(
                  nuevoObjeto[key]
                )
              }
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_ciudade.message);
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
    onReset(){

    },
    // Buscador para el select departamento
    filterDepartamento(val, update, abort){
      setTimeout(() => {
        update(() => {
            const needle = val.toLowerCase()
            this.options_departamento = departamentos.filter(v => v.label.toLowerCase().indexOf(needle) > -1 || v.value.toString().toLowerCase().indexOf(needle) > -1)
          },
          ref => {
            if (val !== '' && ref.options.length > 0) {
              ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
            }
          }
        )
      }, 300)
    }
  }
}
</script>
