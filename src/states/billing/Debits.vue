<template>
	<div id="state-billing-debits" class="phi-page">

		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
				<h1>Consolidado de tesorería</h1>
			</div>
		</div>

		<div class="phi-page-contents">
			<section>
				<h2>Cobros pendientes</h2>
				<div class="types phi-card _z-0">
					<ul>
						<router-link  v-for="pending in pendings" :to="{name: 'Details', params:{id: pending.id}}" tag="li">
							<p>
								<span class="fa fa-thumb-tack"></span> {{pending.period.name}} <br>
								<small>{{pending.person|person}}</small>
							</p>
							<p>
								<b>{{pending.balance}}</b> <br>
								<small>{{pending.expiration_date|moment.format}}</small>
							</p>
						</router-link>
					</ul>
				</div>

				<ul>
					<li>
						<p>Total:</p>
						<p>$000.000</p>
					</li>
				</ul>
			</section>
		</div>

	</div>
</template>

<script>
var url = "http://localhost/01/api.project/public/index.php/v3/people/920";
import app from '../../store/app.js'

export default{
	data() {
		return {
			payed: [],
			planned: [],
			pendings: []
		}
	},
	mounted(){
		// pendings
		fetch(url +'/billing/debits/pending')
		.then(response => response.json())
		.then(datos => {
			this.pendings = datos;
		});

		// payed
		fetch(url +'/billing/debits/payed')
		.then(response => response.json())
		.then(datos => {
			this.payed = datos;
		});

		// planned
		fetch(url +'/billing/debits/planned')
		.then(response => response.json())
		.then(datos => {
			this.planned = datos;
		});
	}
}
</script>

<style lang="scss" scoped>
	#state-billing-debits{
		section {
			h2 {
				color: #666;
				font-size: 0.8em;
				font-weight: 1em;
				margin-bottom: 0.5em;
				text-transform: uppercase;
			}
			ul{
				margin: 0;
				padding: 0;
				list-style: none;
				li{
					padding: 10px;
					display: block;
					cursor: pointer;
					overflow: hidden;
					-webkit-box-sizing: border-box;
					-moz-box-sizing: border-box;
					box-sizing: border-box;
					-webkit-transition: all 0.2s ease;
					-o-transition: all 0.2s ease;
					transition: all 0.2s ease;
					.fa-thumb-tack{
						color: #F44336;
						font-size: 18px;
						margin-right: 10px;
						transform: rotate(25deg);
					}
					small{ 
						color: #666;
					}
					p:nth-child(1){
						float: left;
					}
					p:nth-child(2){
						float: right;
					}
				}
				li:hover{
					background: #EEEEEE;
				}
			}
		}

	}
</style>