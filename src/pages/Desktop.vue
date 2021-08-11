<template>
  <div class="q-pa-md">
    <div class="row q-pt-sm content-card">
      <div class="q-pa-md col-xs-12 col-sm-6 col-md-3">
        <q-card class="my-card">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Total Sales</q-item-label>
                  <q-item-label class="number_card">34,251</q-item-label>
                  <q-item-label>
                    <q-icon
                      name="info"
                      color="positive"
                    /> Last Month
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-avatar
                    size="60px"
                    class="bg-primary-gradient"
                    text-color="white"
                    icon="trending_up"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
      <div class="q-pa-md col-xs-12 col-sm-6 col-md-3">
        <q-card class="my-card">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Total Leads</q-item-label>
                  <q-item-label class="number_card">35,588</q-item-label>
                  <q-item-label>
                    <q-icon
                      name="info"
                      color="positive"
                    /> Last Month
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-avatar
                    size="60px"
                    class="bg-danger-gradient"
                    text-color="white"
                    icon="mdi-rocket-launch"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
      <div class="q-pa-md col-xs-12 col-sm-6 col-md-3">
        <q-card class="my-card">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Total Profit</q-item-label>
                  <q-item-label class="number_card">35,588</q-item-label>
                  <q-item-label>
                    <q-icon
                      name="info"
                      color="positive"
                    /> Last Month
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-avatar
                    size="60px"
                    class="bg-secondary-gradient"
                    text-color="white"
                    icon="attach_money"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
      <div class="q-pa-md col-xs-12 col-sm-6 col-md-3">
        <q-card class="my-card">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Total Cost</q-item-label>
                  <q-item-label class="number_card">35,588</q-item-label>
                  <q-item-label>
                    <q-icon
                      name="info"
                      color="positive"
                    /> Last Month
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-avatar
                    size="60px"
                    class="bg-success-gradient"
                    text-color="white"
                    icon="work_outline"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      
    };
  },
  computed: {
  },
  created() {
  },
  methods: {
    
  }
};
</script>

<style scoped>
.my-card{
  height: 120px;
}
.number_card{
  font-weight: 600 !important;
  font-size: 1.5rem;
}
.bg-primary-gradient {
  background: linear-gradient(to bottom right, #9e88f5 0%, #6259ca 100%) !important;
}
.bg-danger-gradient {
  background-image: linear-gradient(to bottom right, #f1bf64 0%, #f71d36 100%) !important;
}
.bg-secondary-gradient {
  background: linear-gradient(to bottom right, #9070ff 0%, #ff5d9e 100%) !important;
}
.bg-success-gradient {
  background: linear-gradient(to bottom right, #4be8d4 0%, #129bd2 100%) !important;
}
</style>
