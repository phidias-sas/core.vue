<template>
	<div id="phi-credit">
		<section>
			<h2># {{credit.sequence}}</h2>
			<div class="types phi-card _z-0">
				<div class="label" v-if="credit.person"><span class="fa fa-user-o"></span>{{credit.person.firstname}} </div>
				<div class="label"><span class="fa fa-calendar-check-o"></span> Fecha {{credit.date|moment.format}}</div>
				<div class="label"><span class="fa fa-calendar-times-o"></span> Fecha contable {{credit.effective_date|moment.format}}</div>
				<div class="label"><span class="fa fa-money"></span> Total pagado {{credit.value|currency}}</div>
			</div>
		</section>

		<section>
			<h2>conceptos pagados</h2>
			<div class="types phi-card _z-0">
				<div class="concepts" v-for="debit in credit.debits">
					<div class="concept_name">
						<p><b>{{debit.period.name}} <small>#{{debit.sequence}}</small></b></p>
						<div class="concepts" v-for="item in debit.distributions">
							<p>{{item.price.concept.name}} <small>({{item.price.name}})</small></p>
							<div class="balance">{{item.value|currency}}</div>
						</div>
					</div>
				</div>
			</div>
		</section>

	</div>
</template>

<script>
import app from '../../store/app.js'

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
			text-align: right;
			flex-grow: 1;
			width: 200px;
		}
	}
	.concepts:nth-last-child(1) {
		border: none;
	}
}
</style>
