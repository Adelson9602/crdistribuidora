<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <q-card-section class="q-gutter-y-md">
        <div class="row q-gutter-y-md">
          <div class="col-xs-12 col-sm-6 col-md-4 q-px-md">
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
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-btn>
                </div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 q-px-md">
            <q-select
              v-model="seller_selecte"
              clearable
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              hint="Vendedor"
              :options="options_seller"
              @filter="filterSeller"
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
        </div>
        <div class="row">
          <div class="q-pa-md col-xs-12 col-sm-6 col-md-4">
            <q-card class="my-card">
              <q-card-section>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Procentaje</q-item-label>
                      <q-item-label class="number_card">{{comision.percent_commission}}</q-item-label>
                      <q-item-label>
                        <q-icon
                          name="info"
                          color="positive"
                        /> Comisión
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-avatar
                        size="60px"
                        class="bg-primary-gradient"
                        text-color="white"
                        icon="trending_up"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
          <div class="q-pa-md col-xs-12 col-sm-6 col-md-4">
            <q-card class="my-card">
              <q-card-section>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Comisión</q-item-label>
                      <q-item-label class="number_card">{{comision.commission}}</q-item-label>
                      <q-item-label>
                        <q-icon
                          name="info"
                          color="positive"
                        /> Alcanzado
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-avatar
                        size="60px"
                        class="bg-danger-gradient"
                        text-color="white"
                        icon="mdi-rocket-launch"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
          <div class="q-pa-md col-xs-12 col-sm-6 col-md-4">
            <q-card class="my-card">
              <q-card-section>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Total ventas</q-item-label>
                      <q-item-label class="number_card">{{comision.total_sales}}</q-item-label>
                      <q-item-label>
                        <q-icon
                          name="info"
                          color="positive"
                        /> Facturadas
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-avatar
                        size="60px"
                        class="bg-secondary-gradient"
                        text-color="white"
                        icon="attach_money"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
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
      options: ["Option 1", "Option 2", "Option 3"],
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
      comision: {
        commission: 0,
        total_sales: 0,
        percent_commission: 0,
      }
    };
  },
  created(){
    this.getData();
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
        } else {
          let tem_date = this.date_range;
          this.date_range = {
            to: tem_date,
            from: tem_date
          };
        }
        this.$q.loading.show({
          message: 'Obteniendo datos, por favor espere....'
        })
        setTimeout(async() => {
          try {
            this.date_range.Per_Num_documento = value;
            const res_data = await this.getCommissionSeller(this.date_range).then( res => {
              return res.data;
            });
            console.log({
              msg: 'Repuesta comision vendedor',
              data: res_data
            })
            if(res_data.ok){
              if(res_data.result){
                this.comision = {
                  commission: res_data.data.comision,
                  total_sales: res_data.data.vt,
                  percent_commission: res_data.data.pc,
                }
              } else {
                this.$q.notify({
                  message: 'Sin resultados',
                  type: 'warning'
                });
              }
            } else {
              throw new Error(res_data.message)
            }
            const res_deta = await this.getCommissionSellerDet(this.date_range).then( res => {
              return res.data;
            });
            console.log({
              msg: 'Repuesta detalle comision vendedor',
              data: res_data
            })
            if(res_data.ok){
              if(res_data.result){
                
              } else {
                this.$q.notify({
                  message: 'Sin resultados',
                  type: 'warning'
                });
              }
            } else {
              throw new Error(res_data.message)
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
    // Buscador del select vendedor
    filterSeller(val, update, abort){
      // call abort() at any time if you can't retrieve data somehow
      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.options_seller = all_seller
          }
          else {
            const needle = val.toLowerCase()
            this.options_seller = all_seller.filter(v => v.label.toLowerCase().indexOf(needle) > -1 || v.value.toString().toLowerCase().indexOf(needle) > -1)
          }
        },
        ref => {
          if (val !== '' && ref.options.length > 0) {
            ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
            ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
          }
        })
      }, 300)
    }
  },
};
</script>
<style scoped>
.my-card{
  border-radius: 10px;
  height: 120px;
}
.number_card{
  font-weight: 600 !important;
  font-size: 1.5rem;
}
.bg-primary-gradient {
  background: linear-gradient(to bottom right, #9e88f5 0%, #6259ca 100%) !important;
}
.bg-danger-gradient {
  background-image: linear-gradient(to bottom right, #f1bf64 0%, #f71d36 100%) !important;
}
.bg-secondary-gradient {
  background: linear-gradient(to bottom right, #9070ff 0%, #ff5d9e 100%) !important;
}
.bg-success-gradient {
  background: linear-gradient(to bottom right, #4be8d4 0%, #129bd2 100%) !important;
}
</style>