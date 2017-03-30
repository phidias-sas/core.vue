<template>
	<div id="state-debits-details" class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
				<h1>{{debit.period.name}}</h1>
			</div>
		</div>

		<!-- componente -->
		<div class="phi-page-contents">
			<phi-debit :debit="debit"></phi-debit>
		</div>
	</div>
</template>

<script>
import app from '../../store/app.js';
import PhiDebit from '../../components/Phi/Debit.vue';

export default{
	components: {PhiDebit},
	data() {
		return {
			debit: {}
		}
	},
	beforeRouteEnter(to, from, next) {
		app.api.get(`v3/debits/${to.params.debitId}`)
			.then(debit => next(vm => vm.debit = debit));
	}
}
</script>