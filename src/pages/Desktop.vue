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
                  <q-item-label>Total créditos pendientes</q-item-label>
                  <q-item-label class="number_card">$ {{total_cred_pend}}</q-item-label>
                  <q-item-label>
                    <q-icon
                      name="info"
                      color="positive"
                    /> Al día de hoy
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
                  <q-item-label>Total notas créditos</q-item-label>
                  <q-item-label class="number_card">$ {{total_not_credito}}</q-item-label>
                  <q-item-label>
                    <q-icon
                      name="info"
                      color="positive"
                    /> Del día
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-avatar
                    size="60px"
                    class="bg-danger-gradient"
                    text-color="white"
                    icon="receipt_long"
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
                  <q-item-label>Total ventas</q-item-label>
                  <q-item-label class="number_card">$ {{total_ventas}}</q-item-label>
                  <q-item-label>
                    <q-icon
                      name="info"
                      color="positive"
                    /> Del día
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
                  <q-item-label>Total notas débito</q-item-label>
                  <q-item-label class="number_card">$ {{total_not_debito}}</q-item-label>
                  <q-item-label>
                    <q-icon
                      name="info"
                      color="positive"
                    /> Del día
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
        <apexchart type="line" height="350" :options="options_line" :series="data_line"/>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 q-px-md">
        <apexchart type="radialBar" height="390" :options="options_radial" :series="data_radial_bar" />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 q-px-md">
        <apexchart type="bar" height="350" :options="options_bar" :series="data_bar" />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 q-px-md">
        <apexchart type="bar" height="350" :options="options_line_hoz" :series="data_line_hoz"/>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { date } from 'quasar'
import VueApexCharts from 'vue-apexcharts';
let cat_prod_more_sales = []; //Categorias de productos mas vendidos
let cat_val_stock = []; //Categorías valor del stock
let data_val_stock = []; //Data para valor stock
let cat_daily_sales = []; //Categorías de ventas diarias
let data_daily_sales = []; //Cantidad de ventas diarias
let data_best_client = []; //datos de los mejores clientes
let cat_best_clients = []; //Categorias para los mejores clientes
export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      render_chart: false,
      data_line: [{
        name: 'Valor facturado',
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
          text: 'Ventas diarias',
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
        // yaxis: {
        //   min: 0,
        //   max: 10000000
        // }
      },
      data_radial_bar: data_val_stock,
      options_radial: {
        chart: {
          height: 390,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: '30%',
              background: 'transparent',
              image: undefined,
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: false,
              }
            }
          }
        },
        colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
        labels: cat_val_stock,
        legend: {
          show: true,
          floating: true,
          fontSize: '16px',
          position: 'left',
          offsetX: 60,
          offsetY: 15,
          labels: {
            useSeriesColors: true,
          },
          markers: {
            size: 0
          },
          formatter: function(seriesName, opts) {
            return seriesName + ":  $" + opts.w.globals.series[opts.seriesIndex]
          },
          itemMargin: {
            vertical: 3
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }]
      },
      data_bar: [{
        name: 'Bombillos',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
      }, {
        name: 'Lamparas',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
      }, {
        name: 'Lavaplatos',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
      }],
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
          categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        },
        yaxis: {
          title: {
            text: '$ (thousands)'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " vendidas"
            }
          }
        }
      },
      data_line_hoz: [{
        name: 'Valor facturado',
        data: data_best_client
      }],
      options_line_hoz: {
        annotations: {
          points: [{
            x: 'Bananas',
            seriesIndex: 0,
            label: {
              borderColor: '#775DD0',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#775DD0',
              },
              text: 'Bananas are good',
            }
          }]
        },
        chart: {
          height: 350,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: '50%',
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },
        grid: {
          row: {
            colors: ['#fff', '#f2f2f2']
          }
        },
        title: {
          text: 'Mejores clientes',
          align: 'left',
          style: {
            fontSize: "16px",
            color: '#666'
          }
        },
        xaxis: {
          labels: {
            rotate: -45
          },
          categories: cat_best_clients,
          tickPlacement: 'on'
        },
        yaxis: {
          title: {
            text: '$ Valor facturado',
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          },
        }
      },
      total_ventas: 0,
      total_not_credito: 0,
      total_not_debito: 0,
      total_cred_pend: 0,
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
      'chartDailySales',
      'chartBestClients',
      'chartPriceStock',
      'getTotalNotasCre',
      'getTotalVentas',
      'getTotalNotasDeb',
      'getTotalCredPen'
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
              this.data_bar.length = 0;
              let objcategorias = {}
              //Recorremos el arreglo para agrupar los productos de acuerdo a su categoría
              res_pro_sales.data.forEach( categorias => {
                categorias.forEach( product => {
                  //Si la categoría no existe en objcategorias entonces
                  //la creamos e inicializamos el arreglo de productos. 
                  if( !objcategorias.hasOwnProperty(product.Cat_Nombre)){
                    objcategorias[product.Cat_Nombre] = {
                      categoria: product.Cat_Nombre,
                      productos: []
                    }
                  }
                  // Agregamos los datos de productos. 
                  objcategorias[product.Cat_Nombre].productos.push({
                    nombre: product.Art_Nombre,
                    cantidad: product.cant
                  })
                  // objcategorias[product.Cat_Nombre].productos.push(product.cant)
                })
              })
              // Recorremos el objeto para asignar los datos
              for (const key in objcategorias) {
                const element = objcategorias[key];
                element.productos.forEach(product => {
                  // console.log(product)
                  // this.data_bar.push(product.cantidad)
                  // cat_prod_more_sales.push(product.nombre)
                })
              }
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
          // console.log({
          //   msg: 'Respuesta get gráfica ventas diarias',
          //   data: res_dai_sale
          // });
          if(res_dai_sale.ok){
            if(res_dai_sale.result){
              cat_daily_sales.length = 0;
              data_daily_sales.length = 0;
              res_dai_sale.data.forEach( venta => {
                let fecha = new Date(venta.Ev_Fecha_venta);
                let fecha_formated = date.formatDate(fecha, 'DD MMM');
                cat_daily_sales.push(fecha_formated)
                data_daily_sales.push(new Intl.NumberFormat().format(venta.cant))
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_dai_sale.message)
          }

          const res_best_client = await this.chartBestClients().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get gráfica mejores clientes',
          //   data: res_best_client
          // });
          if(res_best_client.ok){
            if(res_best_client.result){
              cat_best_clients.length = 0;
              data_best_client.length = 0;
              res_best_client.data.forEach( venta => {
                if(venta.CP_Razon_social){
                  let valor = new Intl.NumberFormat().format(venta.cant);
                  data_best_client.push(parseFloat(valor))
                  cat_best_clients.push(venta.CP_Razon_social)
                }
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_best_client.message)
          }

          const res_price_stock = await this.chartPriceStock().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta get gráfica valor stock movil',
          //   data: res_price_stock
          // });
          if(res_price_stock.ok){
            if(res_price_stock.result){
              cat_val_stock.length = 0;
              data_val_stock.length = 0;
              res_price_stock.data.forEach( movil => {
                let valor = new Intl.NumberFormat().format(movil.valor);
                cat_val_stock.push(movil.Mov_Descripcion)
                data_val_stock.push(valor)
              });
            } else {
              this.$q.notify({
                message: 'Sin resultados',
                type: 'warning'
              })
            }
          } else {
            throw new Error(res_price_stock.message)
          }

          const res_no_cred = await this.getTotalNotasCre().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Repuesta get total notas creditos',
          //   data: res_no_cred
          // });
          if(res_no_cred.ok){
            this.total_not_credito = new Intl.NumberFormat().format(res_no_cred.data.cant)
          } else {
            throw new Error(res_no_cred.message);
          }

          const res_sale = await this.getTotalVentas().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Repuesta get total ventas diarias',
          //   data: res_sale
          // });
          if(res_sale.ok){
            this.total_ventas = new Intl.NumberFormat().format(res_sale.data.total)
          } else {
            throw new Error(res_sale.message);
          }

          const res_no_deb = await this.getTotalNotasDeb().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Repuesta get total notas debitos',
          //   data: res_no_deb
          // });
          if(res_no_deb.ok){
            this.total_not_debito = new Intl.NumberFormat().format(res_no_deb.data.cant);
          } else {
            throw new Error(res_no_deb.message);
          }

          const res_cre_pd = await this.getTotalCredPen().then( res => {
            return res.data;
          });
          // console.log({
          //   msg: 'Repuesta get total creditos pendientes',
          //   data: res_cre_pd
          // });
          if(res_cre_pd.ok){
            this.total_cred_pend = new Intl.NumberFormat().format(res_cre_pd.data.CANT);
          } else {
            throw new Error(res_cre_pd.message);
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
