<template>
  <div id="state-credit-details" class="phi-page">
    <div class="phi-page-cover">
      <div class="phi-page-toolbar">
        <button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
        <h1>{{method.name}}</h1>
      </div>
    </div>
    <!-- componente -->
    <div v-if="loading" class="loading">
      <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
    </div>
    <div v-else>
      <phi-credit :id="$route.params.creditId" :model="credit"></phi-credit>
    </div>

  </div>
</template>
<script>


import app from '../../store/app.js'
import PhiCredit from '../../components/Phi/Credit.vue';

export default{
  data() {
    return {
      credit: null,
      method: {},
      loading: true
    }
  },

  components: {
    PhiCredit
  },

  mounted(){
    app.api.get(`v3/credits/${this.$route.params.creditId}`)
    .then(data => {
      this.credit  = data;
      this.method = data.method;
      if (data){
        this.loading = false;
      }else{
        this.loading = true;
      }
    });
  }

}
</script>

<style lang="scss" scoped>
  #state-credits-details{

  }
</style>
