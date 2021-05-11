<template>
  <div class="q-pa-none">
    <q-form @submit="onSubmit">
      <q-stepper v-model="step" ref="stepper" color="primary" animated>
        <q-step
          :name="1"
          title="Datos básicos del usuario"
          icon="settings"
          :done="step > 1"
        >
          <div class="row q-col-gutter-y-md">
            <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
              <div class="text-h6">Datos Personales</div>
              <q-input
                style="text-transform:uppercase;"
                v-model="person.Pers_Nombres"
                filled
                type="text"
                hint="Nombres"
                :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
                counter
                maxlength="50"
              />
              <q-input
                style="text-transform:uppercase;"
                v-model="person.Pers_Apellidos"
                filled
                type="text"
                hint="Apellidos"
                :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
                counter
                maxlength="50"
              />
              <q-select
                style="text-transform:uppercase;"
                v-model="person.TipoDoc_Id"
                filled
                :options="options_type_documents"
                hint="Tipo de documento"
                :rules="[validateSelect]"
              />
              <q-input
                style="text-transform:uppercase;"
                v-model="person.Pers_NumeroDoc"
                filled
                type="number"
                hint="Número de documento"
                :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
                counter
                maxlength="20"
              />
              <q-select
                style="text-transform:uppercase;"
                filled
                v-model="deparments"
                :options="options_deparments"
                hint="Departamento de Expedición"
                :rules="[validateSelect]"
              />
              <q-select
                style="text-transform:uppercase;"
                filled
                v-model="person.Pers_LugarExpDoc"
                :options="options_city"
                hint="Ciudad de Expedición"
                :disable="!isDeparment"
                :rules="[validateSelect]"
              />
              <q-input
                style="text-transform:uppercase;"
                v-model="person.Pers_FechaNaci"
                filled
                type="date"
                hint="Fecha de Nacimiento"
              />
              <div class="q-gutter-sm">
                <div class="row">
                  <label for>Género</label>
                </div>
                <q-radio
                  v-model="person.Pers_Genero"
                  val="MASCULINO"
                  label="Masculino"
                />
                <q-radio
                  v-model="person.Pers_Genero"
                  val="FEMENINO"
                  label="Femenino"
                />
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
              <div class="text-h6">Datos de Laborales</div>
              <q-select
                style="text-transform:uppercase;"
                v-model="person.Carg_id"
                filled
                :options="options_position"
                hint="Cargo"
                :rules="[validateSelect]"
              />
              <q-input
                style="text-transform:uppercase;"
                v-model="person.Pers_Arl"
                filled
                type="text"
                hint="ARL"
                :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
                counter
                maxlength="50"
              />
              <q-input
                style="text-transform:uppercase;"
                v-model="person.Pers_Eps"
                filled
                type="text"
                hint="EPS"
                :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
                counter
                maxlength="50"
              />
              <q-input
                style="text-transform:uppercase;"
                v-model="person.Pers_Afp"
                filled
                type="text"
                hint="AFP"
                :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
                counter
                maxlength="50"
              />
              <q-select
                style="text-transform:uppercase;"
                v-model="person.Pers_Rh"
                filled
                :options="options_rh"
                hint="Seleccione RH"
                :rules="[validateSelect]"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
              <div class="text-h6">Datos de Contacto</div>
              <q-input
                style="text-transform:uppercase;"
                v-model="person.Pers_Direccion"
                filled
                type="text"
                hint="Dirección"
                :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
                counter
                maxlength="50"
              />
              <q-input
                style="text-transform:uppercase;"
                v-model="person.Pers_Celular"
                filled
                type="number"
                hint="Teléfono"
                :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
                counter
                maxlength="15"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
              <div class="text-h6">Datos de la cuenta</div>
              <div class="row col-xs-12 justify-center profile-img">
                <q-avatar id="preview" size="200px" square class="q-mb-md">
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
                style="text-transform:uppercase;"
                v-model="rol"
                filled
                :options="options_role"
                hint="Seleccione un rol para este usuario"
                :rules="[validateSelect]"
              />
              <q-input
                style="text-transform:uppercase;"
                v-model="person.Pers_NumeroDoc"
                filled
                hint="Este será su usuario"
                disable
                counter
                maxlength="20"
              />
              <q-input
                style="text-transform:uppercase;"
                v-model="password"
                filled
                :type="isPwd ? 'password' : 'text'"
                hint="Ingrese la contraseña"
                counter
                maxlength="20"
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
                style="text-transform:uppercase;"
                v-model="repeat_password"
                filled
                :type="isPwd ? 'password' : 'text'"
                hint="Repita la Contraseña"
                counter
                maxlength="20"
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
                style="text-transform:uppercase;"
                v-model="person.Pers_Email"
                filled
                type="email"
                hint="Ingrese el email"
                :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
                counter
                maxlength="50"
              />
            </div>
          </div>

          <q-stepper-navigation class="col-xs-12 row justify-end q-gutter-md">
            <q-btn
              push
              color="white"
              text-color="primary"
              @click="cancel"
              label="Cancelar"
              v-if="tabForm"
            />
            <q-btn
              push
              color="primary"
              text-color="white"
              @click="
                () => {
                  done1 = true;
                  step = 2;
                }
              "
              label="Continuar"
              v-if="formUser"
            />
            <q-btn
              push
              :label="labelBtn"
              type="submit"
              color="primary"
              v-if="!formUser"
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
                :rules="[validateSelect]"
              />
              <q-input
                type="date"
                filled
                v-model="documentsDriver.DocCond_LCFechaVenc"
                hint="Seleccione la fecha de vencimiento de la licencia"
                :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
              />
            </div>
            <div
              class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md"
              v-for="(item, index) in courseDriver"
              :key="index"
            >
              <q-select
                v-model="item.certificado"
                filled
                :options="optionsCursosCertificados"
                hint="Seleccione un curso"
                :disable="item.inactive === 0"
                :option-disable="
                  opt =>
                    item.inactive === 0 ? (opt.inactive = true) : opt.inactive
                "
                :rules="[validateSelect]"
              />
              <q-input
                type="date"
                filled
                v-model="item.fecha_vencimiento"
                hint="Seleccione la fecha de vencimiento del curso"
                :rules="[ val => val && val.length > 0 || 'Campo obligatorio']"
              />
            </div>
          </div>
          <q-stepper-navigation class="col-xs-12 row justify-end q-gutter-md">
            <q-btn
              label="Agregar curso"
              @click="addCourseDirver"
              color="positive"
              push
              v-if="!disableBtn"
            />
            <q-btn
              push
              color="white"
              text-color="primary"
              @click="step = 1"
              label="Regresar"
            />
            <q-btn
              push
              color="white"
              text-color="primary"
              @click="cancel"
              label="Cancelar"
              v-if="tabForm"
            />
            <q-btn
              push
              :label="labelBtn"
              type="submit"
              color="primary"
              v-if="formUser"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
var CryptoJS = require("cryp-to-js").default;
const optionCities = [];
const optionRoles = [];
const optionDeparments = [];
const optionPosition = [];
const optionsTypeDocuments = [];
export default {
  name: "UserFormComponent",
  props: [
    "Roles",
    "Deparments",
    "Position",
    "typeDocuments",
    "Licenses",
    "tabForm",
    "dataUser",
    "labelBtn"
  ],
  data() {
    return {
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
      deparments: null,
      rol: null,
      formUser: false,
      person: {
        Pers_Nombres: null,
        Pers_Apellidos: null,
        TipoDoc_Id: null,
        Pers_NumeroDoc: null,
        Pers_FechaNaci: null,
        Pers_LugarExpDoc: null,
        Pers_Genero: null,
        Carg_id: null,
        Pers_Arl: null,
        Pers_Eps: null,
        Pers_Afp: null,
        Pers_Rh: null,
        Pers_Direccion: null,
        Pers_Celular: null,
        Pers_Email: null,
        Pers_Imagen: '',
        Emp_Id: 1
      },
      user: {
        UsuarioUser: null,
        Usuario_Contra: null,
        Usuario_Estado: 1,
        Rol_Id: null
      },
      password: null,
      documentsDriver: {
        DocCond_Lice_Cond: null, //Es la misma cédula
        DocCond_CatLiceCond: null,
        Pers_NumeroDoc: null,
        DocCond_LCFechaVenc: null
      },
      allDataUser: this.dataUser,
      files: null,
      imgUser: null,
      url: null,
      courseDriver: [
        {
          id_Usuario: null,
          certificado: null,
          id_Curso: null,
          fecha_vencimiento: null
        }
      ],
      optionsCursosCertificados: [],
      options_rh: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
      disableBtn: false,
      avatar: '',
      dialogAvatar: false,
      urlApi: null,
    };
  },
  watch: {
    deparments(oldValue) {
      optionCities.length = 0;
      let idDeparment = oldValue.value;
      this.setIdDeparment(idDeparment);
      this.$q.loading.show({
        message: "Obteniendo ciudades, por favor espere..."
      });
      setTimeout(async () => {
        try {
          const ciudades = await this.getAllCities().then(res => {
            if (res.status === 200) {
              this.$q.notify({
                type: "positive",
                message: "Ciudades obtenidas",
                position: "bottom"
              });
            }
            return res.data;
          }); // Get cities from api
          // Este forEach establece las opciones del selecet ciudad
          ciudades.forEach(element => {
            if (idDeparment === element.Dpt_Id) {
              optionCities.push({
                label: element.Ciu_Nombre,
                value: element.Ciu_Id
              });
            }
          });
          this.isDeparment = true; //habilita el selecte ciudad
        } catch (e) {
          console.log(e)
          if ( e.message === "Network Error" ) {
            e = e.message;
          } else if ( e.message === "Request failed with status code 404" ){
            e = 'Error 404 al hacer la petición al servidor';
          } else if(e.message){
            e = e.message;
          }
          this.$q.notify({
            message: e,
            type: 'negative'
          });
        } finally {
          this.$q.loading.hide();
        }
      }, 2000);
    },
    rol(oldValue) {
      if (oldValue.label === "Operador") {
        this.formUser = true;
      } else {
        this.formUser = false;
      }
    }
  },
  created() {
    if (this.tabForm) {
      this.editUserData();
    }
    this.urlApi = process.env.__URLAPI__;
    optionRoles.length = 0;
    optionPosition.length = 0;
    optionDeparments.length = 0;
    optionsTypeDocuments.length = 0;
    this.Roles.forEach(element => {
      optionRoles.push(element);
    });
    this.Position.forEach(element => {
      optionPosition.push(element);
    });
    this.Deparments.forEach(element => {
      optionDeparments.push(element);
    });
    this.typeDocuments.forEach(element => {
      optionsTypeDocuments.push(element);
    });
    setTimeout(async () => {
      try {
        const reslistCoursesCertified = await this.listCoursesCertified().then(
          res => {
            return res.data;
          }
        );
        reslistCoursesCertified.forEach(element => {
          if (element.id_Curso !== 5) {
            this.optionsCursosCertificados.push({
              value: element.id_Curso,
              label: element.Curso,
              inactive: false
            });
          }
        });
      } catch (e) {
        console.log(e);
        this.notify({
          message: "Error ejecutando funciones del sistema",
          type: "negative"
        });
      }
    }, 2000);
  },
  methods: {
    ...mapMutations("auth", ["sendDataUser"]),
    ...mapActions("auth", ["register", "createUser"]),
    ...mapActions("inspections", ["getAllCities"]),
    ...mapMutations("inspections", ["setIdDeparment"]),
    ...mapMutations("access", ["setIdPerson"]),
    ...mapActions("access", [
      "insertDocumentsDriver",
      "editDataEmploye",
      "editDataUser",
      "insertRelationDocumentsDriver",
      "listCoursesCertified",
      "validateUser",
    ]),
    ...mapActions("documents", ["updateDocumentsDrivers"]),
    ...mapMutations("documents", ["setIdDriver"]),
    ...mapActions("inspections", ["saveFile"]),
    async onSubmit() {
      if (this.password !== this.repeat_password) {
        this.$q.notify({
          color: "negative",
          icon: "warning",
          message: "Las contraseñas no son iguales"
        });
      } else {
        if( this.person.Pers_Imagen !== ''){
          this.user.UsuarioUser = this.person.Pers_NumeroDoc;
          this.user.Rol_Id = this.rol.value;
          // Extramos el id de los objetos
          this.person.Pers_LugarExpDoc = this.person.Pers_LugarExpDoc.value;
          this.person.TipoDoc_Id = this.person.TipoDoc_Id.value;
          this.person.Carg_id = this.person.Carg_id.value;
          var msgLoading; //Variable que contendra el mensaje a mostrar en el loading, dependiendo de si es update o register;
          if (!this.tabForm) {
            msgLoading = "Registrando usuario, por favor espere...";
          } else {
            msgLoading = "Actualizando datos del usuario, por favor espere...";
          }
          this.$q.loading.show({
            message: msgLoading
          });
          setTimeout(async () => {
            try {
              await this.apiRegister();
            } catch (e) {
              console.log(e);
              console.log(e)
              if ( e.message === "Network Error" ) {
                e = e.message;
              } else if ( e.message === "Request failed with status code 404" ){
                e = 'Error 404 al hacer la petición al servidor';
              } else if(e.message){
                e = e.message;
              }
              this.$q.notify({
                message: e,
                type: 'negative'
              });
            } finally {
              this.$q.loading.hide();
            }
          }, 2000);
        } else {
          this.$q.notify({
            message: 'Debe subir una foto o seleccionar un avatar',
            type: 'negative'
          })
        }
      }
    },
    async apiRegister() {
      if (
        this.courseDriver.id_Curso === undefined &&
        this.user.Rol_Id === 2 &&
        this.documentsDriver.DocCond_CatLiceCond === null
      ) {
        this.$q.notify({
          message: "No puedes registrar un conductor sin documentos",
          type: "warning"
        });
      } else {
        this.user.Usuario_Contra = this.encryptedAES(this.password); // Encripta la contraseña
        //Si no es true el tabForm entonces esta creando el usuario
        if (!this.tabForm) {
          try {
            const resvalidateUser = await this.validateUser(this.person).then(
              res => {
                return res.data;
              }
            );
            if (resvalidateUser.cant > 0) {
              this.$q.notify({
                message: "Esta persona ya esta registrada",
                type: "warning"
              });
            } else {
              if (this.files) {
                const formData = new FormData();
                formData.append( "files", this.files, this.files.name.toLowerCase().replace(/ /gi, "_"));
                const ressaveFile = await this.saveFile(formData).then(async res => {
                    return res.data;
                }).catch(e => console.log(e));
                // console.log({
                //   msg: 'Respuesta subida de foto de perfil',
                //   data: ressaveFile
                // });
                if(!ressaveFile.saved){
                  throw 'Error al guardar foto de perfil';
                }
                this.person.Pers_Imagen = `${process.env.__URLAPI__}/adjuntos/` + this.files.name.toLowerCase().replace(/ /gi, "_");
              }
              const resregister = await this.register(this.person).then(res => {
                return res.data;
              });
              // console.log({
              //   msg: 'Respuesta insert persona',
              //   data: resregister
              // });
              if(!resregister.affectedRows){
                throw 'Error al registrar datos personales';
              }

              const rescreateUser = await this.createUser(this.user).then(res => {
                return res.data;
              });
              // console.log({
              //   msg: 'Respuesta insert usuario',
              //   data: rescreateUser
              // })
              if(!rescreateUser.affectedRows){
                throw 'Error al crear el usuario de la persona';
              }

              // Registramos los documentos del conductos solo si el rol es User
              if (this.formUser) {
                this.documentsDriver.DocCond_Lice_Cond = this.person.Pers_NumeroDoc;
                this.documentsDriver.Pers_NumeroDoc = this.person.Pers_NumeroDoc;
                const resinsertDocumentsDriver = await this.insertDocumentsDriver(this.documentsDriver).then(res => {
                  return res.data;
                });
                // console.log({
                //   msg: 'Respuesta insert documentos conductor',
                //   data: resinsertDocumentsDriver
                // });
                if(!resinsertDocumentsDriver.affectedRows){
                  throw 'Error al guardar la documentación del conductor';
                }

                this.courseDriver.push({
                  id_Curso: 5,
                  fecha_vencimiento: this.documentsDriver.DocCond_LCFechaVenc,
                  id_Usuario: null
                });

                if (this.courseDriver.length > 0) {
                  this.courseDriver.forEach(async element => {
                    try {
                      element.id_Usuario = this.person.Pers_NumeroDoc;
                      if (element.certificado !== null) {
                        if (element.id_Curso !== 5) {
                          element.id_Curso = element.certificado.value;
                        }
                        const resinsertRelationDocumentsDriver = await this.insertRelationDocumentsDriver( element ).then(res => {
                          return res.data;
                        });
                        // console.log({
                        //   msg: 'Respuesta insert relación documentos del conductor',
                        //   data: resinsertRelationDocumentsDriver
                        // });
                        if(!resinsertRelationDocumentsDriver.affectedRows){
                          throw 'Error al relacionar la documentación con el conductor';
                        }
                      }
                    } catch (e) {
                      console.log(e)
                      if ( e.message === "Network Error" ) {
                        e = e.message;
                      } else if ( e.message === "Request failed with status code 404" ){
                        e = 'Error 404 al hacer la petición al servidor';
                      } else if(e.message){
                        e = e.message;
                      }
                      this.$q.notify({
                        message: e,
                        type: 'negative'
                      });
                    }
                  });
                }
                // Aplica cuando es conductor
                this.courseDriver.length = 0;
                this.person.length = 0;
                this.person.length = 0;
                this.$emit("reload");
              }
              // Aplica cuando no es conductor
              this.courseDriver.length = 0;
              this.person.length = 0;
              this.person.length = 0;
              this.$emit("defaultValues");
              this.$q.notify({
                type: "positive",
                message: "Usuario registrado con éxito",
              });
              this.$emit("reload");
            }
          } catch (e) {
            console.log(e)
            if ( e.message === "Network Error" ) {
              e = e.message;
            } else if ( e.message === "Request failed with status code 404" ){
              e = 'Error 404 al hacer la petición al servidor';
            } else if(e.message){
              e = e.message;
            }
            this.$q.notify({
              message: e,
              type: 'negative'
            });
          }
          
        } else {
          try {
            this.setIdPerson(this.person.Pers_NumeroDoc);
            this.setIdDriver(this.dataUser.DocCond_Id);
            if (this.files) {
              const formData = new FormData();
              formData.append(
                "files",
                this.files,
                this.files.name.toLowerCase().replace(/ /gi, "_")
              );
              await this.saveFile(formData).catch(e => console.log(e));
              this.person.Pers_Imagen =
                `${process.env.__URLAPI__}/adjuntos/` +
                this.files.name.toLowerCase().replace(/ /gi, "_");
            }
            const reseditDataEmploye = await this.editDataEmploye(this.person).then(res => {
              return res.data;
            });
            if(!reseditDataEmploye.affectedRows){
              throw 'Error actualizando datos';
            }
            // console.log({
            //   msg: 'Respuesta edit datos',
            //   data: reseditDataEmploye
            // });
            const reseditDataUser = await this.editDataUser(this.user).then(res => {
              return res.data;
            }); //Actualiza los datos del usuario
            if(!reseditDataUser.affectedRows){
              throw 'Error actualizando datos de usuario';
            }
            // console.log({
            //   msg: 'Respuesta edit datos usuario conductor',
            //   data: reseditDataUser
            // });

            if (this.dataUser.Rol_Nombre === "Operador") {
              let license = {
                DocCond_Id: this.dataUser.DocCond_Id === 'N/A' ? null : this.dataUser.DocCond_Id,
                DocCond_Lice_Cond: this.person.Pers_NumeroDoc,
                DocCond_CatLiceCond: this.documentsDriver.DocCond_CatLiceCond,
                Pers_NumeroDoc: this.person.Pers_NumeroDoc,
                fecha_vencimiento: this.documentsDriver.DocCond_LCFechaVenc,
                id_Usuario: this.person.Pers_NumeroDoc,
                id_Curso: 5,
              }
              // Actuliza la categoria de la licencia de conducir
              const resinsertDocumentsDriver = await this.insertDocumentsDriver(license).then( res => {
                return res.data;
              });
              // console.log({
              //   msg: 'Respuesta edit licencia del conductor',
              //   data: resinsertDocumentsDriver
              // })
              if(!resinsertDocumentsDriver.affectedRows){
                throw 'Error al actualizar la categoría de licencia del conductor';
              }
              
              // Actuliza la fecha de vencimiento de la licencia
              const resupdateDocumentsDrivers = await this.updateDocumentsDrivers(license).then(res => {
                return res.data
              });
              // console.log({
              //   msg: 'Repuesta edit documentos',
              //   data: resupdateDocumentsDrivers
              // });
              if(!resupdateDocumentsDrivers.affectedRows){
                throw 'Error al actualizar la fecha vencimiento de la licencia';
              }
              
              // Reemplazamos las fechas 1000-01-01 por null, para que no se tome como falsificación de datos
              this.courseDriver.forEach(async element => {
                try {
                  if(element.certificado && element.certificado.value !== 5){
                    let curso = {
                      id_Usuario: element.id_Usuario,
                      id_Curso: element.certificado.value,
                      fecha_vencimiento: element.fecha_vencimiento,
                      certificado: element.certificado.label
                    }
                    // Actuliza la fecha de los cursos y cursos
                    const resupdateDocumentsDrivers = await this.updateDocumentsDrivers(curso).then(res => {
                      return res.data
                    });
                    // console.log({
                    //   msg: 'Repuesta edit documentos',
                    //   data: resupdateDocumentsDrivers
                    // });
                    if(!resupdateDocumentsDrivers.affectedRows){
                      throw 'Error al actulizar documentación';
                    }
                  }
                } catch (e) {
                  console.log(e)
                  if ( e.message === "Network Error" ) {
                    e = e.message;
                  } else if ( e.message === "Request failed with status code 404" ){
                    e = 'Error 404 al hacer la petición al servidor';
                  } else if(e.message){
                    e = e.message;
                  }
                  this.$q.notify({
                    message: e,
                    type: 'negative'
                  });
                }
              });
            }
            this.$q.notify({
              type: "positive",
              message: "Datos actualizados"
            });
            this.$emit("reload");
          } catch (e) {
            console.log(e)
            if ( e.message === "Network Error" ) {
              e = e.message;
            } else if ( e.message === "Request failed with status code 404" ){
              e = 'Error 404 al hacer la petición al servidor';
            } else if(e.message){
              e = e.message;
            }
            this.$q.notify({
              message: e,
              type: 'negative'
            });
          }
        }
      }
    },
    async editUserData() {
      this.deparments = {
        label: this.dataUser.Departamento,
        value: this.dataUser.Dpt_Id
      };
      this.person.Pers_Nombres = this.dataUser.Pers_Nombres;
      this.person.Pers_Apellidos = this.dataUser.Pers_Apellidos;
      this.person.TipoDoc_Id = {
        label: this.dataUser.TipoDoc_Descrip,
        value: this.dataUser.TipoDoc_Id
      };
      this.person.Pers_NumeroDoc = this.dataUser.UsuarioUser;
      this.person.Pers_FechaNaci = this.dataUser.Pers_FechaNaci;
      this.person.Pers_LugarExpDoc = {
        label: this.dataUser.Ciu_Nombre,
        value: this.dataUser.Pers_LugarExpDoc
      };
      this.person.Pers_Genero = this.dataUser.Pers_Genero;
      this.person.Carg_id = {
        label: this.dataUser.Carg_Descripcion,
        value: this.dataUser.Carg_id
      };
      this.person.Pers_Arl = this.dataUser.Pers_Arl;
      this.person.Pers_Eps = this.dataUser.Pers_Eps;
      this.person.Pers_Afp = this.dataUser.Pers_Afp;
      this.person.Pers_Rh = this.dataUser.Pers_Rh;
      this.person.Pers_Direccion = this.dataUser.Pers_Direccion;
      this.person.Pers_Celular = this.dataUser.Pers_Celular;
      this.person.Pers_Email = this.dataUser.Pers_Email;
      this.person.Pers_Imagen = this.dataUser.Pers_Imagen;

      this.user.UsuarioUser = this.dataUser.UsuarioUser;
      this.user.Usuario_Estado = this.dataUser.Usuario_Estado;
      this.user.Rol_Id = this.dataUser.Rol_Id;
      this.user.Usuario_Contra = this.decryptedAES(
        this.dataUser.Usuario_Contra
      );
      this.rol = {
        label: this.dataUser.Rol_Nombre,
        value: this.dataUser.Rol_Id
      };
      this.imgUser = this.person.Pers_Imagen;
      this.url = this.person.Pers_Imagen;
      // Validamos si el rol es operador, esto permite que los datos de los cursos y documentos del conductor se muestren en el fronent
      if (this.dataUser.Rol_Nombre === "Operador") {
        this.courseDriver.length = 0;
        var documents = JSON.parse(this.dataUser.courseDriver);
        documents.forEach ( element => {
          if(element.certificado !== 'NULL' && element.id_Curso !== 5){
            this.courseDriver.push({
              certificado: element.certificado === "NULL" ? null : {
                inactive: true,
                label: element.certificado,
                value: element.id_Curso
              },
              fecha_vencimiento: element.fecha_vencimiento === "1000-01-01" ? null : element.fecha_vencimiento,
              id_Curso: element.id_Curso === "NULL" ? null : element.id_Curso,
              id_Usuario: element.id_Usuario,
              inactive: element.inactive
            })
          }
        })
        this.optionsCursosCertificados.forEach(element => {
          this.courseDriver.forEach( cursoConductor => {
            if(element.value === cursoConductor.id_Curso){
              if(cursoConductor.inactive === 0){
                element.inactive = true
              }
            }
          })
        })
        this.documentsDriver.DocCond_CatLiceCond = this.dataUser.DocCond_CatLiceCond;
        this.documentsDriver.DocCond_LCFechaVenc = this.dataUser.DocCond_LCFechaVenc === '1000-01-01' ? null : this.dataUser.DocCond_LCFechaVenc;
      }
    },
    cancel() {
      this.allDataUser = {};
      optionRoles.length = 0;
      this.$emit("cancel", this.allDataUser);
    },
    encryptedAES(data) {
      var key = CryptoJS.HmacSHA1("sha256", "oW%c76+jb2");
      // var key = CryptoJS.enc.Utf8.parse(key);
      // var iv = CryptoJS.enc.Utf8.parse(iv);
      var iv = CryptoJS.HmacSHA1("sha256", "A)2!u467a^");

      var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
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
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.files = file;
      this.url = URL.createObjectURL(file);
      this.dialogAvatar = false;
    },
    addCourseDirver() {
      if(this.courseDriver.length <= this.optionsCursosCertificados.length){
        this.courseDriver.push({
          id_Curso: null,
          fecha_vencimiento: null,
          id_Usuario: null,
          certificado: null
        });
      } else {
        this.$q.notify({
          message: 'No puede agregar más cursos',
          type: 'warning'
        })
      }
    },
    selectedAvatar(img){
      this.avatar = img;
      this.url = img;
      this.dialogAvatar = false;
      this.person.Pers_Imagen = this.url;
    },
    // Valida si los selects tienen alguna opción seleccionada
    validateSelect (val) {
      if (val === null) {
        return 'Este campo es obligatorio, debe seleccionar una opción'
      }
    },
  }
};
</script>
<style scoped>
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
