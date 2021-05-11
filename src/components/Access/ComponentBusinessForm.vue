<template>
  <div class="q-pt-md">
    <q-form @submit="onSubmit" class="row q-col-gutter-y-md">
      <div class="col-xs-12 col-sm-4 q-pa-sm q-gutter-y-md">
        <div class="text-h6 text-center">Datos Básicos</div>
        <q-separator />
        <div class="q-gutter-md">
          <q-input
            v-model="company.Emp_Nombre"
            filled
            hint="Nombre de la empresa"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Nombre de la empresa es obligatorio']"
          />
          <q-input
            v-model="company.Emp_Razonsocial"
            filled
            hint="Razón social"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Razón social es obligatorio']"
          />
          <q-input
            v-model="company.Emp_Nit"
            filled
            hint="Nit"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Nit es obligatorio']"
          />
          <q-input
            v-model="company.Emp_InFacturacion"
            filled
            hint="Inicial Facturación"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Inicial Facturación es obligatorio']"
          />
          <q-input
            v-model="company.Cod_formt_preope"
            filled
            hint="Código del Formato"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Código del Formato es obligatorio']"
          />
          <q-input
            v-model="company.Version_formt_preope"
            filled
            type="number"
            hint="Versión del Formato"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Versión del Formato es obligatorio']"
          />
        </div>
      </div>
      <div class="col-xs-12 col-sm-4 q-pa-sm q-gutter-y-md">
        <div class="text-h6 text-center">Datos de Contacto principales</div>
        <q-separator />
        <div class="q-gutter-md">
          <q-input
            v-model="company.Emp_Contacto1"
            filled
            hint="Contacto"
            :rules="[ val => val && val.length > 0 || 'Contacto es obligatorio']"
          />
          <q-input
            v-model="company.Emp_Telefono1"
            filled
            type="tel"
            hint="Teléfono"
            :rules="[ val => val && val.length > 0 || 'Teléfono es obligatorio']"
          />
          <q-input
            v-model="company.Emp_Email1"
            filled
            type="email"
            hint="Email"
            :rules="[ val => val && val.length > 0 || 'Email es obligatorio']"
          />
          <q-select
            v-model="department"
            label="Departamento de inspección"
            :options="optionsDepartments"
            :rules="[validateSelect]"
            filled
          />
          <q-select
            v-model="city"
            label="Ciudad de inspección"
            :options="optionsCities"
            :rules="[validateSelect]"
            filled
          />
          <q-input
            v-model="company.Emp_DirEmpresa"
            filled
            hint="Dirección"
          />
        </div>
      </div>
      <div class="col-xs-12 col-sm-4 q-pa-sm q-gutter-y-md">
        <div class="text-h6 text-center">Datos de Contacto secundarios</div>
        <q-separator/>
        <div class="q-gutter-md">
          <q-input
            v-model="company.Emp_Contacto2"
            filled
            hint="Contacto"
          />
          <q-input
            v-model="company.Emp_Telefono2"
            filled
            type="tel"
            hint="Teléfono"
          />
          <q-input
            v-model="company.Emp_Email2"
            filled
            type="email"
            hint="Email"
          />
          <q-input
            v-model="company.Emp_SitioWeb"
            filled
            hint="Sitio Web"
          />
        </div>
      </div>

      <div class="col-xs-12 row justify-end">
        <q-btn push label="guardar cambios" type="submit" color="green" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "UserFormComponent",
  props: ["labelbtn", "datacompany", "tabForm"],
  data() {
    return {
      company: {
        Emp_Nombre: null,
        Emp_Razonsocial: null,
        Emp_Nit: null,
        Emp_InFacturacion: null,
        Emp_Contacto1: null,
        Emp_Telefono1: null,
        Emp_Email1: null,
        Emp_Contacto2: null,
        Emp_Telefono2: null,
        Emp_Email2: null,
        Emp_DirEmpresa: null,
        Emp_SitioWeb: '',
        Emp_RutaLogo: null,
        Cod_formt_preope:null,
        Version_formt_preope:null,
        Id_ciudad: null,
      },
      companydata: this.datacompany,
      department: null,
      optionsDepartments: [],
      optionsCities: [],
      city: null
    };
  },
  computed: {
    ...mapState("inspections", ["allCities"]),
    ...mapState("access", ["deparments"]),
    arrayAllCities() {
      return this.allCities;
    },
  },
  watch: {
    department(newValue) {
      this.optionsCities = [];
      let idDeparment = newValue.value;
      this.$q.loading.show({
        message: "Cargando ciudades, por favor espere..."
      });
      setTimeout(async () => {
        try {
          this.arrayAllCities.forEach(element => {
            if (idDeparment === element.Dpt_Id) {
              this.optionsCities.push({
                label: element.Ciu_Nombre,
                value: element.Ciu_Id
              });
            }
          });
        } catch (e) {
          console.log(e)
          let type_notify = 'negative';
          if ( e.message === "Network Error" ) {
            e = e.message;
            type_notify = 'warning';
          } else if ( e.message === "Request failed with status code 404" ){
            e = 'Error 404 al hacer la petición al servidor';
          } else if(e.message){
            e = e.message;
          }
          this.$q.notify({
            message: e,
            type: type_notify
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    city(newValue){
      this.company.Id_ciudad = newValue.value;
    }
  },
  mounted() {
    this.getData();
    this.editcompanyData();
  },
  methods: {
    ...mapActions("access", ["createCompany", "editDataCompany"]),
    ...mapMutations("access", ["setIdcompanies"]),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo datos del servidor, por favor espere...'
      });
      setTimeout(async()=> {
        try {
          this.deparments.forEach(element => {
            this.optionsDepartments.push({
              label: element.Dpt_Nombre,
              value: element.Dpt_Id
            });
          });
        } catch (e) {
          console.log(e)
          let type_notify = 'negative';
          if ( e.message === "Network Error" ) {
            e = e.message;
            type_notify = 'warning';
          } else if ( e.message === "Request failed with status code 404" ){
            e = 'Error 404 al hacer la petición al servidor';
          } else if(e.message){
            e = e.message;
          }
          this.$q.notify({
            message: e,
            type: type_notify
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    async onSubmit() {
      this.$q.loading.show({
        message: 'Realizando cambios, por favor espere...'
      });
      setTimeout(async () => {
        try {
          this.setIdcompanies(this.datacompany.Emp_Id);
          const reseditDataCompany = await this.editDataCompany(this.company).then((res) => {
            return res.data;
          });
          // console.log({
          //   msg: 'Respuesta edit datos company',
          //   data: reseditDataCompany
          // })
          if(!reseditDataCompany.affectedRows){
            throw 'Error al actualizar datos'
          }
          this.$q.notify({
            message: 'Cambios guardados',
            type: 'positive'
          })
          this.$emit('reload');
        } catch (e) {
          console.log(e)
          let type_notify = 'negative';
          if ( e.message === "Network Error" ) {
            e = e.message;
            type_notify = 'warning';
          } else if ( e.message === "Request failed with status code 404" ){
            e = 'Error 404 al hacer la petición al servidor';
          } else if(e.message){
            e = e.message;
          }
          this.$q.notify({
            message: e,
            type: type_notify
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    editcompanyData() {
      this.company.Emp_Nombre = this.datacompany.Emp_Nombre;
      this.company.Emp_Razonsocial = this.datacompany.Emp_Razonsocial;
      this.company.Emp_Nit = this.datacompany.Emp_Nit;
      this.company.Emp_InFacturacion = this.datacompany.Emp_InFacturacion;
      this.company.Emp_Contacto1 = this.datacompany.Emp_Contacto1;
      this.company.Emp_Telefono1 = this.datacompany.Emp_Telefono1;
      this.company.Emp_Email1 = this.datacompany.Emp_Email1;
      this.company.Emp_Contacto2 = this.datacompany.Emp_Contacto2;
      this.company.Emp_Telefono2 = this.datacompany.Emp_Telefono2;
      this.company.Emp_Email2 = this.datacompany.Emp_Email2;
      this.company.Emp_DirEmpresa = this.datacompany.Emp_DirEmpresa;
      this.company.Cod_formt_preope = this.datacompany.Cod_formt_preope;
      this.company.Version_formt_preope = this.datacompany.Version_formt_preope;
      this.department = {
        label:  this.datacompany.ciudad.Dpt_Nombre,
        value:  this.datacompany.ciudad.Dpt_Id
      }
      this.city = {
        label:  this.datacompany.ciudad.Ciu_Nombre,
        value:  this.datacompany.ciudad.Ciu_Id
      }
    },
    validateSelect (val) {
      if (val === null) {
        return 'Este campo es obligatorio, debe seleccionar una opción'
      }
    },
  },
}
</script>