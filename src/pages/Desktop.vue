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
        <apexchart type="line" height="350" :options="options_line" :series="data_line" />
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
import VueApexCharts from 'vue-apexcharts';
export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      data_line: [{
        name: 'Sales',
        data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
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
          type: 'datetime',
          categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001','4/11/2001' ,'5/11/2001' ,'6/11/2001'],
          tickAmount: 10,
          labels: {
            formatter: function(value, timestamp, opts) {
              return opts.dateFormatter(new Date(timestamp), 'dd MMM')
            }
          }
        },
        title: {
          text: 'Forecast',
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
          min: -10,
          max: 40
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
          name: 'Net Profit',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
          name: 'Revenue',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, {
          name: 'Free Cash Flow',
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
              return "$ " + val + " thousands"
            }
          }
        }
      },
    };
  },
  computed: {
  },
  created() {
  },
  methods: {
    
  }
};
</script>

<style scoped>
.my-card{
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
