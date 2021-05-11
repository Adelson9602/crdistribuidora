<template>
  <!-- <q-page padding class="q-mt-md">
    <user-detail 
      :Roles="arrayRoles"
      :Deparments="arrayDeparments"
      :Position="arrayPosition"
      :typeDocuments="arrayTypeDocuments"
      :Licenses="arrayLicenses"
      @reload="reload"
      v-if="renderComponent"
    />
    <skeletonForm v-if="!renderComponent"/>
    <template>

  </q-page> -->
  <q-page class="flex flex-center">
    <p class="text">PERFIL</p>
  </q-page>
</template>

<script>
import userDetail from 'components/Access/ComponentUserDetail';
import skeletonForm from 'components/Generals/ComponentSkeletonForm'
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: 'Profile',
  components: {
    userDetail,
    skeletonForm
  },
  data(){
    return {
      arrayRoles: [],
      arrayDeparments: [],
      arrayPosition: [],
      arrayTypeDocuments: [],
      arrayLicenses: [],
      label: "Crear Usuario",
      tabForm: false,
      dialogEnable: false,
      icon: false,
      enableEstate: false,
      msgEnable: null,
      idPerson: null,
      renderComponent: true,
    }
  },
  computed: {
    ...mapState("auth", ["user"]),
    dataUser() {
      return this.user;
    }
  },
  async mounted() {
    this.getData();
  },
  methods: {
    ...mapActions("access", ["getRolesAdministrators","getDeparments","getTypeDocuments","getUsers"]),
    ...mapMutations("access", ['setRoles', 'setDeparments','setTypeDocuments', 'setIdPerson', 'setDataSingleUser']),
    ...mapMutations('main',['setCities', 'setDataPositions']),
    ...mapActions("main", ["getPositions"]),
    ...mapActions('documents', ['getlicensecategories']),
    ...mapMutations('documents', ['setDatalicensecategories']),
    getData(){
      this.$q.loading.show({
        message: 'Obteniendo datos del servidor, por favor espere...'
      });
      setTimeout(async () => {
        try {
          const deparments = await this.getDeparments().then((res) => {
            return res.data;
          });
          deparments.forEach((element) => {
            this.arrayDeparments.push({
              label: element.Dpt_Nombre,
              value: element.Dpt_Id,
            });
          });
          this.setDeparments(this.arrayDeparments);

          // options_position
          const positions = await this.getPositions().then((res) => {
            return res.data;
          }); //Get positions from api
          positions.forEach((element) => {
            this.arrayPosition.push({
              label: element.Cargo,
              value: element.id
            });
          });
          this.setDataPositions(this.arrayPosition);

          const roles = await this.getRolesAdministrators().then((res) => {
            return res.data;
          });
          roles.forEach((element) => {
            this.arrayRoles.push({
              label: element.Rol_Nombre,
              value: element.Rol_Id
            });
          });
          this.setRoles(this.arrayRoles);

          const typeDocuments = await this.getTypeDocuments().then(res => {
            return res.data
          })
          typeDocuments.forEach(element => {
            this.arrayTypeDocuments.push({
              label: element.TipoDoc_Descrip,
              value: element.TipoDoc_Id
            })          
          })
          this.setTypeDocuments(this.arrayTypeDocuments)

          const licensecategories = await this.getlicensecategories().then(res => {
            return res.data
          }) //This is for get data of the api, this is a action
          // Recorremos el obtejo que nos retorna la api
          licensecategories.forEach( licensecategory => {
            this.arrayLicenses.push({
              label: licensecategory.Cat_lic_id,
              value: licensecategory.Cat_lic_id
            })
          });
          this.setDatalicensecategories(this.arrayLicenses)// send data to mutations

          const allUsers = await this.getUsers().then(res => {
            return res.data;
          }); //This is for get data of the api, this is a action
          // Recorremos el obtejo que nos retorna la api

          allUsers.forEach(user => {
            // verificamos si el valor de marca_estado que viene de la api = 1 y si vale 1 será reemplazado por activo, caso contrario por inactivo
            if (user.UsuarioUser === this.dataUser.UsuarioUser) {
              this.dataUserSilge = user;
            }
          });

          this.setDataSingleUser(this.dataUserSilge); // send data to mutations
          // Muestra el form normal
          // Muestra el form nuevamente
          this.renderComponent = true;
        } catch (error) {
          console.log(error);
          this.$q.notify({
            type: "negative",
            message: 'Error trayendo datos del servidor',
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    reload(){
      this.arrayRoles = [];
      this.arrayDeparments = [];
      this.arrayPosition = [];
      this.arrayTypeDocuments = [];
      this.arrayLicenses = [];
      this.renderComponent = false;
      this.getData();
    }
  },
}
</script>

<style scoped>
p{
  font-size: 55px;
}
</style>