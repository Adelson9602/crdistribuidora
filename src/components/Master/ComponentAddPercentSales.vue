<template>
  <div>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div class="row q-gutter-y-md">
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            @input="
              val => {
                new_percents.Pv_Descripcion = val.toUpperCase();
              }
            "
            v-model="new_percents.Pv_Descripcion"
            hint="Descripcion del porcentaje"
            :rules="[val => !!val || 'Porcentaje es requerido']"
            maxlength="250"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-6 q-px-sm">
          <q-input
            v-model="new_percents.Pv_Prcentaje"
            hint="valor %"
            :rules="[val => !!val || 'valor % es requerido']"
            mask="##"
            maxlength="2"
            counter
          />
        </div>
      </div>
      <div class="row justify-end q-mt-0">
        <div class="q-gutter-x-md">
          <q-btn label="Guardar" type="submit" color="green" />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "ComponentAddPercentSales",
  data() {
    return {
      text: null,

      new_percents: {
        base: null,
        Pv_Id: null,
        Pv_Descripcion: null,
        Pv_Prcentaje: null,
        Pv_Estado: 1,
        Pv_User_control: null
      }
    };
  },
  props: ["edit_data"],
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions("master", ["addPorcentaje"]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos, por favor espere..."
      });
      setTimeout(async () => {
        try {
          // Obtenemos las categorías de los productos

          // Es una propiedad que se envia desde el page, si viene definido significa que estamos editando
          if (this.edit_data) {
            this.new_percents = {
              base: null,
              Pv_Id: this.edit_data.Pv_Id,
              Pv_Descripcion: this.edit_data.Pv_Descripcion,
              Pv_Prcentaje: this.edit_data.Pv_Prcentaje,
              Pv_Estado: this.edit_data.Pv_Estado,
              Pv_User_control: this.edit_data.Pv_User_control
            };
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
      }, 2000);
    },
    onSubmit() {
      this.$q.loading.show({
        message: "Agregando porcentaje, por favor espere..."
      });
      setTimeout(async () => {
        try {
          this.new_percents.base = process.env.__BASE__;
          this.new_percents.Pv_User_control = this.data_user.Per_Num_documento;
     
          const res_add = await this.addPorcentaje(this.new_percents).then(
            res => {
              return res.data;
            }
          );
        //   console.log({
        //     msg: "Respuesta insert update porcentaje",
        //     data: res_add
        //   });
          if (res_add.ok) {
            this.$q.notify({
              message: "Guardado",
              type: "positive"
            });
            this.$emit("reload");
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
      }, 2000);
    },
    onReset() {}
  }
};
</script>
