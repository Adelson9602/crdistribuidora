<template>
  <div>
    <q-dialog v-model="dialogEnable" persistent>
      <q-card v-model="icon">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            <q-icon name="warning" class="text-orange" style="font-size: 4rem;" />
            {{ enableEstate ? title : title }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          {{msgEnable}}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn push @click="cancelEdit" color="white" text-color="primary" label="Cancelar" v-close-popup />
          <q-btn push @click="enableItem" color="primary" text-color="white" :label="`${ enableEstate ? 'Habilitar' : 'Inhabilitar' }`" v-close-popup />
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
      dialogEnable: false,
      enableEstate: false,
      msgEnable: null,
      icon: false,
    }
  },
  props: ['dialog', 'state', 'msg', 'title'],
  watch: {
    dialog(){
      this.dialogEnable = this.dialog;
    },
    state(){
      this.enableEstate = this.state;
    },
    msg(){
      this.msgEnable = this.msg;
    },
  },
  methods: {
    enableItem() {
      this.$emit('enable');
    },
    cancelEdit(){
      this.$emit('cancel', this.dialogEnable)
    }
  },
}
</script>
