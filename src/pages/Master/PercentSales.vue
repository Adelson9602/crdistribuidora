<template>
  <q-page padding>
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
            v-model="new_article.Art_Imagen"
            hint="Imagen articulo"
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="text"
            type="text"
            hint="Codigo de barras"
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
  </q-page>
</template>

<script>
export default {
  name: 'PagePercentSales',
  data(){
    return {
      text: null,
    }
  }
}
</script>
