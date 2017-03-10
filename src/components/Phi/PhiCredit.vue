<template>
  <div id="phi-credit">
        <h2>{{id}}</h2>
        <div class="types phi-card _z-0">
            <ul class="list">
              <li v-for="price in credit.prices" >
                  <div class="info">
                    <p>
                        <b>{{price.value}}</b> <small>#{{price.debit.sequence}}</small>
                    </p>
                  </div>
                  <div class="balance">
                    <p class="dato">
                        <span class="fa fa-money-o"></span><b>0000</b> <br>
                    </p>
                  </div>
              </li>
            </ul>
        </div>
  </div>
</template>

<script>
import app from '../../store/app.js'

export default{
  props: ['id'],

  data() {
    return {
      credit: {}
    }
  },


  mounted(){
    app.api.get(`v3/credits/${this.id}`)
    .then(data => {
      this.credit  = data;
    });
  }
}

</script>

<style lang="scss" scoped>

</style>
