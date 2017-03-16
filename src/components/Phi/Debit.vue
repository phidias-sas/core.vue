<template>
	<div id="phi-debit">
		<ons-progress-bar indeterminate v-show="isLoading"></ons-progress-bar>

		<div v-show="!isLoading">
			<section>
				<h2># {{debit.sequence}}</h2>
				<div class="types phi-card _z-0">
					<div class="label"><span class="fa fa-user-o"></span> {{person.firstname}}</div>
					<div class="label"><span class="fa fa-calendar-check-o"></span> Expedido el {{debit.issue_date|moment.format}}</div>
					<div class="label"><span class="fa fa-calendar-times-o"></span> Vence el {{debit.expiration_date|moment.format}}</div>
					<div class="label"><span class="fa fa-money"></span> Saldo a pagar {{debit.balance|currency}}</div>
				</div>
			</section>

			<!-- <div class="button-pay">
				<button>Pagar</button>
			</div> -->

			<br><br>

			<section>
				<h2>conceptos a pagar</h2>
				<div class="types phi-card _z-0">
					<div class="concepts" v-for="price in prices">
						<div class="concept_name">
							<p>{{price.concept != price.name ? price.concept : ''}} {{price.name}}</p>
							<p v-if="price.observations">"{{price.observations}}"</p>
						</div>
						<div class="balance">{{price.balance|currency}}</div>
					</div>
				</div>
			</section>
		</div>

	</div>
</template>

<script>
import app from '../../store/app.js';

export default{
	props: ['id'],

	data () {
		return {
			debit: {},
			person: {},
			prices: {},
			isLoading: true,
		}
	},

	mounted () {
		app.api.get(`v3/debits/${this.id}`)
			.then(datos => {
				this.debit  = datos;
				this.person = datos.person;
				this.prices = datos.prices;
				this.isLoading = !datos;
			});
	}
}
</script>

<style lang="scss" scoped>

#phi-debit {
	section {
		h2 {
			color: #666;
			font-size: 0.8em;
			font-weight: 1em;
			margin-bottom: 0.5em;
			text-transform: uppercase;
		}
		.label {
			padding: 7px;

			.fa {
				margin-right: 15px;
			}
		}
	}

	// .button-pay {
	// 	right: 0;
	// 	width: 140px;
	// 	padding: 10px;
	// 	position: fixed;
	// 	text-align: right;
	// 	margin-top: 15px;
	// 	background: #2196F3;
	// 	margin-bottom: 15px;
	// 	border-radius: 38px 0px 0px 38px;
	// 	-webkit-transition: all 0.3s ease;
	// 	-o-transition: all 0.3s ease;
	// 	transition: all 0.3s ease;

	// 	button {
	// 		width: 80%;
	// 		color: #fff;
	// 		border: none;
	// 		font-size: 18px;
	// 		cursor: pointer;
	// 		background: transparent;
	// 	}
	// }
	// .button-pay:hover {
	// 	width: 150px;
	// 	padding-left: 35px;
	// }

	// conceptos

	.concepts {
		padding: 10px;
		display: flex;
		flex-wrap:wrap;
		justify-content: center;
		border-bottom: 1px dashed #ddd;
		transition:  all 0.2s ease;

		.concept_name {
			flex-grow: 1;
			width: 300px;

			p:nth-child(2) {
				font-size: 14px;
				font-style: italic;
			}
		}
		.balance {
			flex-grow: 1;
			width: 200px;
			text-align: right;
		}
	}
	.concepts:nth-last-child(1) {
		border: none;
	}
	.concepts:hover {
		background: #eee;
	}

}

</style>
