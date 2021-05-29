<template>
  <div>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <div class="row">
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select v-model="model" :options="options" hint="Proveedor" />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select v-model="model" :options="options" hint="Tipo comprobante" />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select v-model="model" :options="options" hint="medio de pago" />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input v-model="text" type="text" hint="Número compra" />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input v-model="text" type="text" hint="Inpuesta" />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-field hint="Rounded filled" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0"></div>
            </template>
          </q-field>
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
export default {
  // name: 'ComponentName',
  data () {
    return {
      model: null,
      options: [],
      text: null
    }
  },
  methods:{
    onSubmit(){

    },
    onReset(){

    },
  }
}
</script>
