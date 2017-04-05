<template>
	<div id="state-billing" class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
				<h1>{{ $t("Billing") }}</h1>
			</div>
		</div>

		<!-- Loading -->
		<mu-linear-progress color="#1c89b8" v-show="app.api.isLoading" />

		<div class="phi-page-contents">
			<mu-list>
				<mu-sub-header>Cobros pendientes</mu-sub-header>
				<mu-list-item v-for="pending in pendings" :title="pending.period.name">
					<mu-avatar src="../../static/img/debit.png" slot="leftAvatar"/>
					<router-link :to="{name: 'billing-debit-debitId', params:{debitId: pending.id}}" class="items">
						<div class="info">
							<p><span class="fa fa-clock-o"></span> Vence: {{pending.expiration_date|moment.format}}</p>
							<p><span class="fa fa-user-o"></span> {{pending.person.firstname}}</p>
						</div>
						<div class="balance" align="right">
							<b>{{pending.balance|currency}}</b> <br>
							<span class="interest"><span class="fa fa-warning" v-if="pending.interests"></span> {{pending.interests ? pending.interests.value : ''|currency}}</span>
						</div>
					</router-link>
				</mu-list-item>
			</mu-list>


			<!-- pendings -->
			<!-- <section v-if="pendings.length">
				<h2>Cobros pendientes</h2>
				<div class="types phi-card _z-0">
					<ul class="list">
						<li v-for="pending in pendings">
							<router-link :to="{name: 'billing-debit-debitId', params:{debitId: pending.id}}">
								<div class="col info">
									<p><b>{{pending.period.name}} <small>#{{pending.sequence}}</small></b></p>
									<p class="dato"><span class="fa fa-clock-o"></span> {{pending.expiration_date|moment.format}}</p>
									<p class="dato"><span class="fa fa-user-o"></span> {{pending.person.firstname}}</p>
								</div>
								<div class="col balance" align="right">
									<b>{{pending.balance|currency}}</b> <br>
									<span class="interest"><span class="fa fa-warning" v-if="pending.interests"></span> {{pending.interests ? pending.interests.value : ''|currency}}</span>
								</div>
							</router-link>
						</li>
					</ul>
				</div>
			</section> -->

			<!-- pagos recientes -->
			<!-- <section v-if="recent.length">
				<h2>Pagos recientes</h2>
				<div class="types phi-card _z-0">
					<ul class="list">
						<li v-for="payment in recent">
							<router-link :to="{name: 'billing-credit-creditId', params:{creditId: payment.id}}">
								<div class="col info">
									<p><b>{{payment.method.name}} <small>#{{payment.sequence}}</small></b></p>
									<p class="dato"><span class="fa fa-clock-o"></span> {{payment.date|moment.format}}</p>
									<p class="dato" v-if="payment.person"><span class="fa fa-user-o"></span> {{payment.person|person}}</p>
								</div>
								<div class="col balance" align="right">
									<b>{{payment.value|currency}}</b>
								</div>
							</router-link>
						</li>
					</ul>
				</div>
			</section> -->

			<!-- pagos por aplicar -->
			<!-- <section v-if="unapplied.length">
				<h2>Pagos por aplicar</h2>
				<div class="types phi-card _z-0">
					<ul class="list">
						<li v-for="payment in unapplied">
							<router-link :to="{name: 'billing-credit-creditId', params:{creditId: payment.id}}">
								<div class="col info">
									<p><b><span class="fa fa-thumb-tack"></span> {{payment.method.name}}</b></p>
									<p class="dato"><span class="fa fa-clock-o"></span> {{payment.date|moment.format}}</p>
									<p class="dato" v-if="payment.person"><span class="fa fa-user-o"></span> {{payment.person|person}}</p>
								</div>
								<div class="col balance" align="right">
									<b>{{payment.balance|currency}}</b>
								</div>
							</router-link>
						</li>
					</ul>
				</div>
			</section> -->
		</div>

	</div>
</template>

<script>
import app from '../../store/app.js';

export default{
	data() {
		return {
			app,
			recent: 	[],
			unapplied: 	[],
			pendings:  	[],
			personId: 	this.$route.params.personId,
		}
	},

	mounted(){
		// pendings
		app.api.get(`v3/people/${this.personId}/billing/debits/pending`)
		.then(data => {
			this.pendings = data;
		});

		// recent
		app.api.get(`v3/people/${this.personId}/billing/credits?limit=5`)
		.then(data => {
			this.recent = data;
		});

		// unapplied
		app.api.get(`v3/people/${this.personId}/billing/credits?limit=5&balance=true`)
		.then(data => {
			this.unapplied = data;
		});
	}
}
</script>

<style lang="scss" scoped>
	.items {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		flex-content: justify;
		border-bottom: 1px dashed #ccc;

		.info {
			margin: 2px;
			flex-grow: 5;
			font-size: 13px;
			line-height: 20px;
			color: rgba(0, 0, 0, .87);
		}

		.balance {
			margin: 2px;
			flex-grow: 1;
			color: green;
			.interest {
				color: red;
				font-size: 13px;
				background: #EEE;
			}
		}
	}
</style>