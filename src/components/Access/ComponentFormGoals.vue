<template>
  <div>
    <q-form @submit="addGoals" class="q-gutter-md" ref="form_goals">
      <div class="row">
        <div class="col-xs-12 col-md-4 q-px-sm">
          <q-input
            v-model="goal.Met_vdesde"
            :rules="[val => !!val || 'Valor inicial es requerido']"
            mask="##########"
            hint="Valor inicial"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-4 q-px-sm">
          <q-input
            v-model="goal.Met_vhasta"
            :rules="[validateTope]"
            mask="##########"
            hint="Valor tope"
            counter
          />
        </div>
        <div class="col-xs-12 col-md-4 q-px-sm">
          <q-input
            v-model="goal.Met_porcentaje"
            type="text"
            hint="Porcentaje"
            :rules="[val => !!val || 'Porcentaje es requerido']"
          />
        </div>
        <div class="col-xs-12 col-md-4 q-px-sm">
          <q-select
            v-model="goal.Met_Estado"
            :options="options_state"
            hint="Estado"
            map-options
            emit-value
          />
        </div>
        <div class="col-xs-12 col-md-4 q-px-sm self-center">
          <q-btn
            label="Agregar"
            icon="add"
            type="submit"
            color="primary"
            class="self-center"
          />
        </div>
      </div>
      <q-table
        title="Metas a gregar"
        :data="data"
        :columns="columns"
        row-key="name"
        flat
        class="height"
        :pagination="initial_pagination"
      />
      <q-page-sticky position="bottom-right" :offset="[18, 18]" expand>
        <q-btn color="primary" icon="save" label="guardar" @click="saveGoals" />
      </q-page-sticky>
    </q-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ComponentFormGoals",
  data() {
    return {
      options_state: [
        {
          label: "ACTIVO",
          value: 1
        },
        {
          label: "INACTIVO",
          value: 0
        }
      ],
      goal: {
        //Meta a agregar
        base: null,
        Met_Id: null,
        Met_vdesde: null,
        Met_vhasta: null,
        Met_porcentaje: null,
        Met_Estado: 1,
        Met_User_control: null
      },
      data: [], //Contiene las metas que se van a guardar en la bd
      columns: [
        {
          name: "Met_Id",
          align: "center",
          label: "ID",
          sortable: true,
          field: "Met_Id"
        },
        {
          name: "Met_vdesde",
          align: "center",
          label: "Desde",
          sortable: true,
          field: "Met_vdesde"
        },
        {
          name: "Met_vhasta",
          align: "center",
          label: "Hasta",
          sortable: true,
          field: "Met_vhasta"
        },
        {
          name: "Met_porcentaje",
          align: "center",
          label: "Porcentaje",
          sortable: true,
          field: "Met_porcentaje"
        },
        {
          name: "Estado",
          align: "center",
          label: "Estado",
          sortable: true,
          field: "Estado"
        }
      ],
      initial_pagination: {
        //Paginación inicial para la tabla
        page: 1,
        rowsPerPage: 15
      }
    };
  },
  props: ["data_edit"],
  created() {
    if (this.data_edit) {
      this.goal = {
        base: this.data_edit.base,
        Met_Id: this.data_edit.Met_Id,
        Met_vdesde: this.data_edit.Met_vdesde,
        Met_vhasta: this.data_edit.Met_vhasta,
        Met_porcentaje: this.data_edit.Met_porcentaje,
        Met_Estado: this.data_edit.Met_Estado,
        Met_User_control: this.data_edit.Met_User_control
      };
    }
  },
  methods: {
    ...mapActions("access", ["insertUpdateGoals"]),
    // Crea o edita las metas
    async saveGoals() {
      this.$q.loading.show({
        message: "Guardando, por favor espere..."
      });
      try {
        let promises = [];
        this.data.forEach(goal => {
          promises.push(this.insertUpdateGoals(goal));
        });
        Promise.all(promises).then(data => {
          data.forEach(res => {
            // console.log({
            //   msg: 'Respuesta insert update metas',
            //   data: res.data
            // });
            if (res.data.ok && res.data.data.affectedRows) {
              this.$q.notify({
                message: res.data.message,
                type: "positive"
              });
            } else {
              this.$q.notify({
                message: res.data.message,
                type: "negative"
              });
              throw new Error(res.data.message);
            }
          });
        });
        this.$emit("reload");
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
    },
    // Agrega las metas a la tabla
    addGoals() {
      let goal_add = {
        base: process.env.__BASE__,
        Met_Id: this.goal.Met_Id,
        Met_vdesde: this.goal.Met_vdesde,
        Met_vhasta: this.goal.Met_vhasta,
        Met_porcentaje: this.goal.Met_porcentaje,
        Met_Estado: this.goal.Met_Estado,
        Met_User_control: 123456789,
        Estado: this.goal.Met_Estado == 1 ? "ACTIVO" : "INACTIVO"
      };
      this.data.push(goal_add);
      // Resetamos el formulario
      this.goal = {
        //Meta a agregar
        base: null,
        Met_Id: null,
        Met_vdesde: null,
        Met_vhasta: null,
        Met_porcentaje: null,
        Met_Estado: 1,
        Met_User_control: null
      };
      setTimeout(() => {
        this.$refs.form_goals.resetValidation();
      }, 300);
    },
    validateTope(value) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (value <= this.goal.Met_vdesde) {
            resolve(false || "Valor tope debe ser mayor a la inicial");
          } else if (!value) {
            resolve(false || "Valor tope es requerido");
          } else {
            resolve(true);
          }
        }, 1000);
      });
    }
  }
};
</script>
<style scoped>
.height {
  height: 55vh !important;
}
</style>
