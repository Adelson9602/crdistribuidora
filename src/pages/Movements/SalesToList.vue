<template>
  <q-page padding>
    <q-card class="height-card_page q-pa-md">
      <!-- Tabla de las ventas realizadas -->
      <component-table
        class="q-mt-md height-table"
        proptitle="Productos agrupados para picking"
        :propdata="data"
        :propcolumns="columns"
        :propgrid="false"
        :propflat="true"
        @getrangedata="getSalesRang"
        :propbtns="btns"
      />

      <!-- Tabla de las ventas realizadas -->
      <component-table
        class="q-mt-md height-table"
        proptitle="Detalle de Productos"
        :propdata="datadetail"
        :propcolumns="columnsdetail"
        :propgrid="false"
        :propflat="true"
        @getrangedata="getSalesRang"
      />
    </q-card>
  </q-page>
</template>

<script>
import componentTable from "components/Generals/ComponentTable";
import { mapActions } from "vuex";
export default {
  name: "SalesToList",
  components: {
    componentTable,
  },
  data() {
    return {
      date_range: {
        to: null,
        from: null,
      },
      columns: [
        {
          name: "Art_Id",
          required: true,
          label: "Id articulo",
          align: "center",
          field: "Art_Id",
          sortable: true,
        },
        {
          name: "Art_Nombre",
          required: true,
          label: "Nombre articulo",
          align: "center",
          field: "Art_Nombre",
          sortable: true,
        },
        {
          name: "cantidad",
          required: true,
          label: "Cantidad alistar",
          align: "center",
          field: "cantidad",
          sortable: true,
        },
        {
          name: "cantG",
          required: true,
          label: "Cantidad Garantia",
          align: "center",
          field: "cantG",
          sortable: true,
        },
      ],
      columnsdetail: [
        {
          name: "Ev_Id",
          required: true,
          label: "Id Venta",
          align: "center",
          field: "Ev_Id",
          sortable: true,
        },
        {
          name: "CP_Razon_social",
          required: true,
          label: "Razon social",
          align: "center",
          field: "CP_Razon_social",
          sortable: true,
        },
        {
          name: "cliente",
          required: true,
          label: "Contacto",
          align: "center",
          field: "cliente",
          sortable: true,
        },
        {
          name: "Art_Id",
          required: true,
          label: "Id articulo",
          align: "center",
          field: "Art_Id",
          sortable: true,
        },
        {
          name: "Art_Nombre",
          required: true,
          label: "Nombre articulo",
          align: "center",
          field: "Art_Nombre",
          sortable: true,
        },
        {
          name: "cantidad",
          required: true,
          label: "Cantidad alistar",
          align: "center",
          field: "cantidad",
          sortable: true,
        },
        {
          name: "cantG",
          required: true,
          label: "Cantidad Garantia",
          align: "center",
          field: "cantG",
          sortable: true,
        },
        {
          name: "Entregado",
          required: true,
          label: "Estado Entrega",
          align: "center",
          field: "Entregado",
          sortable: true,
        },
      ],
      data: [],
      datadetail: [],
      btns: {
        range_date: true,
        btn_export_pdf: false,
        export_excel: true
      }
    };
  },
  methods: {
    ...mapActions("sales", [
      "requestGetSalestoList",
      "requestGetSalestoListDetail",
    ]),
    getSalesRang(data) {
      data.base = process.env.__BASE__;
      this.$q.loading.show({
        message:
          "Buscando picking en el rango de fecha solicitado, por favor espere...",
      });
      setTimeout(async () => {
        try {
          const res_sales = await this.requestGetSalestoList(data).then((res) => {
            return res.data;
          });
          console.log({
            msg: "Respuesta get grupo picking por rango de fecha",
            data: res_sales,
          });
          this.data.length = 0;
          if (res_sales.ok) {
            if (res_sales.result) {
              res_sales.data.forEach((element) => {
                this.data.push({
                  Art_Id: element.Art_Id,
                  Art_Nombre: element.Art_Nombre,
                  cantidad: element.cantidad,
                  cantG: element.cantG,

                  // title: `Entrada No. ${element.Id}`,
                  // btn_edit: false,
                  // btn_status: false,
                  // btn_details: true,
                  // btn_pdf: true,
                  // icon_btn_edit: "mdi-pencil",
                  // icon_btn_status: "power_settings_new",
                  // icon_btn_details: "mdi-eye-settings",
                });
              });
            } else {
              this.$q.notify({
                message: res_sales.message,
                type: "warning",
              });
            }
          } else {
            throw res_sales.message;
          }
          const res_det_sales = await this.requestGetSalestoListDetail(data).then((res) => {
            return res.data;
          });
          console.log({
            msg: "Respuesta detalle picking por rango de fecha",
            data: res_det_sales,
          });
          this.datadetail.length = 0;
          if (res_det_sales.ok) {
            if (res_det_sales.result) {
              res_det_sales.data.forEach((element) => {
                this.datadetail.push({
                  Art_Id: element.Art_Id,
                  Art_Nombre: element.Art_Nombre,
                  cantidad: element.cantidad,
                  cantG: element.cantG,
                  Ev_Id: element.Ev_Id,
                  cliente: element.cliente,
                  CP_Razon_social: element.CP_Razon_social,
                  Entregado: element.Entregado,

                  // title: `Entrada No. ${element.Id}`,
                  // btn_edit: false,
                  // btn_status: false,
                  // btn_details: true,
                  // btn_pdf: true,
                  // icon_btn_edit: "mdi-pencil",
                  // icon_btn_status: "power_settings_new",
                  // icon_btn_details: "mdi-eye-settings",
                });
              });
            } else {
              this.$q.notify({
                message: res_det_sales.message,
                type: "warning",
              });
            }
          } else {
            throw res_det_sales.message;
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
      }, 2000);
    },
  },
};
</script>

<style scoped>
p {
  font-size: 55px;
}
</style>
