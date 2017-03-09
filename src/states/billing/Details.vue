<template>
	<div id="state-debits-details" class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
				<h1>{{period.name}}</h1>
			</div>
		</div>
		
		<!-- componente -->
		<phi-debit :id="$route.params.debitId"></phi-debit>
	</div>
</template>

<script>
import app from '../../store/app.js';
import PhiDebit from '../../components/Phi/PhiDebit.vue';

export default{
	data() {
		return {
			period: {}
		}
	},

	mounted(){
		app.api.get(`v3/debits/${this.$route.params.debitId}`)
			.then(datos => {
				this.period = datos.period;
			});
	},

	components: {
		PhiDebit
	}
}
</script>

<style lang="scss" scoped>

#state-debits-details{

}

</style>