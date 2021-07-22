<template>
  <div>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <div class="row q-gutter-y-md">
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="text"
            hint="Nombre"
            :rules="[val => !!val || 'Nombre es requerido']"
            maxlength="50"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="text"
            hint="Descripción"
            maxlength="100"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-select
            v-model="model"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Categoría"
            :options="options_categorias"
            @filter="filterFn"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-select
            v-model="model"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            hint="Unidad de medida"
            :options="options_categorias"
            @filter="filterFn"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="text"
            hint="Stock mínimo"
            :rules="[val => !!val || 'Stock mínimo es requerido']"
            mask="###########"
            maxlength="11"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="% Cliente AAA Tienda"
            :rules="[val => !!val || '% Cliente AAA Tienda es requerido']"
            maxlength="100"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="% Cliente AAA Ferreteria"
            :rules="[val => !!val || '% Cliente AAA Ferreteria es requerido']"
            maxlength="100"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="% Cliente F Mostrador"
            :rules="[val => !!val || '% Cliente F Mostrador es requerido']"
            maxlength="100"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="% Cliente A Vecinos Por Mayor"
            :rules="[val => !!val || '% Cliente A Vecinos Por Mayor es requerido']"
            maxlength="100"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="% Cliente AA Ferreteria Poblaciones"
            :rules="[val => !!val || '% Cliente AA Ferreteria Poblaciones es requerido']"
            maxlength="100"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="% Cliente F Vecinos Detal"
            :rules="[val => !!val || '% Cliente F Vecinos Detal es requerido']"
            maxlength="100"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-file
            v-model="text"
            hint="Imagen articulo"
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Codigo de barras"
            :rules="[val => !!val || 'Codigo de barras es requerido']"
            maxlength="100"
            counter
          >
            <template v-slot:append>
              <q-btn round dense flat icon="qr_code_scanner">
                <q-tooltip>
                  Generar código de barras
                </q-tooltip>
              </q-btn>
              <q-btn round dense flat icon="print">
                <q-tooltip>
                  Imprimir código de barras
                </q-tooltip>
              </q-btn>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row justify-end q-mt-0">
        <div class="q-gutter-x-md">
          <q-btn label="Reset" type="reset" color="red" class="q-ml-sm" />
          <q-btn label="Submit" type="submit" color="green"/>
        </div>
      </div>
    </q-form>
  </div>  
</template>

<script>
import { mapActions } from 'vuex';
let options_categorias = [];
export default {
  name: 'ComponentAddArticle',
  data () {
    return {
      text: null,
      model: null,
      options_categorias: options_categorias
    }
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions('warehouse', [
      'getCategoriasAlmacen'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo metas, por favor espere...'
      });
      setTimeout( async() => {
        try {
          const res_categorias = await this.getCategoriasAlmacen().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get metas',
            data: res_categorias
          });
          if(res_categorias.ok){
            if(res_categorias.result){
              options_categorias.length = 0;
              res_categorias.data.forEach(element => {
                if(element.Cat_Estado == 1){
                  options_categorias.push({
                    value: element.Cat_Id,
                    label: element.Cat_Nombre,
                  })
                }
              });
            } else {
              this.$q.notify({
                message: res_categorias.message,
                type: 'warning'
              });
            }
          } else {
            throw new Error(res_categorias.message);
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
    // Busca o filtra las opciones del select categorias articulo
    filterFn (val, update, abort) {
      console.log(val)
      // call abort() at any time if you can't retrieve data somehow
      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.options_categorias = options_categorias
          }
          else {
            const needle = val.toLowerCase()
            this.options_categorias = options_categorias.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
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
  }
}
</script>
