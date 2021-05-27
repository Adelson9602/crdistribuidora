<template>
  <div>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <div class="row">
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input v-model="text" hint="Nombre"/>
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input v-model="text" hint="Descripción"/>
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-select v-model="model" :options="options" hint="Categoría" />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input v-model="text" hint="Stock mínimo"/>
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input v-model="text" type="text" hint="% Cliente AAA Tienda" />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input v-model="text" type="text" hint="% Cliente AAA Ferreteria" />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input v-model="text" type="text" hint="% Cliente F Mostrador" />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input v-model="text" type="text" hint="% Cliente A Vecinos Por Mayor" />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input v-model="text" type="text" hint="% Cliente AA Ferreteria Poblaciones" />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input v-model="text" type="text" hint="% Cliente F Vecinos Detal" />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-file v-model="model" hint="Imagen articulo" />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input v-model="text" type="text" hint="Codigo de barras">
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
      <div class="row justify-end">
        <div class="q-gutter-x-md">
          <q-btn label="Reset" type="reset" color="red" class="q-ml-sm" />
          <q-btn label="Submit" type="submit" color="green"/>
        </div>
      </div>
    </q-form>
  </div>  
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {
      text: null,
      model: null,
      options: [
        'option 1',
        'option 2',
        'option 3',
        'option 4',
        'option 5',
      ]
    }
  },
  methods: {
    onSubmit(){

    },
    onReset(){

    }
  }
}
</script>
