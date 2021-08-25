<template>
  <div class="q-pa-md" id="chart">
    <!-- CARDS -->
    <div class="row q-pt-sm content-card">
      <div class="q-pa-md col-xs-12 col-sm-6 col-md-3">
        <q-card class="my-card">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Total Sales</q-item-label>
                  <q-item-label class="number_card">34,251</q-item-label>
                  <q-item-label>
                    <q-icon
                      name="info"
                      color="positive"
                    /> Last Month
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
      <div class="q-pa-md col-xs-12 col-sm-6 col-md-3">
        <q-card class="my-card">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Total Leads</q-item-label>
                  <q-item-label class="number_card">35,588</q-item-label>
                  <q-item-label>
                    <q-icon
                      name="info"
                      color="positive"
                    /> Last Month
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
      <div class="q-pa-md col-xs-12 col-sm-6 col-md-3">
        <q-card class="my-card">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Total Profit</q-item-label>
                  <q-item-label class="number_card">35,588</q-item-label>
                  <q-item-label>
                    <q-icon
                      name="info"
                      color="positive"
                    /> Last Month
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
      <div class="q-pa-md col-xs-12 col-sm-6 col-md-3">
        <q-card class="my-card">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Total Cost</q-item-label>
                  <q-item-label class="number_card">35,588</q-item-label>
                  <q-item-label>
                    <q-icon
                      name="info"
                      color="positive"
                    /> Last Month
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-avatar
                    size="60px"
                    class="bg-success-gradient"
                    text-color="white"
                    icon="work_outline"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- CHARTS -->
    <div class="row q-gutter-y-md">
      <div class="col-xs-12 col-sm-6 col-md-8 q-px-md">
        <apexchart type="line" height="350" :options="options_line" :series="data_line" v-if="render_chart"/>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 q-px-md">
        <apexchart type="area" height="350" :options="options_area" :series="data_area" />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 q-px-md">
        <apexchart type="bar" height="350" :options="options_bar" :series="data_bar" />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 q-px-md">
        <apexchart type="bar" height="350" :options="options_line" :series="data_line" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { date } from 'quasar'
import VueApexCharts from 'vue-apexcharts';
let cat_prod_more_sales = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']; //Categorias de productos mas vendidos
let cat_daily_sales = []; //
let data_daily_sales = [];
export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      data_line: [{
        name: 'Ventas díarias',
        data: data_daily_sales
      }],
      options_line: {
        chart: {
          height: 350,
          type: 'line',
        },
        forecastDataPoints: {
          count: 7
        },
        stroke: {
          width: 5,
          curve: 'smooth'
        },
        xaxis: {
          type: 'category',
          categories: cat_daily_sales,
          tickAmount: 10,
        },
        title: {
          text: 'Ventas diaria',
          align: 'left',
          style: {
            fontSize: "16px",
            color: '#666'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: [ '#FDD835'],
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          },
        },
        yaxis: {
          min: 0,
          max: 10000000
        }
      },
      data_area: [{
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100]
      }, {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41]
      }],
      options_area: {
        chart: {
          height: 350,
          type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          },
        },
      },
      data_bar: [
        {
          name: 'Bombillos',
          data: [44]
        }, {
          name: 'Duchas',
          data: [76]
        }, {
          name: 'Guantes',
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }
      ],
      options_bar: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: cat_prod_more_sales,
        },
        yaxis: {
          title: {
            text: '$ (Productos más vendidos)'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + " vendidos"
            }
          }
        }
      },
      render_chart: false,
    };
  },
  computed: {
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions('desktop', [
      'chartProductMoreSales',
      'chartDailySales'
    ]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo datos del servidor, por favor espere...'
      });
      setTimeout(async() => {
        try {
          const res_pro_sales = await this.chartProductMoreSales().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get gráfica productos mas vendidos',
            data: res_pro_sales
          });
          if(res_pro_sales.ok){
            if(res_pro_sales.result){
              // cat_prod_more_sales.length = 0;
              // this.data_bar.length = 0;
              res_pro_sales.data.forEach( product => {
                // this.data_bar.push({
                //   name: product.Art_Nombre,
                //   data: [product.cant]
                // })
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_pro_sales.message)
          }

          const res_dai_sale = await this.chartDailySales().then( res => {
            return res.data;
          });
          console.log({
            msg: 'Respuesta get gráfica ventas diarias',
            data: res_dai_sale
          });
          if(res_dai_sale.ok){
            if(res_dai_sale.result){
              // cat_daily_sales.length = 0;
              // new Intl.NumberFormat().format()
              data_daily_sales.length = 0;
              res_dai_sale.data.forEach( venta => {
                let fecha = new Date(venta.Ev_Fecha_venta);
                let fecha_formated = date.formatDate(fecha, 'DD MMM');
                cat_daily_sales.push(fecha_formated)
                data_daily_sales.push(venta.cant)
              });
              this.render_chart = true;
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_dai_sale.message)
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
      }, 1000)
    }
  }
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
