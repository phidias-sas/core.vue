<template>
  <div id="state-credit-details" class="phi-page">
    <div class="phi-page-cover">
      <div class="phi-page-toolbar">
        <button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
        <h1>{{method.name}}</h1>
      </div>
    </div>
    <!-- componente -->
    <phi-credit :id="$route.params.creditId"></phi-credit>

  </div>
</template>
<script>


import app from '../../store/app.js'
import PhiCredit from '../../components/Phi/PhiCredit.vue';

export default{
  data() {
    return {
      credit: {},
      method: {}
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
    });
  }

}
</script>

<style lang="scss" scoped>
  #state-credits-details{

  }
</style>
