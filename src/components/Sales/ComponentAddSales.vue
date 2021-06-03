<template>
  <div>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <!-- Encabezado -->
      <div class="row">
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Tipo de comprobante"
            :rules="[val => !!val || 'Tipo de comprobante es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Cliente"
            :rules="[val => !!val || 'Cliente es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
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
          <q-select
            v-model="model"
            :options="options"
            hint="Forma de pago"
            :rules="[val => !!val || 'Forma de pago es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Número"
            :rules="[val => !!val || 'Número es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Impuesto"
            :rules="[val => !!val || 'Impuesto es obligatorio']"
          />
        </div>
      </div>
      <!-- Productos -->
      <div class="row">
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Producto"
            :rules="[val => !!val || 'Producto es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-input
            v-model="text"
            :options="options"
            hint="Cantidad"
            :rules="[val => !!val || 'Cantidad es obligatorio']"
          />
        </div>
        <div class="col-xs-12 col-md-3 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Precio de venta"
            :rules="[val => !!val || 'Precio de venta es obligatorio']"
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
export default {
  // name: 'ComponentName',
  data () {
    return {
      text: null,
      model: null,
      options: [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
      ]
    }
  },
  methods: {
    onSubmit(){

    },
    onReset(){

    },
  }
}
</script>
