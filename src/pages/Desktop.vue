<template>
  <div class="q-pa-md" id="chart">
    <!-- CARDS -->
    <div class="row q-pt-sm content-card">
      <div class="q-pa-sm col-xs-12 col-sm-6 col-md-3">
        <q-card class="my-card">
          <q-card-section style="padding-left: 14px; padding-right: 14px;">
            <q-list>
              <q-item class="q-pa-none">
                <q-item-section>
                  <q-item-label>Total créditos</q-item-label>
                  <q-item-label class="number_card"
                    >$ {{ total_cred_pend }}</q-item-label
                  >
                  <q-item-label>
                    <q-icon name="info" color="positive" /> Pendientes
                  </q-item-label>
                </q-item-section>
                <q-item-section side style="padding-left: 0 !important;">
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
      <div class="q-pa-sm col-xs-12 col-sm-6 col-md-3">
        <q-card class="my-card">
          <q-card-section style="padding-left: 14px; padding-right: 14px;">
            <q-list>
              <q-item class="q-pa-none">
                <q-item-section>
                  <q-item-label>Total notas créditos</q-item-label>
                  <q-item-label class="number_card"
                    >$ {{ total_not_credito }}</q-item-label
                  >
                  <q-item-label>
                    <q-icon name="info" color="positive" /> Del día
                  </q-item-label>
                </q-item-section>
                <q-item-section side style="padding-left: 0 !important;">
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
      <div class="q-pa-sm col-xs-12 col-sm-6 col-md-3">
        <q-card class="my-card">
          <q-card-section style="padding-left: 14px; padding-right: 14px;">
            <q-list>
              <q-item class="q-pa-none">
                <q-item-section>
                  <q-item-label>Total ventas</q-item-label>
                  <q-item-label class="number_card"
                    >$ {{ total_ventas }}</q-item-label
                  >
                  <q-item-label>
                    <q-icon name="info" color="positive" /> Del día
                  </q-item-label>
                </q-item-section>
                <q-item-section side style="padding-left: 0 !important;">
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
      <div class="q-pa-sm col-xs-12 col-sm-6 col-md-3">
        <q-card class="my-card">
          <q-card-section style="padding-left: 14px; padding-right: 14px;">
            <q-list>
              <q-item class="q-pa-none">
                <q-item-section>
                  <q-item-label>Total notas débito</q-item-label>
                  <q-item-label class="number_card"
                    >$ {{ total_not_debito }}</q-item-label
                  >
                  <q-item-label>
                    <q-icon name="info" color="positive" /> Del día
                  </q-item-label>
                </q-item-section>
                <q-item-section side style="padding-left: 0 !important;">
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
        <apexchart
          type="line"
          height="350"
          :options="options_line"
          :series="data_line"
          ref="daily_sales"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 q-px-md">
        <apexchart
          type="radialBar"
          height="390"
          :options="options_radial"
          :series="data_radial_bar"
          ref="sellars"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 q-px-md">
        <apexchart
          type="bar"
          height="350"
          :options="options_bar"
          :series="data_bar"
          ref="more_sales"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 q-px-md">
        <apexchart
          type="bar"
          height="350"
          :options="options_line_hoz"
          :series="data_line_hoz"
          ref="best_clients"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { date } from "quasar";
import VueApexCharts from "vue-apexcharts";
let cat_prod_more_sales = []; //Categorias de productos mas vendidos
let data_pro_sales = []; //Data para productos mas vendidos
let cat_val_stock = []; //Categorías valor del stock
let data_val_stock = []; //Data para valor stock
let cat_daily_sales = []; //Categorías de ventas diarias
let data_daily_sales = []; //Cantidad de ventas diarias
let data_best_client = []; //datos de los mejores clientes
let cat_best_clients = []; //Categorias para los mejores clientes
let colors = ["#F44336", "#E91E63", "#9C27B0", "#F0C31F"];
export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      render_chart: false,
      data_line: [
        {
          name: "Valor facturado",
          data: data_daily_sales
        }
      ],
      options_line: {
        chart: {
          height: 350,
          type: "line"
        },
        forecastDataPoints: {
          count: 7
        },
        stroke: {
          width: 5,
          curve: "smooth"
        },
        xaxis: {
          type: "category",
          categories: cat_daily_sales,
          tickAmount: 10
        },
        yaxis: {
          title: {
            text: "Cantidad vendida"
          }
        },
        title: {
          text: "Ventas diarias",
          align: "left",
          style: {
            fontSize: "16px",
            color: "#666"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            gradientToColors: ["#FDD835"],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          }
        },
        noData: {
          text: "Cargando...",
          align: "center",
          verticalAlign: "middle",
          offsetX: 0,
          offsetY: 0,
          style: {
            color: "#000000",
            fontSize: "18px",
            fontFamily: "Helvetica"
          }
        }
      },
      data_radial_bar: data_val_stock,
      options_radial: {
        chart: {
          height: 390,
          type: "radialBar"
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: "30%",
              background: "transparent",
              image: undefined
            },
            dataLabels: {
              name: {
                show: false
              },
              value: {
                show: false
              }
            }
          }
        },
        title: {
          text: "Bodegas",
          align: "left",
          style: {
            fontSize: "16px",
            color: "#666"
          }
        },
        colors: colors,
        labels: cat_val_stock,
        legend: {
          show: true,
          floating: true,
          fontSize: "16px",
          position: "left",
          offsetX: 0,
          offsetY: 15,
          labels: {
            useSeriesColors: false
          },
          markers: {
            size: 0
          },
          formatter: function(seriesName, opts) {
            return (
              seriesName + ":  $" + opts.w.globals.series[opts.seriesIndex]
            );
          },
          itemMargin: {
            vertical: 3
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                show: false
              }
            }
          }
        ],
        noData: {
          text: "Cargando...",
          align: "center",
          verticalAlign: "middle",
          offsetX: 0,
          offsetY: 0,
          style: {
            color: "#000000",
            fontSize: "18px",
            fontFamily: "Helvetica"
          }
        }
      },
      data_bar: [
        {
          name: "Cantidad vendida",
          data: data_pro_sales
        }
      ],
      options_bar: {
        chart: {
          height: 350,
          type: "bar"
        },
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false,
          position: "bottom"
        },
        xaxis: {
          type: "category",
          labels: {
            show: false
          }
        },
        yaxis: {
          title: {
            text: "Cantidad vendida"
          }
        },
        title: {
          text: "Productos más vendidos",
          align: "left",
          style: {
            fontSize: "16px",
            color: "#666"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 100],
            colorStops: []
          }
        },
        noData: {
          text: "Cargando...",
          align: "center",
          verticalAlign: "middle",
          offsetX: 0,
          offsetY: 0,
          style: {
            color: "#000000",
            fontSize: "18px",
            fontFamily: "Helvetica"
          }
        }
      },
      data_line_hoz: [
        {
          name: "Valor facturado",
          data: data_best_client
        }
      ],
      options_line_hoz: {
        chart: {
          height: 350,
          type: "bar"
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: "50%",
            horizontal: true
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
            colors: ["#fff", "#f2f2f2"]
          }
        },
        title: {
          text: "Mejores clientes",
          align: "left",
          style: {
            fontSize: "16px",
            color: "#666"
          }
        },
        xaxis: {
          labels: {
            rotate: -45
          },
          categories: cat_best_clients,
          tickPlacement: "on"
        },
        yaxis: {
          title: {
            text: "$ Valor facturado"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          }
        },
        noData: {
          text: "Cargando...",
          align: "center",
          verticalAlign: "middle",
          offsetX: 0,
          offsetY: 0,
          style: {
            color: "#000000",
            fontSize: "18px",
            fontFamily: "Helvetica"
          }
        }
      },
      total_ventas: 0,
      total_not_credito: 0,
      total_not_debito: 0,
      total_cred_pend: 0
    };
  },
  computed: {},
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("desktop", [
      "chartProductMoreSales",
      "chartDailySales",
      "chartBestClients",
      "chartPriceStock",
      "getTotalNotasCre",
      "getTotalVentas",
      "getTotalNotasDeb",
      "getTotalCredPen"
    ]),
    async getData() {
      this.$q.loading.show({
        message: "Obteniendo datos del servidor, por favor espere..."
      });
      try {
        // Gráfica para ventas diarias
        const res_dai_sale = await this.chartDailySales().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get gráfica ventas diarias',
        //   data: res_dai_sale
        // });
        if (res_dai_sale.ok) {
          if (res_dai_sale.result) {
            cat_daily_sales.length = 0;
            data_daily_sales.length = 0;
            res_dai_sale.data.forEach(venta => {
              let fecha = new Date(venta.Ev_Fecha_venta);
              let fecha_formated = date.formatDate(fecha, "DD MMM");
              cat_daily_sales.push(fecha_formated);
              data_daily_sales.push(new Intl.NumberFormat().format(venta.cant));
            });
            this.$refs.daily_sales.updateSeries(
              [
                {
                  data: data_daily_sales
                }
              ],
              false,
              true
            );
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_dai_sale.message);
        }

        const res_price_stock = await this.chartPriceStock().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get gráfica valor stock movil',
        //   data: res_price_stock
        // });
        if (res_price_stock.ok) {
          if (res_price_stock.result) {
            cat_val_stock.length = 0;
            data_val_stock.length = 0;
            res_price_stock.data.forEach(movil => {
              let valor = new Intl.NumberFormat().format(movil.valor);
              cat_val_stock.push(movil.Mov_Descripcion);
              data_val_stock.push(valor);
            });
            this.$refs.sellars.updateSeries(data_val_stock, false, true);
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_price_stock.message);
        }

        // Grafica para productos mas vendidos
        const res_pro_sales = await this.chartProductMoreSales().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get gráfica productos mas vendidos',
        //   data: res_pro_sales
        // });
        if (res_pro_sales.ok) {
          if (res_pro_sales.result) {
            cat_prod_more_sales.length = 0;
            data_pro_sales.length = 0;
            let objcategorias = {};
            //Recorremos el arreglo para agrupar los productos de acuerdo a su categoría
            res_pro_sales.data.forEach(categorias => {
              categorias.forEach(product => {
                //Si la categoría no existe en objcategorias entonces
                //la creamos e inicializamos el arreglo de productos.
                if (!objcategorias.hasOwnProperty(product.Cat_Nombre)) {
                  objcategorias[product.Cat_Nombre] = {
                    categoria: product.Cat_Nombre,
                    productos: []
                  };
                }
                // Agregamos los datos de productos.
                objcategorias[product.Cat_Nombre].productos.push({
                  nombre: product.Art_Nombre,
                  cantidad: product.cant
                });
                // objcategorias[product.Cat_Nombre].productos.push(product.cant)
              });
            });
            // Recorremos el objeto para asignar los datos
            for (const key in objcategorias) {
              const element = objcategorias[key];
              element.productos.forEach(product => {
                data_pro_sales.push({
                  x: product.nombre,
                  y: product.cantidad
                });
                cat_prod_more_sales.push(product.nombre);
              });
            }
            this.$refs.more_sales.updateSeries(
              [
                {
                  data: data_pro_sales
                }
              ],
              false,
              true
            );
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_pro_sales.message);
        }

        // Grafica para mejores clientes
        const res_best_client = await this.chartBestClients().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Respuesta get gráfica mejores clientes',
        //   data: res_best_client
        // });
        if (res_best_client.ok) {
          if (res_best_client.result) {
            cat_best_clients.length = 0;
            data_best_client.length = 0;
            res_best_client.data.forEach(venta => {
              if (venta.CP_Razon_social) {
                let valor = new Intl.NumberFormat().format(venta.cant);
                data_best_client.push(parseFloat(valor));
                cat_best_clients.push(venta.CP_Razon_social);
              }
            });
            this.$refs.best_clients.updateSeries(
              [
                {
                  data: data_best_client
                }
              ],
              false,
              true
            );
          } else {
            this.$q.notify({
              message: "Sin resultados",
              type: "warning"
            });
          }
        } else {
          throw new Error(res_best_client.message);
        }

        const res_no_cred = await this.getTotalNotasCre().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Repuesta get total notas creditos',
        //   data: res_no_cred
        // });
        if (res_no_cred.ok) {
          this.total_not_credito = new Intl.NumberFormat().format(
            res_no_cred.data.cant
          );
        } else {
          throw new Error(res_no_cred.message);
        }

        const res_sale = await this.getTotalVentas().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Repuesta get total ventas diarias',
        //   data: res_sale
        // });
        if (res_sale.ok) {
          this.total_ventas = new Intl.NumberFormat().format(
            res_sale.data.total
          );
        } else {
          throw new Error(res_sale.message);
        }

        const res_no_deb = await this.getTotalNotasDeb().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Repuesta get total notas debitos',
        //   data: res_no_deb
        // });
        if (res_no_deb.ok) {
          this.total_not_debito = new Intl.NumberFormat().format(
            res_no_deb.data.cant
          );
        } else {
          throw new Error(res_no_deb.message);
        }

        const res_cre_pd = await this.getTotalCredPen().then(res => {
          return res.data;
        });
        // console.log({
        //   msg: 'Repuesta get total creditos pendientes',
        //   data: res_cre_pd
        // });
        if (res_cre_pd.ok) {
          this.total_cred_pend = new Intl.NumberFormat().format(
            res_cre_pd.data.CANT
          );
        } else {
          throw new Error(res_cre_pd.message);
        }
        this.render_chart = true;
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
    }
  }
};
</script>

<style scoped>
.my-card {
  border-radius: 10px;
  height: 120px;
}
.number_card {
  font-weight: 600 !important;
  font-size: 1.5rem;
}
.bg-primary-gradient {
  background: linear-gradient(
    to bottom right,
    #9e88f5 0%,
    #6259ca 100%
  ) !important;
}
.bg-danger-gradient {
  background-image: linear-gradient(
    to bottom right,
    #f1bf64 0%,
    #f71d36 100%
  ) !important;
}
.bg-secondary-gradient {
  background: linear-gradient(
    to bottom right,
    #9070ff 0%,
    #ff5d9e 100%
  ) !important;
}
.bg-success-gradient {
  background: linear-gradient(
    to bottom right,
    #4be8d4 0%,
    #129bd2 100%
  ) !important;
}
</style>
