<template>
  <q-form  class="login100-form validate-form row q-gutter-y-md" @submit="onSubmit">
    <span class="login100-form-title">
      Inicio de sesión
    </span>
    <div class="col-xs-12">
      <q-input
        filled
        v-model="login.user"
        label="Usuario"
        :rules="[val => !!val || 'Ingrese el usuario']"
      >
        <template v-slot:prepend>
          <q-icon name="account_circle" />
        </template>
      </q-input>
    </div>
    <div class="col-xs-12">
      <q-input
        filled
        v-model="login.password"
        label="Contraseña"
        :type="isPwd ? 'password' : 'text'"
        :rules="[val => !!val || 'Ingrese la contraseña']"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
      </q-input>
    </div>
    <div class="container-login100-form-btn">
      <q-btn color="primary" label="inicar sesión" type="submit" class="login100-form-btn"/>
    </div>
  </q-form>
</template>
<script>
export default {
  name: "ComponentLoginForm",
  data() {
    return {
      login: {
        user: "",
        password: ""
      },
      isPwd: true
    };
  },
  methods: {
    onSubmit() {
      let password = this.aesEncrypt(this.login.password);
      this.login.password = password;
      this.$emit("onLogin", this.login);
    },
    aesEncrypt(txt) {
      const cipher = this.CryptoJS.AES.encrypt(txt, CryptoJS.enc.Utf8.parse(process.env.__KEY__), {
        iv: CryptoJS.enc.Utf8.parse(process.env.__IV__),
        mode: CryptoJS.mode.CBC
      }).toString()
      return cipher.toString()
    },
    aesDencrypt(txt) {
      const cipher = this.CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(process.env.__KEY__), {
        iv: CryptoJS.enc.Utf8.parse(process.env.__IV__),
        mode: CryptoJS.mode.CBC
      })
      return CryptoJS.enc.Utf8.stringify(cipher).toString()
    },
  }
};
</script>
<style scoped>
@media (max-width: 991.98px) {
  .btn-block {
    display: block;
  }
}
button {
  outline: none !important;
  border: none;
  background: transparent;
}

button:hover {
  cursor: pointer;
}

.limiter {
  width: 100%;
  margin: 0 auto;
}

.container-login100 {
  width: 100%;
  min-height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-image: url("../../statics/back-login.png");
  background-image: no-repeat;
  background-image: fixed;
  background-image: center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.login100-form {
  width: 290px;
  margin-top: 30px;
  z-index: 1000;
  position: relative;
}

.login100-form-title {
  font-family: Poppins-Bold;
  font-size: 24px;
  color: #333333;
  line-height: 1.2;
  text-align: center;

  width: 100%;
  display: block;
  padding-bottom: 30px;
}

/*------------------------------------------------------------------
[ Button ]*/
.container-login100-form-btn {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.login100-form-btn {
  font-family: Montserrat-Bold;
  font-size: 15px;
  line-height: 1.5;
  color: #fff;
  text-transform: uppercase;
  width: 100%;
  height: 50px;
  border-radius: 5px;
  background: rgb(74,98,220);
  background: linear-gradient(90deg, rgba(74,98,220,1) 0%, rgba(0,11,171,1) 52%, rgba(24,75,217,1) 100%);
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 25px;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.login100-form-btn:hover {
  background: #333333;
}

@media (max-width: 768px) {
  .login100-form {
    width: 100%;
  }
}

/* utils */
.p-t-12 {
  padding-top: 12px;
}
</style>
