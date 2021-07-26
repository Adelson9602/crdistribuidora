<template>
  <div>
    <q-dialog v-model="dialog_enable" persistent>
      <q-card v-model="icon" class="q-pa-md">
        <q-card-section class="row items-center q-pa-none">
          <div class="text-h6">
            <q-icon name="warning" class="text-orange" style="font-size: 3rem;" />
            {{title}}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="cancelEdit" />
        </q-card-section>
        <q-card-section>
          {{msg}}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat @click="cancelEdit" color="white" text-color="primary" label="Cancelar" v-close-popup />
          <q-btn @click="enableItem" color="primary" text-color="white" :label="title" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'ComponentDialogEnable',
  data () {
    return {
      dialog_enable: false,
      enableEstate: false,
      msg: null,
      icon: false,
      title: null,
    }
  },
  props: ['dialog', 'options_dialog'],
  watch: {
    dialog(){
      this.dialog_enable = this.dialog;
      this.title = this.options_dialog.title;
      this.msg = this.options_dialog.msg;
    }
  },
  methods: {
    enableItem() {
      this.$emit('changeStatus');
    },
    cancelEdit(){
      this.$emit('cancel', this.dialog_enable)
    }
  },
}
</script>
