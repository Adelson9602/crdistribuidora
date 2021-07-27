<template>
  <div class="q-pa-none">
    <q-form @submit="onSubmit">
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "UserFormComponent",  
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  computed: {},
  methods: {
    
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