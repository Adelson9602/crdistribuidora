<template>
  <div>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div class="row q-gutter-y-md">
        <div class="col-xs-12 q-px-sm">
          <q-input
            @input="val => {new_cargos.Car_Descripcion = val.toUpperCase()}"
            v-model="new_cargos.Car_Descripcion"
            hint="Descripcion del cargo"
            :rules="[val => !!val || 'Cargo es requerido']"
            maxlength="250"
            counter
          />
        </div>
        <div class="row col-xs-12 justify-end">
          <q-btn label="Guardar" type="submit" color="green" />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "ComponentAddCharges",
  data() {
    return {
      text: null,

      new_cargos: {
        base: null,
        Car_Id: null,
        Car_Descripcion: null,
        Car_Estado: 1,
        Car_User_control: null
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
    ...mapActions("master", ["addCargos"]),
    getData() {
      // Es una propiedad que se envia desde el page, si viene definido significa que estamos editando
      if (this.edit_data) {
        this.new_cargos = {
          base: null,
          Car_Id: this.edit_data.Car_Id,
          Car_Descripcion: this.edit_data.Car_Descripcion,
          Car_Estado: this.edit_data.Car_Estado,
          Car_User_control: this.edit_data.Car_User_control
        };
      }
    },
    onSubmit() {
      this.$q.loading.show({
        message: "Agregando porcentaje, por favor espere..."
      });
      setTimeout(async () => {
        try {
          this.new_cargos.base = process.env.__BASE__;
          this.new_cargos.Car_User_control = this.data_user.Per_Num_documento;
     
          const res_add = await this.addCargos(this.new_cargos).then(
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
      }, 1000);
    },
    onReset() {}
  }
};
</script>
