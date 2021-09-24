<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <q-card-section class="q-gutter-y-lg">
        <div class="row">
          <div class="col-xs-12 col-md-3 q-px-sm">
            <q-field
              stack-label
              class="date_training"
              hint="Seleccione un rango de fecha"
            >
              <template v-slot:control>
                <div
                  class="self-center full-width no-outline row justify-between"
                  tabindex="0"
                >
                  <label class="self-center">
                    Desde {{ date_range.from }} Hasta {{ date_range.to }}
                  </label>
                  <q-btn
                    icon="event"
                    round
                    color="primary"
                    class="self-end"
                    size="xs"
                  >
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="date_range" range mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn
                            label="Borrar"
                            color="primary"
                            flat
                            @click="date_range = { to: '', from: '' }"
                          />
                          <q-btn
                            v-close-popup
                            label="Ok"
                            color="primary"
                            flat
                            @click="date_range"
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-btn>
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-md-3 q-px-sm">
            <q-select
              v-model="seller_selecte"
              :options="options_seller"
              hint="Origen"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-3 q-px-sm">
            <q-card class="my-card">
              <q-card-section>
                <q-item>
                  <q-item-section top avatar>
                    <q-avatar color="primary" text-color="white" icon="sell" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h6">Ventas</q-item-label>
                    <q-item-label caption lines="2">total</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>
              <q-card-section>
                <div class="text-h5">$18.559.000</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-md-3 q-px-sm">
            <q-card class="my-card">
              <q-card-section>
                <q-item>
                  <q-item-section top avatar>
                    <q-avatar color="primary" text-color="white" icon="shopping_cart" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h6">Compras</q-item-label>
                    <q-item-label caption lines="2">total</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>
              <q-card-section>
                <div class="text-h5">$18.559.000</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-md-3 q-px-sm">
            <q-card class="my-card">
              <q-card-section>
                <q-item>
                  <q-item-section top avatar>
                    <q-icon color="green" text-color="white" name="paid" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h6">Utilidad</q-item-label>
                    <q-item-label caption lines="2">total</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>
              <q-card-section>
                <div class="text-h5">$532.000</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- Tabla de las ventas realizadas -->
        <q-table
          class="q-mt-md height-table"
          title="Ventas realizadas"
          :data="data"
          :columns="columns"
          row-key="name"
          flat
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex';
let all_seller = []; //Contiene todos los vendedores
export default {
  name: "ConsultSeller",
  data() {
    return {
      seller_selecte: null,
      options_seller: all_seller,
      date_range: {
        to: null,
        from: null,
      },
      columns: [
        {
          name: "name",
          required: true,
          label: "Dessert (100g serving)",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "calories",
          align: "center",
          label: "Calories",
          field: "calories",
          sortable: true,
        },
        { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
        {
          name: "carbs",
          label: "Carbs (g)",
          field: "carbs",
        },
        {
          name: "protein",
          label: "Protein (g)",
          field: "protein",
        },
        {
          name: "sodium",
          label: "Sodium (mg)",
          field: "sodium",
        },
        {
          name: "calcium",
          label: "Calcium (%)",
          field: "calcium",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "iron",
          label: "Iron (%)",
          field: "iron",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      data: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: "14%",
          iron: "1%",
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: "8%",
          iron: "1%",
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: "6%",
          iron: "7%",
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: "3%",
          iron: "8%",
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: "7%",
          iron: "16%",
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: "0%",
          iron: "0%",
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: "0%",
          iron: "2%",
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: "0%",
          iron: "45%",
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: "2%",
          iron: "22%",
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: "12%",
          iron: "6%",
        },
      ],
    };
  },
  watch: {
    seller_selecte(value){
      if(value){
        if(typeof(this.date_range) == 'object' && !this.date_range.to){
          this.$q.notify({
            message: 'Seleccione un rango de fecha',
            type: 'warning'
          });
          return;
        }
        this.$q.loading.show({
          message: 'Obteniendo datos, por favor espere....'
        })
        this.render_table = false;
        setTimeout(async() => {
          try {
            let params = {
              Per_Num_documento: value,
              to: null,
              from: null
            }
            params.from = typeof(this.date_range) == 'object' ? this.date_range.from : this.date_range;
            params.to = typeof(this.date_range) == 'object' ? this.date_range.to : this.date_range;
            
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
        }, 1000)
      }
    }
  },
  methods: {
    ...mapActions('access', [
      'getPersons',
    ]),
    ...mapActions('movements', [
      'getCommissionSeller',
      'getCommissionSellerDet'
    ]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos del servidor, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const res_persons = await this.getPersons().then(res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get personal',
            data: res_persons
          });
          if(res_persons.ok){
            if(res_persons.result){
              all_seller.length = 0;
              res_persons.data.forEach( persona => {
                if(persona.Usu_Estado == 1){
                  all_seller.push({
                    label: persona.Per_Nombre,
                    value: persona.Per_Num_documento
                  })
                }
              });
            } else {
              this.$q.notify({
                message: res_persons.message,
                type: 'warning'
              })
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
            type: "negative",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 1000);
    },
  },
};
</script>
