<template>
  <div class="row">
    <div class="col-xs-12 q-gutter-md q-pb-md">
      <q-toggle v-model="mode" label="Visualización" :disable="true"/>
      <q-btn
        push
        color="white"
        text-color="primary"
        icon="picture_as_pdf"
        :disable="true"
      />
      <q-btn
        push
        color="white"
        text-color="green"
        icon="mdi-microsoft-excel"
        :disable="true"
      />
    </div>
    <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="n in 8" :key="n">
      <q-card>
        <q-item>
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" width="80%" />
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item v-for="n in 3" :key="n">
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentSkeletonTable',
  data () {
    return {
      mode: true,
    }
  }
}
</script>
<style scoped>
  .bg{
    background-color: none;
  }
</style>