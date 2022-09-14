<template>
  <q-page padding class="q-pa-md">
    <q-form>
      <div class="row q-col-gutter-y-md">
        <div class="col-xs-12 q-pa-sm q-gutter-y-md">
          <div class="text-h6">Datos de la cuenta</div>
        </div>
      </div>
      <div class="row q-col-gutter-y-md">
        <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
          <p class="section__p"><b>Foto de perfíl</b></p>
          <div class="row col-xs-12 justify-center profile-img">
            <q-avatar size="200px" square class="q-mb-md">
              <img v-if="url" :src="url" />
            </q-avatar>
            <input type="file" @change="onFileChange" id="idImgUser" />
            <q-btn
              label="Seleccionar imágen"
              flat
              @click="dialogAvatar = true"
            />
          </div>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
          <p class="section__p"><b>Datos básicos</b></p>
          <q-dialog v-model="dialogAvatar"
            ><!-- Empieza el dialog del avatar -->
            <q-card>
              <q-toolbar>
                <q-avatar size="70px">
                  <q-icon
                    name="mdi-account-circle"
                    size="70px"
                    color="primary"
                  />
                </q-avatar>

                <q-toolbar-title class="text-toolbar"
                  ><span class="text-weight-bold">Sube</span> una foto o
                  <span class="text-weight-bold">selecciona</span> un
                  avatar</q-toolbar-title
                >

                <q-btn flat round dense icon="close" v-close-popup />
              </q-toolbar>
              <q-separator />
              <q-card-section class="q-gutter-md row justify-center">
                <q-avatar size="70px" class="text-center bg-grey">
                  <label for="idImgUser">Subir foto</label>
                </q-avatar>
                <q-avatar
                  size="70px"
                  @click="
                    selectedAvatar(`${urlApi}/adjuntos/men_avatar/m${item}.svg`)
                  "
                  v-for="item in 24"
                  :key="`m${item}`"
                  class="avatar"
                >
                  <img :src="`${urlApi}/adjuntos/men_avatar/m${item}.svg`" />
                </q-avatar>
                <q-avatar
                  v-for="item in 24"
                  :key="`f${item}`"
                  size="70px"
                  class="avatar"
                  @click="
                    selectedAvatar(
                      `${urlApi}/adjuntos/male_avatar/f${item}.svg`
                    )
                  "
                >
                  <img :src="`${urlApi}/adjuntos/male_avatar/f${item}.svg`" />
                </q-avatar>
              </q-card-section>
            </q-card> </q-dialog
          ><!-- Finaliza el dialog del avatar -->
          <q-input
            class="section__input"
            v-model="dataUsuario.ID_Usuario"
            filled
            type="text"
            label="Usuario"
            disable
            hint="Este será su usuario"
          />
          <q-select
            class="section__input"
            v-model="rol"
            filled
            :options="options_role"
            hint="Rol"
            disable
          />
          <q-input
            class="section__input"
            v-model="dataUsuario.nombres"
            filled
            type="text"
            label="Nombre"
            hint="Nombre"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
          <p class="section__p"><b>Contacto</b></p>
          <q-input
            class="section__input"
            v-model="dataUsuario.telefono"
            filled
            type="number"
            label="Teléfono principal"
            hint="Teléfono principal"
          />
          <q-input
            class="section__input"
            v-model="dataUsuario.email"
            filled
            type="email"
            label="Email"
            hint="Dirección de correo electrónico"
          />
          <q-input
            class="section__input"
            v-model="dataUsuario.direccion"
            filled
            type="text"
            label="Dirección"
            hint="Dirección"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm q-gutter-y-md">
          <p class="section__p"><b>Contraseña</b></p>
          <q-input
            class="section__input"
            v-model="dataUsuario.Password"
            filled
            :type="isPwd ? 'password' : 'text'"
            autocomplete="current-password"
            label="Contraseña"
            hint="Ingrese la contraseña"
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
            class="section__input"
            v-model="dataUsuario.repeat_pass"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Confirmar contraseña"
            hint="Confirmar la Contraseña"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <p class="section__p"><b>Código de confirmación</b></p>
          <q-input
            class="section__input"
            v-model="dataUsuario.Codigo"
            filled
            :type="isPwd ? 'password' : 'text'"
            autocomplete="current-password"
            label="Código"
            hint="Ingrese el código"
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
            class="section__input"
            v-model="dataUsuario.repeat_codigo"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Confirmar Código"
            hint="Confirmar el código"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-col-gutter-y-md">
        <div class="col-xs-12">
          <q-separator></q-separator>
        </div>
        <div class="col-xs-12 col-sm-3 q-pa-sm q-gutter-y-md"></div>
        <div class="col-xs-12 col-sm-3 q-pa-sm q-gutter-y-md"></div>
        <div class="col-xs-12 col-sm-3 q-pa-sm q-gutter-y-md"></div>
        <div class="col-xs-12 col-sm-3 q-pa-sm q-gutter-y-md">
          <q-btn
            class="full-width"
            label="EDITAR"
            type="submit"
            @click.prevent="onSubmit"
            color="primary"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { date } from "quasar";
import userDetail from "components/Access/ComponentUserDetail";
import { mapActions, mapMutations, mapState } from "vuex";

import CryptoJS from "crypto-js";
const optionUsuario = [];

export default {
  name: "PageProfile",
  components: {
    userDetail
  },
  data() {
    return {
      base: process.env.__BASE__,
      renderComponent: true,
      dialogAvatar: false,
      isPwd: null,
      options_role: optionUsuario,
      rol: "Seleccione un Rol",
      formUser: false,
      dataUsuario: {
        Foto: null,
        ID_Usuario: null,
        Password: null,
        repeat_pass: null,
        Codigo: null,
        repeat_codigo: null,
        nombres: null,
        apellidos: null,
        email: null,
        telefono: "",
        direccion: null
      },
      files: null,
      url: null,
      urlApi: null,
      phones: null
    };
  },
  computed: {
    ...mapState("auth", ["user_logged"]),
    data_user() {
      return this.user_logged;
    }
  },
  mounted() {
    this.urlApi = process.env.__URLAPI__;
    // this.editUserData();
    this.getData();
  },
  methods: {
    ...mapActions("access", [
      // "GetDataUser",
      "saveFile",
      "InsertUpdatePersonal",
      "InsertUpdateUsuario"
    ]),
    ...mapActions("auth", ["login"]),
    ...mapMutations("auth", ["setUser"]),
    getData() {
      this.$q.loading.show({
        message: "Obteniendo datos de usuario, por favor espere..."
      });
      try {
        this.dataUsuario = {
          Foto: this.data_user.Per_Imagen,
          ID_Usuario: this.data_user.Per_Num_documento,
          telefono: this.data_user.Per_Telefono,
          nombres: this.data_user.Per_Nombre,
          email: this.data_user.Per_Email,
          direccion: this.data_user.Per_Direccion
        };
        this.rol = {
          label: this.data_user.Rol_Descripcion,
          value: this.data_user.Rol_Id
        };
        this.url = this.data_user.Per_Imagen;
        this.renderComponent = true;
      } catch (e) {
        console.log(e);
        if (e.message === "Error de conexión") {
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
    reload() {
      this.renderComponent = false;
    },
    async onSubmit() {
      if (this.dataUsuario.Password != this.dataUsuario.repeat_pass) {
        this.$q.notify({
          color: "negative",
          icon: "warning",
          message: "Las contraseñas no son iguales"
        });
      } else if (
        this.dataUsuario.Password == this.dataUsuario.repeat_pass &&
        this.dataUsuario.Codigo != this.dataUsuario.repeat_codigo
      ) {
        this.$q.notify({
          color: "negative",
          icon: "warning",
          message: "Los códigos de confirmación son iguales"
        });
      } else {
        this.$q.loading.show({
          message: "Actualizando datos del usuario, por favor espere..."
        });
        try {
          await this.apiRegister();
        } catch (e) {
          console.log(e);
          if (e.message === "Error de conexión") {
            e = e.message;
          } else if (e.message === "Request failed with status code 404") {
            e = "Error 404 al hacer la petición al servidor";
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
    },
    async apiRegister() {
      if (this.dataUsuario.Password) {
        this.dataUsuario.Password = this.aesEncrypt(this.dataUsuario.Password);
      } else {
        this.dataUsuario.Password = this.data_user.Usu_Clave_ppl;
      }
      if (this.dataUsuario.Codigo) {
        this.dataUsuario.Codigo = this.aesEncrypt(this.dataUsuario.Codigo);
      } else {
        this.dataUsuario.Codigo = this.data_user.Usu_Clave_verificacion;
      }

      const formData = new FormData();
      if (this.files !== null) {
        formData.append(
          "files",
          this.files,
          this.files.name.toLowerCase().replace(/ /gi, "_")
        );
        await this.saveFile(formData)
          .then(res => {
            var nameImage = res.data.url.split("/");
            this.url =
              `${process.env.__URLAPI__}/adjuntos/` +
              this.files.name.toLowerCase().replace(/ /gi, "_");
            console.log(this.url);
            if (res.data.saved) {
              let dataPersonal = {
                base: this.base,
                Per_Num_documento: this.data_user.Per_Num_documento,
                Per_Nombre: this.dataUsuario.nombres,
                Td_Id: this.data_user.Td_Id, // Traer en login
                Per_Direccion: this.dataUsuario.direccion,
                Per_Telefono: this.dataUsuario.telefono,
                Per_Email: this.dataUsuario.email,
                Car_Id: this.data_user.Car_Id,
                Per_Imagen: this.url,
                Per_Estado: this.data_user.Usu_Estado
              };
              console.log(dataPersonal);
              this.InsertUpdatePersonal(dataPersonal).then(res => {
                console.log(res.data);
              });

              let dataUsuario = {
                base: this.base,
                Usu_Login: this.data_user.Usu_Login,
                Usu_Clave_ppl: this.dataUsuario.Password,
                Usu_Clave_verificacion: this.dataUsuario.Codigo,
                Rol_Id: this.data_user.Rol_Id,
                Per_Num_documento: this.data_user.Per_Num_documento,
                Usu_Estado: this.data_user.Usu_Estado,
                Usu_User_control: this.data_user.Per_Num_documento
              };
              // if(this.dataUsuario.Password == null) {
              //   dataUsuario.Password = this.data_user.Usu_Clave_ppl;
              // }
              console.log(dataUsuario);
              this.InsertUpdateUsuario(dataUsuario).then(res => {
                console.log(res.data);
              });
              this.$q.notify({
                type: "positive",
                message: "Datos actualizados"
              });
            }
          })
          .catch(e => console.log(e));
      } else {
        let dataPersonal = {
          base: this.base,
          Per_Num_documento: this.data_user.Per_Num_documento,
          Per_Nombre: this.dataUsuario.nombres,
          Td_Id: this.data_user.Td_Id, // Traer en login
          Per_Direccion: this.dataUsuario.direccion,
          Per_Telefono: this.dataUsuario.telefono,
          Per_Email: this.dataUsuario.email,
          Car_Id: this.data_user.Car_Id,
          Per_Imagen: this.url,
          Per_Estado: this.data_user.Usu_Estado
        };
        console.log(dataPersonal);
        const resInsertUpdatePersonal = await this.InsertUpdatePersonal(
          dataPersonal
        )
          .then(res => {
            return res.data;
          })
          .catch(e => {
            throw new Error(e.message);
          });
        console.log({
          msg: "Respuesta insert update personal",
          data: resInsertUpdatePersonal
        });
        let dataUsuario = {
          base: this.base,
          Usu_Login: this.data_user.Usu_Login,
          Usu_Clave_ppl: this.dataUsuario.Password,
          Usu_Clave_verificacion: this.dataUsuario.Codigo,
          Rol_Id: this.data_user.Rol_Id,
          Per_Num_documento: this.data_user.Per_Num_documento,
          Usu_Estado: this.data_user.Usu_Estado,
          Usu_User_control: this.data_user.Per_Num_documento
        };
        console.log(dataUsuario);
        const resInsertUpdateUsuario = await this.InsertUpdateUsuario(
          dataUsuario
        )
          .then(res => {
            return res.data;
          })
          .catch(e => {
            throw new Error(e.message);
          });
        console.log({
          msg: "Respuesta insert update user",
          data: resInsertUpdateUsuario
        });

        this.$q.notify({
          type: "positive",
          message: "Datos actualizados"
        });
      }
      let setDataUser = {
        base: this.base,
        user: this.data_user.Usu_Login,
        password: this.dataUsuario.Password
      };
      console.log(setDataUser);
      //PostLogin es la acción, está definida en mapActions de la tienda de datos de vuex
      const resPostLogin = await this.login(setDataUser)
        .then(res => {
          return res.data;
        })
        .catch(e => {
          throw new Error(e.message);
        });
      this.dataUsuario = {};
      console.log(resPostLogin);
      this.setUser({});
      this.setUser(resPostLogin.data);
      await this.getData();
      this.files = null;
      this.$emit("reload");
    },
    aesEncrypt(txt) {
      const cipher = this.CryptoJS.AES.encrypt(
        txt,
        CryptoJS.enc.Utf8.parse(process.env.__KEY__),
        {
          iv: CryptoJS.enc.Utf8.parse(process.env.__IV__),
          mode: CryptoJS.mode.CBC
        }
      ).toString();
      return cipher.toString();
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.files = file;
      this.url = URL.createObjectURL(file);
      this.dialogAvatar = false;
    },
    selectedAvatar(img) {
      this.avatar = img;
      this.url = img;
      this.dialogAvatar = false;
      this.dataUsuario.Foto = this.url;
    }
  }
};
</script>

<style scoped>
.text-h6 {
  font-weight: bold;
  margin: 60px 0 20px;
}
.profile-img {
  border: 1px solid rgb(202, 202, 202);
  border-radius: 10px;
}
.avatar {
  cursor: pointer;
}
.profile-img {
  margin-top: 5px;
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
.text-toolbar {
  white-space: normal;
}
/* Estilos para los avatars */
.avatar:hover {
  transform: scale(0.9);
}
.section__p {
  margin-bottom: 0;
}
.section__input {
  margin-top: 5px;
}
</style>
