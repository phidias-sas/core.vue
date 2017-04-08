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

			<!-- pendings -->
			<mu-list v-if="pendings.length">
				<mu-sub-header>Cobros pendientes</mu-sub-header>
				<router-link v-for="pending in pendings" :to="{name: 'billing-debit-debitId', params:{debitId: pending.id}}" >
					<mu-list-item :title="pending.period.name">
						<mu-avatar src="../../static/img/billing.png" slot="leftAvatar" style="background-color: #009688;" />
						<div class="document">
							<div class="info">
								<p><span class="fa fa-clock-o"></span> Vence: {{pending.expiration_date|moment.format}}</p>
								<p><span class="fa fa-user-o"></span> {{pending.person.firstname}}</p>
							</div>
							<div class="balance" align="right">
								<b>{{pending.balance|currency}}</b> <br>
								<span class="interest"><span class="fa fa-warning" v-if="pending.interests"></span> {{pending.interests ? pending.interests.value : ''|currency}}</span>
							</div>
						</div>
					</mu-list-item>
				</router-link>
			</mu-list>

			<!-- pagos recientes -->
			<mu-list v-if="recent.length">
				<mu-sub-header>Pagos recientes</mu-sub-header>
				<router-link v-for="payment in recent" :to="{name: 'billing-credit-creditId', params:{creditId: payment.id}}">
					<mu-list-item :title="payment.method.name">
						<mu-avatar src="../../static/img/billing.png" slot="leftAvatar" style="background-color: #FFFF00;"/>
						<div class="document">
							<div class="info">
								<p><span class="fa fa-calendar"></span> {{payment.date|moment.format}}</p>
								<p v-if="payment.person"><span class="fa fa-user-o"></span> {{payment.person.firstname}}</p>
							</div>
							<div class="balance" align="right">
								<b>{{payment.value|currency}}</b> <br>
							</div>
						</div>
					</mu-list-item>
				</router-link>
			</mu-list>

			<!-- pagos por aplicar -->
			<mu-list v-if="unapplied.length">
				<mu-sub-header>Pagos por aplicar</mu-sub-header>
				<router-link v-for="payment in unapplied" :to="{name: 'billing-credit-creditId', params:{creditId: payment.id}}">
					<mu-list-item :title="payment.method.name">
						<mu-avatar src="../../static/img/billing.png" slot="leftAvatar" style="background-color: #3F51B5;"/>
						<div class="document">
							<div class="info">
								<p><span class="fa fa-calendar"></span> {{payment.date|moment.format}}</p>
								<p v-if="payment.person"><span class="fa fa-user-o"></span> {{payment.person.firstname}}</p>
							</div>
							<div class="balance" align="right">
								<b>{{payment.balance|currency}}</b> <br>
							</div>
						</div>
					</mu-list-item>
				</router-link>
			</mu-list>
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
.document {
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
		}
	}
}
</style>