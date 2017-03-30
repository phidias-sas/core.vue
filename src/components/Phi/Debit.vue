<template>
	<div class="phi-debit">
		<section>
			<h2 v-show="debit.sequence"># {{debit.sequence}}</h2>
			<h2 v-show="!debit.sequence">{{ $t('not issued') }}</h2>
			<div class="types phi-card _z-0">
				<div class="label" v-if="debit.person"><span class="fa fa-user-o"></span> {{debit.person.firstname}}</div>
				<div class="label"><span class="fa fa-calendar-check-o"></span> Expedido el {{debit.issue_date|moment.format}}</div>
				<div class="label"><span class="fa fa-calendar-times-o"></span> Vence el {{debit.expiration_date|moment.format}}</div>
				<div class="label"><span class="fa fa-money"></span> Saldo a pagar {{debit.balance|currency}}</div>
			</div>
		</section>

		<section v-if="debit.prices">
			<h2>conceptos a pagar</h2>
			<div class="types phi-card _z-0">
				<div class="concepts" v-for="price in debit.prices">
					<div class="concept_name">
						<p>{{price.concept != price.name ? price.concept : ''}} {{price.name}}</p>
						<p v-if="price.observations">"{{price.observations}}"</p>
					</div>
					<div class="balance">{{price.balance|currency}}</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
export default{
	props: ['debit'],
}
</script>

<style lang="scss" scoped>

.phi-debit {
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
