<template>
    <div id="state-billing-credits" class="phi-page">

        <div class="phi-page-cover">
            <div class="phi-page-toolbar">
                <button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
                <h1>Consolidado de tesorería</h1>
            </div>
        </div>

        <div class="phi-page-contents">
            <section>
                <h2>Pagos recientes</h2>

                    <!-- Loading is true -->
                <div v-if="loading1" class="loading">
                  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                </div>


                <div class="types phi-card _z-0">
                    <ul class="list">
                    <li v-for="payment in recent" >
                        <router-link :to="{name: 'billing-credit-creditId', params:{creditId: payment.id}}">
                          <div class="info">
                            <p>
                                <b>{{payment.method.name}}</b> <small>#{{payment.sequence}}</small>
                            </p>
                            <p class="dato">
                                <span class="fa fa-user-o"></span> <small>{{payment.person|person}}</small>
                            </p>
                            <p class="dato">
                                <span class="fa fa-clock-o"></span> <small>{{payment.date|moment.format}}</small>
                            </p>
                          </div>
                          <div class="balance">
                            <p class="dato">
                                <span class="fa fa-money-o"></span><b>{{payment.value}}</b> <br>
                            </p>
                          </div>
                        </router-link>
                      </li>
                    </ul>
                </div>
            </section>
            <br/>
            <section>
                <h2>Pagos por aplicar</h2>

                <!-- Loading is true -->
                <div v-if="loading2" class="loading">
                  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                </div>

                <div class="types phi-card _z-0">
                    <ul class="list">
                        <router-link  v-for="payment in unapplied" :to="{name: 'billing-credit-creditId', params:{creditId: payment.id}}" tag="li">
                            <p>
                                <span class="fa fa-thumb-tack"></span> {{payment.method.name}} <br>
                                <small>{{payment.person|person}}</small>
                            </p>
                            <p>
                                <b>{{payment.balance}}</b> <br>
                                <small>{{payment.date|moment.format}}</small>
                            </p>
                        </router-link>
                    </ul>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import app from '../../store/app.js'

export default{
  data() {
    return {
      recent: [],
      unapplied: [],
      loading1: true,
      loading2: true
    }
  },
  mounted(){
    // recent
    app.api.get(`v3/people/${app.user.id}/billing/credits?limit=5`)
    .then(data => {
      this.recent = data;
      if (data){
        this.loading1 = false;
      }else{
        this.loading1 = true;
      }
    });

    // unapplied
    app.api.get(`v3/people/${app.user.id}/billing/credits?limit=5&balance=true`)
    .then(data => {
      this.unapplied = data;
      if (data){
        this.loading2 = false;
      }else{
        this.loading2 = true;
      }
    });

  }
}
</script>

<style lang="scss" scoped>
  #state-billing-credits{
    section {
      h2 {
        color: #666;
        font-size: 0.8em;
        font-weight: 1em;
        margin-bottom: 0.5em;
        text-transform: uppercase;
      }
      .list{
        margin: 0;
        padding: 0;
        border: 0;
        list-style: none;
        li{
          border-bottom: 1px dashed #ccc;
          a{
            padding: 8px;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            transition: all 0.2s ease;
            .info{
              flex-grow: 1;
              .dato{
                color: #666;
                margin: 5px;
                font-size: 13px;
                margin-left: 15px;
              }
            }
            .balance{
              flex-grow: 1;
              color: green;
              font-weight: bold;
              text-align: right;
              .interest{
                color:red;
                font-size: 11px;
                background: #f2f2f2;
              }
            }
          }
        }
        li:nth-last-child(1){
          border-bottom: none;
        }
        li:hover{
          background: #F5F5F5;
        }
      }
    }

    .loading{
      width: 100%;
      font-size: 15px;
      margin-top: 15px;
      text-align: center;
    }
  }
</style>
