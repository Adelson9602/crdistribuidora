<template>
  <div>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <div class="row">
        <div class="col-xs-12 col-md-4 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Tipo de traslado"
            :rules="[validateSelect]"
          />
        </div>
        <div class="col-xs-12 col-md-4 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Origen"
            :rules="[validateSelect]"
          />
        </div>
        <div class="col-xs-12 col-md-4 q-px-sm">
          <q-select
            v-model="model"
            :options="options"
            hint="Destino"
            :rules="[validateSelect]"
          />
        </div>
      </div>
      <!-- btn subtmit para el formulario -->
      <div>
        <q-btn label="Submit" type="submit" color="primary" class="hide-btn_submit"/>
      </div>
    </q-form>
    <div class="row">
      <div class="col-xs-12">
        <q-table
          title="Productos a trasladar"
          :data="data"
          :columns="columns"
          row-key="name"
          flat
          class="height-table"
        >
          <template v-slot:header-cell-calories="props">
            <q-th :props="props">
              <q-icon name="thumb_up" size="1.5em" />
              {{ props.col.label }}
            </q-th>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {
      model: null,
      options: [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
        'Option 5',
      ],
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      data: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: '8%',
          iron: '1%'
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: '6%',
          iron: '7%'
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: '3%',
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: '7%',
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: '0%',
          iron: '0%'
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: '0%',
          iron: '2%'
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: '0%',
          iron: '45%'
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: '2%',
          iron: '22%'
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: '12%',
          iron: '6%'
        }
      ]
    }
  },
  methods: {
    onSubmit(){

    },
    onReset(){

    },
    // Valida si el select tiene alguna opción
    validateSelect(val) {
      if (val === null) {
        return "Campo obligatorio, debe seleccionar una opción";
      }
    },
  }
}
</script>
