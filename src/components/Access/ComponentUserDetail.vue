<template>
  <div class="q-pa-none">
    <q-form @submit="onSubmit">
      <q-stepper v-model="step" ref="stepper" color="primary" animated>
        <q-step :name="1" title="Datos básicos del usuario" icon="settings" :done="step > 1">
          <div class="row q-col-gutter-y-md">
            <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
              <div class="text-h6">Datos Personales</div>
              <q-input
                v-model="person.Pers_Nombres"
                filled
                type="text"
                hint="Ingrese los nombres"
                label="Nombres"
                @blur="$v.person.Pers_Nombres.$touch"
                :error-message="mensaError('names')"
                :error="$v.person.Pers_Nombres.$error"
              />
              <q-input
                v-model="person.Pers_Apellidos"
                filled
                type="text"
                hint="Ingrese los apellidos"
                label="Apellidos"
                @blur="$v.person.Pers_Apellidos.$touch"
                :error-message="mensaError('surnames')"
                :error="$v.person.Pers_Apellidos.$error"
              />
              <q-select
                v-model="person.TipoDoc_Id"
                filled
                :options="options_type_documents"
                hint="Seleccione un tipo de documento"
              />
              <q-select
                transition-show="jump-up"
                transition-hide="jump-up"
                filled
                v-model="deparments"
                :options="options_deparments"
                hint="Departamento de Expedición"
              />
              <q-select
                transition-show="jump-up"
                transition-hide="jump-up"
                filled
                v-model="person.Pers_LugarExpDoc"
                :options="options_city"
                hint="Ciudad de Expedición"
                :disable="!isDeparment"
              />
              <q-input
                v-model="person.Pers_NumeroDoc"
                filled
                type="number"
                label="Número de documento"
                hint="Ingrese el número de documento"
                @blur="$v.person.Pers_NumeroDoc.$touch"
                :error-message="mensaError('document_number')"
                :error="$v.person.Pers_NumeroDoc.$error"
              />
              <q-input
                v-model="person.Pers_FechaNaci"
                filled
                type="date"
                hint="Fecha de Nacimiento"
              />
              <div class="q-gutter-sm">
                <div class="row">
                  <label for>Género</label>
                </div>
                <q-radio v-model="person.Pers_Genero" val="MASCULINO" label="Masculino" />
                <q-radio v-model="person.Pers_Genero" val="FEMENINO" label="Femenino" />
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
              <div class="text-h6">Datos de Laborales</div>
              <q-select
                v-model="person.Carg_id"
                filled
                :options="options_position"
                hint="Por favor seleccione un cargo"
              />
              <q-input
                v-model="person.Pers_Arl"
                filled
                type="text"
                label="ARL"
                hint="Cuál es el ARL?"
                @blur="$v.person.Pers_Arl.$touch"
                :error-message="mensaError('arl')"
                :error="$v.person.Pers_Arl.$error"
              />
              <q-input
                v-model="person.Pers_Eps"
                filled
                type="text"
                label="EPS"
                hint="Cuál es la EPS?"
                @blur="$v.person.Pers_Eps.$touch"
                :error-message="mensaError('eps')"
                :error="$v.person.Pers_Eps.$error"
              />
              <q-input
                v-model="person.Pers_Afp"
                filled
                type="text"
                label="AFP"
                hint="Cuál es el AFP?"
                @blur="$v.person.Pers_Afp.$touch"
                :error-message="mensaError('afp')"
                :error="$v.person.Pers_Afp.$error"
              />
              <q-input
                v-model="person.Pers_Rh"
                filled
                type="text"
                label="Rh"
                hint="Cuál es el RH?"
                @blur="$v.person.Pers_Rh.$touch"
                :error-message="mensaError('rh')"
                :error="$v.person.Pers_Rh.$error"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
              <div class="text-h6">Datos de Contacto</div>
              <q-input
                v-model="person.Pers_Direccion"
                filled
                type="text"
                label="Dirección"
                hint="Ingrese la dirección"
                @blur="$v.person.Pers_Direccion.$touch"
                :error-message="mensaError('direction')"
                :error="$v.person.Pers_Direccion.$error"
              />
              <q-input
                v-model="person.Pers_Celular"
                filled
                type="number"
                label="Teléfono"
                hint="Ingrese el número de Teléfono"
                @blur="$v.person.Pers_Celular.$touch"
                :error-message="mensaError('phone')"
                :error="$v.person.Pers_Celular.$error"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
              <div class="text-h6">Datos de la cuenta</div>
              <div class="row col-xs-12 justify-center profile-img">
                <q-avatar size="200px" square class="q-mb-md">
                  <img v-if="url" :src="url" />
                </q-avatar>
                <input type="file" @change="onFileChange" id="idImgUser" />
                <q-btn label="Seleccionar imágen" flat @click="dialogAvatar = true"/>
              </div>
              <q-dialog v-model="dialogAvatar"><!-- Empieza el dialog del avatar -->
                <q-card>
                  <q-toolbar>
                    <q-avatar size="70px">
                      <q-icon name="mdi-account-circle" size="70px" color="primary"/>
                    </q-avatar>

                    <q-toolbar-title class="text-toolbar"><span class="text-weight-bold">Sube</span> una foto o <span class="text-weight-bold">selecciona</span> un avatar</q-toolbar-title>

                    <q-btn flat round dense icon="close" v-close-popup />
                  </q-toolbar>
                  <q-separator />
                  <q-card-section class="q-gutter-md row justify-center">
                    <q-avatar size="70px" class="text-center bg-grey">
                      <label for="idImgUser">Subir foto</label>
                    </q-avatar>
                    <q-avatar 
                      size="70px" 
                      @click="selectedAvatar(`${urlApi}/adjuntos/men_avatar/m${item}.svg`)"
                      v-for="item in 24 " :key="`m${item}`"
                      class="avatar"
                    >
                      <img :src="`${urlApi}/adjuntos/men_avatar/m${item}.svg`">
                    </q-avatar>
                    <q-avatar
                      v-for="item in 24"
                      :key="`f${item}`"
                      size="70px"
                      class="avatar"
                      @click="selectedAvatar(`${urlApi}/adjuntos/male_avatar/f${item}.svg`)"
                    >
                      <img :src="`${urlApi}/adjuntos/male_avatar/f${item}.svg`">
                    </q-avatar>
                  </q-card-section>
                </q-card>
              </q-dialog><!-- Finaliza el dialog del avatar -->
              <q-select
                v-model="rol"
                filled
                :options="options_role"
                hint="Seleccione un rol para este usuario"
              />
              <q-input
                v-model="person.Pers_NumeroDoc"
                filled
                type="text"
                label="Usuario"
                hint="Este será su usuario"
                disable
              />
              <q-input
                v-model="user.Usuario_Contra"
                filled
                :type="isPwd ? 'password' : 'text'"
                label="Contraseña"
                hint="Ingrese la contraseña"
                @blur="$v.user.Usuario_Contra.$touch"
                :error-message="mensaError('password')"
                :error="$v.user.Usuario_Contra.$error"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-input
                v-model="repeat_password"
                filled
                :type="isPwd ? 'password' : 'text'"
                label="Contraseña"
                hint="Repita la Contraseña"
                @blur="$v.repeat_password.$touch"
                :error-message="mensaError('repeat_password')"
                :error="$v.repeat_password.$error"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-input
                v-model="person.Pers_Email"
                filled
                type="email"
                label="Email"
                hint="Ingrese el email"
                @blur="$v.person.Pers_Email.$touch"
                :error-message="mensaError('email')"
                :error="$v.person.Pers_Email.$error"
              />
            </div>
          </div>

          <q-stepper-navigation class="col-xs-12 row justify-end q-gutter-md">
            <q-btn
              push
              color="primary"
              text-color="white"
              @click="() => { done1 = true; step = 2 }"
              label="Continuar"
              v-if="formUser"
            />
            <q-btn
              push
              label="Editar perfil"
              type="submit"
              color="primary"
              :disable="$v.person.$invalid"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="Documentos del conductor"
          caption="Solo si el rol es USER"
          icon="create_new_folder"
        >
          <div class="row q-col-gutter-y-md">
            <div class="text-h6 col-xs-12">Documentos del conductor</div>
            <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
              <q-select
                v-model="documentsDriver.DocCond_CatLiceCond"
                filled
                :options="options_licenses"
                hint="Seleccione una categoría de licencia"
              />
              <q-select
                transition-show="jump-up"
                transition-hide="jump-up"
                filled
                v-model="documentsDriver.DocCond_cursoEMO"
                :options="options_document_driver"
                hint="Examen médico ocupacional"
              />
              <q-select
                transition-show="jump-up"
                transition-hide="jump-up"
                filled
                v-model="documentsDriver.DocCond_Cur_Man_Def"
                :options="options_document_driver"
                hint="Curso manejo defensivo"
              />
              <q-select
                transition-show="jump-up"
                transition-hide="jump-up"
                filled
                v-model="documentsDriver.DocCond_Cur_Merc_Pel"
                :options="options_document_driver"
                hint="Curso mercancías peligrosas"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
              <q-input
                v-model="documentsDriver.DocCond_LCFechaVenc"
                filled
                type="date"
                hint="Fecha vencimiento Licencia"
              />
              <q-input
                v-model="documentsDriver.DocCond_cursoEMOfechavenc"
                filled
                type="date"
                hint="Fecha vencimiento EMO"
              />
              <q-input
                v-model="documentsDriver.DocCond_Cur_Man_DefFechaVenc"
                filled
                type="date"
                hint="Fecha vencimiento CMD"
              />
              <q-input
                v-model="documentsDriver.DocCond_Cur_Merc_PelFechaVenc"
                filled
                type="date"
                hint="Fecha vencimiento CMP"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
              <q-select
                transition-show="jump-up"
                transition-hide="jump-up"
                filled
                v-model="documentsDriver.DocCond_cursoTSA"
                :options="options_document_driver"
                hint="Curso trabajo seguro en alturas"
              />
              <q-select
                transition-show="jump-up"
                transition-hide="jump-up"
                filled
                v-model="documentsDriver.DocCond_cursoMAB"
                :options="options_document_driver"
                hint="Curso mecánica automotriz básica"
              />
              <q-select
                transition-show="jump-up"
                transition-hide="jump-up"
                filled
                v-model="documentsDriver.DocCond_cursoPA"
                :options="options_document_driver"
                hint="Curso primeros auxilios"
              />
              <q-select
                transition-show="jump-up"
                transition-hide="jump-up"
                filled
                v-model="documentsDriver.DocCond_Pasgs"
                :options="options_document_driver"
                hint="Pago seguridad social"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
              <q-input
                v-model="documentsDriver.DocCond_cursoTSAfechavenc"
                filled
                type="date"
                hint="Fecha vencimiento TSA"
              />
              <q-input
                v-model="documentsDriver.DocCond_cursoMABfechavenc"
                filled
                type="date"
                hint="Fecha vencimiento MAB"
              />
              <q-input
                v-model="documentsDriver.DocCond_cursoPAfechavenc"
                filled
                type="date"
                hint="Fecha vencimiento CPA"
              />
              <q-input
                v-model="documentsDriver.DocCond_Fvss"
                filled
                type="date"
                hint="Fecha vencimiento seguridad social"
              />
            </div>
          </div>
          <q-stepper-navigation class="col-xs-12 row justify-end q-gutter-md">
            <q-btn push color="white" text-color="primary" @click="step = 1" label="Regresar" />
            <q-btn
              push
              label="Editar perfil"
              type="submit"
              color="primary"
              :disable="$v.person.$invalid"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-form>
  </div>
</template>

<script>
import {
  required,
  numeric,
  minLength,
  email,
  between,
} from "vuelidate/lib/validators";
import { mapActions, mapMutations, mapState } from "vuex";
import CryptoJS from 'crypto-js'
const optionCities = [];
const optionCitiesExp = [];
const optionRoles = [];
const optionDeparments = [];
const optionPosition = [];
const optionsTypeDocuments = [];
export default {
  name: "UserFormComponent",
  props: ["Roles", "Deparments", "Position", "typeDocuments", "Licenses", "tabForm", 'labelBtn'],
  data() {
    return {
      dialogAvatar: false,
      step: 1,
      isDeparment: false,
      isPwd: null,
      options_city: optionCities,
      options_position: optionPosition,
      options_role: optionRoles,
      options_deparments: optionDeparments,
      options_type_documents: optionsTypeDocuments,
      options_document_driver: ["CUMPLE", "NO CUMPLE", "N/A"],
      options_licenses: this.Licenses,
      repeat_password: null,
      deparments: "Seleccione un departamento",
      rol: "Seleccione un Rol",
      formUser: false,
      person: {
        Pers_Nombres: null,
        Pers_Apellidos: null,
        TipoDoc_Id: "Tipo de documento",
        Pers_NumeroDoc: null,
        Pers_FechaNaci: null,
        Pers_LugarExpDoc: "Ciudad de expedición",
        Pers_Genero: null,
        Carg_id: "Seleccione un cargo",
        Pers_Arl: null,
        Pers_Eps: null,
        Pers_Afp: null,
        Pers_Rh: null,
        Pers_Direccion: null,
        Pers_Celular: null,
        Pers_Email: null,
        Pers_Imagen: "persona.png",
        Emp_Id: 1,
      },
      user: {
        UsuarioUser: null,
        Usuario_Contra: null,
        Usuario_Estado: 1,
        Rol_Id: null,
      },
      documentsDriver: {
        DocCond_Lice_Cond: null,//Es la misma cédula 
        DocCond_CatLiceCond: 'Seleccione una categoría',
        DocCond_Cur_Man_Def: 'Estado del examen',
        DocCond_Cur_Merc_Pel: 'Estado del examen',
        DocCond_Pasgs: 'Estado del examen',
        DocCond_Fvss: 'Estado del examen',
        DocCond_LCFechaVenc: null,
        DocCond_Cur_Man_DefFechaVenc: null,
        DocCond_Cur_Merc_PelFechaVenc: null,
        Pers_NumeroDoc: null,
        DocCond_cursoEMO: 'Estado del examen',
        DocCond_cursoEMOfechavenc: null,
        DocCond_cursoTSA: 'Estado del examen',
        DocCond_cursoTSAfechavenc: null,
        DocCond_cursoMAB: 'Estado del examen',
        DocCond_cursoMABfechavenc: null,
        DocCond_cursoPA: 'Estado del examen',
        DocCond_cursoPAfechavenc: null,
      },
      files: null,
      url: null,
      urlApi: null,
    };
  },
  watch: {
    deparments(oldValue) {
      optionCities.length = 0;
      let idDeparment = oldValue.value;
      this.setIdDeparment(idDeparment);
      this.$q.loading.show({
        message: 'Obteniendo datos sel servidor, por favor espere...'
      });
      setTimeout(async () => {
        try {
          const ciudades = await this.getAllCities().then((res) => {
            if (res.status === 200) {
              this.$q.notify({
                type: "positive",
                message: "Ciudades obtenidas",
                position: "bottom",
              });
            }
            return res.data;
          }); // Get cities from api
          // Este forEach establece las opciones del selecet ciudad
          ciudades.forEach((element) => {
            if(idDeparment === element.Dpt_Id){
              optionCities.push({
                label: element.Ciu_Nombre,
                value: element.Ciu_Id,
              });
            }
          });
          this.isDeparment = true; //habilita el selecte ciudad
          this.resetCities(); // borramos los datos del state cities
          this.setCities(ciudades);
        } catch (error) {
          console.log(error);
          this.$q.notify({
            type: "negative",
            message: error,
            position: "bottom",
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    rol(oldValue) {
      if (oldValue.label === "User") {
        this.formUser = true;
      } else {
        this.formUser = false;
      }
    },
  },
  validations: {
    formUser: false,
    person: {
      Pers_Nombres: { required },
      Pers_Apellidos: { required },
      Pers_NumeroDoc: { required, numeric },
      Pers_Arl: { required },
      Pers_Eps: { required },
      Pers_Afp: { required },
      Pers_Rh: { required },
      Pers_Direccion: { required },
      Pers_Celular: { required, numeric, minLength: minLength(7) },
      Pers_Email: { required, email },
    },
    user: {
      Usuario_Contra: { required, minLength: minLength(6) },
    },
    repeat_password: { required, minLength: minLength(6) },
  },
  mounted() {
    this.Roles.forEach((element) => {
      optionRoles.push(element);
    });
    this.Position.forEach((element) => {
      optionPosition.push(element);
    });
    this.Deparments.forEach((element) => {
      optionDeparments.push(element);
    });
    this.typeDocuments.forEach((element) => {
      optionsTypeDocuments.push(element);
    });
    this.urlApi = process.env.__URLAPI__;
    this.editUserData();
  },
  computed: {
    ...mapState('access', ['dataSingleUser']),
    ...mapState('app', ['isOnline']),
    allDataUser(){
      return this.dataSingleUser
    }
  },
  methods: {
    ...mapMutations("auth", ["sendDataUser"]),
    ...mapActions("auth", ["register", "createUser"]),
    ...mapActions("inspections", ["getAllCities"]),
    ...mapMutations("inspections", ["setIdDeparment"]),
    ...mapMutations("main", ["setCities", "resetCities"]),
    ...mapMutations("access", ['setIdPerson']),
    ...mapActions("access", ["insertDocumentsDriver", "editDataEmploye", "editDataUser"]),
    ...mapActions('documents', ['updateDocumentsDrivers']),
    ...mapMutations('documents',['setIdDriver']),
    ...mapActions('inspections',['saveFile']),
    mensaError(campo) {
      if (campo === "names" && !this.$v.person.Pers_Nombres.required) {
        return "Campo requerido";
      }
      if (campo === "surnames" && !this.$v.person.Pers_Apellidos.required) {
        return "Campo requerido";
      }
      if (
        campo === "document_number" &&
        !this.$v.person.Pers_NumeroDoc.required
      ) {
        return "Campo requerido";
      }
      if (campo === "arl" && !this.$v.person.Pers_Arl.required) {
        return "Campo requerido";
      }
      if (campo === "eps" && !this.$v.person.Pers_Eps.required) {
        return "Campo requerido";
      }
      if (campo === "afp" && !this.$v.person.Pers_Afp.required) {
        return "Campo requerido";
      }
      if (campo === "rh" && !this.$v.person.Pers_Rh.required) {
        return "Campo requerido";
      }
      if (campo === "direction" && !this.$v.person.Pers_Direccion.required) {
        return "Campo requerido";
      }
      if (campo === "phone" && !this.$v.person.Pers_Celular.required) {
        return "Campo requerido";
      }
      if (campo === "password" && !this.$v.user.Usuario_Contra.required) {
        return "Campo requerido";
      }
      if (campo === "repeat_password" && !this.$v.repeat_password.required) {
        return "Campo requerido";
      }
      if (campo === "email" && !this.$v.person.Pers_Email.required) {
        return "Campo requerido";
      }
    },
    async onSubmit() {
      if (this.user.Usuario_Contra != this.repeat_password) {
        this.$q.notify({
          color: "negative",
          icon: "warning",
          message: "Las contraseñas no son iguales",
        });
      } else {
        this.$v.person.$touch();
        if (this.$v.person.$error) {
          this.$q.notify({
            type: "negative",
            icon: "warning",
            message: "Error: Todos los campos son obligatorios",
          });
        } else {
          this.user.UsuarioUser = this.person.Pers_NumeroDoc;
          this.user.Rol_Id = this.rol.value;
          // Extramos el id de los objetos
          this.person.Pers_LugarExpDoc = this.person.Pers_LugarExpDoc.value;
          this.person.TipoDoc_Id = this.person.TipoDoc_Id.value;
          this.person.Carg_id = this.person.Carg_id.value;
          this.$q.loading.show({
            message: 'Actualizando datos del usuario, por favor espere...'
          })
          setTimeout(async()=>{
            try {
              await this.apiRegister();
            } catch (e) {
              console.log(e);
              this.$q.notify({
                type: "negative",
                message: "Error ejecutando funciones del sistema", //Esto viene del error de la api al no encontrar un usuario
                position: "bottom",
              });
            } finally {
              this.$q.loading.hide();
            }
          }, 2000)
        }
      }
    },
    async apiRegister() {
      this.user.Usuario_Contra = this.encryptedAES(this.user.Usuario_Contra); // Encripta la contraseña
      var flagPerson = false;
      this.setIdPerson(this.person.Pers_NumeroDoc);
      this.setIdDriver(this.allDataUser.DocCond_Id);
      this.encryptedAES(this.user.Usuario_Contra);
      const formData = new FormData();
      if(this.files !== null){
        formData.append('files', this.files, this.files.name.toLowerCase().replace(/ /ig, "_"))
        await this.saveFile(formData).then(res => {
          var nameImage = res.data.url.split('/')
          this.person.Pers_Imagen = `${process.env.__URLAPI__}/adjuntos/`+this.files.name.toLowerCase().replace(/ /ig, "_");
          if(res.data.saved){
            this.editDataEmploye(this.person).then(res => {
              if(res.data.affectedRows > 0){
                  this.$q.notify({
                    type: 'positive',
                    message: 'Datos actualizados'
                  })
                } else {
                  this.$q.notify({
                    type: 'negative',
                    message: 'No pudimos actualizar tus datos'
                  })
                }
            });
            // res.data.ok && res.data.offline --> para guardar la foto offline
            this.$q.notify({
              type: 'positive',
              message: 'Datos actualizados'
            })
          }
        })
        .catch(e => 
          console.log(e)
        );
      } else {
        this.person.Pers_Imagen = this.url;
        const reseditDataEmploye = this.editDataEmploye(this.person).then(res => {
          return res.data
        });
        const reseditDataUser = await this.editDataUser(this.user).then(res => {
          console.log(res.data);
        }); //A
        this.$q.notify({
          type: 'positive',
          message: 'Datos actualizados'
        })
      }
      if( this.allDataUser.Rol_Nombre === 'User' ){
        // Reemplazamos las fechas 1000-01-01 por null, para que no se tome como falsificación de datos
        for (const key in this.documentsDriver) {
          if ( this.documentsDriver[key] === '1000-01-01' ) {
            this.documentsDriver[key] = null;
          }
        }
        await this.updateDocumentsDrivers(this.documentsDriver).then(res => {
          if(res.data.affectedRows > 0){
              this.$q.notify({
                type: 'positive',
                message: 'Documentos del conductor actualizados'
              })
              this.cancel();
          } else {
            this.$q.notify({
              type: 'negative',
              message: 'No pudimos actualizar documentos'
            })
          }
        });
      }
      // Reload
      this.$emit('reload')
    },
    editUserData(){
      this.deparments = {
        label: this.allDataUser.Departamento,
        value: this.allDataUser.Dpt_Id
      }
      this.person.Pers_Nombres = this.allDataUser.Pers_Nombres;
      this.person.Pers_Apellidos = this.allDataUser.Pers_Apellidos;
      this.person.TipoDoc_Id = {
        label: this.allDataUser.TipoDoc_Descrip,
        value: this.allDataUser.TipoDoc_Id
      };
      this.person.Pers_NumeroDoc = this.allDataUser.UsuarioUser;
      this.person.Pers_FechaNaci = this.allDataUser.Pers_FechaNaci;
      this.person.Pers_LugarExpDoc = {
        label: this.allDataUser.Ciu_Nombre,
        value: this.allDataUser.Pers_LugarExpDoc
      };
      this.person.Pers_Genero = this.allDataUser.Pers_Genero;
      this.person.Carg_id = {
        label: this.allDataUser.Carg_Descripcion,
        value: this.allDataUser.Carg_id
      };
      this.person.Pers_Arl = this.allDataUser.Pers_Arl;
      this.person.Pers_Eps = this.allDataUser.Pers_Eps;
      this.person.Pers_Afp = this.allDataUser.Pers_Afp;
      this.person.Pers_Rh = this.allDataUser.Pers_Rh;
      this.person.Pers_Direccion = this.allDataUser.Pers_Direccion;
      this.person.Pers_Celular = this.allDataUser.Pers_Celular;
      this.person.Pers_Email = this.allDataUser.Pers_Email;
      this.person.Pers_Imagen = this.allDataUser.Pers_Imagen;
      
      this.user.UsuarioUser = this.allDataUser.UsuarioUser;
      this.user.Usuario_Estado = this.allDataUser.Usuario_Estado;
      this.user.Rol_Id = this.allDataUser.Rol_Id;
      this.user.Usuario_Contra = this.decryptedAES(this.allDataUser.Usuario_Contra)
      this.rol = {
        label: this.allDataUser.Rol_Nombre,
        value: this.allDataUser.Rol_Id
      };
      this.url = this.person.Pers_Imagen;
      if(this.allDataUser.Rol_Nombre === 'User'){
        // DocCond_Id": 2,
        this.documentsDriver.DocCond_Lice_Cond = this.allDataUser.DocCond_Lice_Cond;
        this.documentsDriver.DocCond_CatLiceCond = this.allDataUser.DocCond_CatLiceCond;
        this.documentsDriver.DocCond_Cur_Man_Def = this.allDataUser.DocCond_Cur_Man_Def;
        this.documentsDriver.DocCond_Cur_Merc_Pel = this.allDataUser.DocCond_Cur_Merc_Pel;
        this.documentsDriver.DocCond_Pasgs = this.allDataUser.DocCond_Pasgs;
        this.documentsDriver.DocCond_cursoEMO = this.allDataUser.DocCond_cursoEMO;
        this.documentsDriver.DocCond_cursoTSA = this.allDataUser.DocCond_cursoTSA;
        this.documentsDriver.DocCond_cursoMAB = this.allDataUser.DocCond_cursoMAB;
        this.documentsDriver.DocCond_cursoPA = this.allDataUser.DocCond_cursoPA;
        this.documentsDriver.DocCond_LCFechaVenc = this.allDataUser.DocCond_LCFechaVenc;
        this.documentsDriver.DocCond_Fvss = this.allDataUser.DocCond_Fvss;
        this.documentsDriver.DocCond_Cur_Man_DefFechaVenc = this.allDataUser.DocCond_Cur_Man_DefFechaVenc;
        this.documentsDriver.DocCond_Cur_Merc_PelFechaVenc = this.allDataUser.DocCond_Cur_Merc_PelFechaVenc;
        this.documentsDriver.DocCond_cursoEMOfechavenc = this.allDataUser.DocCond_cursoEMOfechavenc;
        this.documentsDriver.DocCond_cursoTSAfechavenc = this.allDataUser.DocCond_cursoTSAfechavenc;
        this.documentsDriver.DocCond_cursoMABfechavenc = this.allDataUser.DocCond_cursoMABfechavenc;
        this.documentsDriver.DocCond_cursoPAfechavenc = this.allDataUser.DocCond_cursoPAfechavenc;
      }
    },
    cancel(){
      this.step = 1;
    },
    encryptedAES(data) {
      var key = CryptoJS.HmacSHA1("sha256", "oW%c76+jb2");
      // var key = CryptoJS.enc.Utf8.parse(key);
      // var iv = CryptoJS.enc.Utf8.parse(iv);
      var iv = CryptoJS.HmacSHA1("sha256", "A)2!u467a^");

      var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    },
    decryptedAES(encrypted) {
      var key = CryptoJS.HmacSHA1("sha256", "oW%c76+jb2");
      // var key = CryptoJS.enc.Utf8.parse(key);
      // var iv = CryptoJS.enc.Utf8.parse(iv);
      var iv = CryptoJS.HmacSHA1("sha256", "A)2!u467a^");

      var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    },
    onRejected(){
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.files = file;
      this.url = URL.createObjectURL(file);
      this.dialogAvatar = false;
    },
    selectedAvatar(img){
      this.avatar = img;
      this.url = img;
      this.dialogAvatar = false;
      this.person.Pers_Imagen = this.url;
    }
  },
};
</script>
<style scoped>
  .profile-img{
    border: 1px solid rgb(202, 202, 202);
    border-radius: 10px;
  }
  .avatar{
    cursor: pointer;
  }
  .profile-img {
    border: 1px solid rgb(202, 202, 202);
    border-radius: 10px;
  }
  input[type="file"]#idImgUser {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  label[for="idImgUser"] {
    font-size: 14px;
    color: #ffffff;
    display: inline-block;
    transition: all 0.5s;
    cursor: pointer;
    /* padding: 15px 26px !important; */
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: 100%;
    text-align: center;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .text-toolbar{
    white-space: normal;
  }
  /* Estilos para los avatars */
  .avatar:hover{
    transform: scale(.9);
  }
</style>