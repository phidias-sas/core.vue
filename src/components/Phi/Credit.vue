<template>
	<div id="phi-credit">
		<section>
			<h2 v-show="credit.sequence"># {{credit.sequence}}</h2>
			<div class="types phi-card _z-0">
				<div class="label" v-if="credit.person"><span class="fa fa-user-o"></span>{{credit.person.firstname}} </div>
				<div class="label"><span class="fa fa-calendar-check-o"></span> Fecha {{credit.date|moment.format}}</div>
				<div class="label"><span class="fa fa-calendar-times-o"></span> Fecha contable {{credit.effective_date|moment.format}}</div>
				<div class="label"><span class="fa fa-money"></span> Total pagado {{credit.value|currency}}</div>
			</div>
		</section>

		<section v-if="credit.debits">
			<h2>{{ $t('Concepts paid') }}</h2>
			<div class="types phi-card _z-0">
				<div class="debit_content" v-for="debit in credit.debits">
					<div class="debit_name">
						<p><b>{{debit.period.name}} <small>#{{debit.sequence}}</small></b></p>
					</div>
					<div class="debit_prices" v-for="item in debit.distributions">
						<p>{{item.price.concept.name}} <small>({{item.price.name}})</small></p>
						<div class="balance">{{item.value|currency}}</div>
					</div>
				</div>
			</div>
		</section>

	</div>
</template>

<script>

export default{
  props: ['credit']
}
</script>

<style lang="scss" scoped>
#phi-credit {
	section {
		margin-bottom: 15px;

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

	.debit_content {
		padding: 10px;

		.debit_name {
			width: 100%;
		}

		.debit_prices {
			padding: 10px;
			display: flex;
			flex-wrap:wrap;
			justify-content: center;
			border-bottom: 1px dashed #ddd;
			transition:  all 0.2s ease;

			p{
				width: 100%;
			}

			.balance {
				flex-grow: 1;
				width: 200px;
				text-align: right;
			}
		}
		.debit_prices:nth-last-child(1) {
			border: none;
		}
		.debit_prices:hover {
			background: #eee;
		}
	}

}
</style>
