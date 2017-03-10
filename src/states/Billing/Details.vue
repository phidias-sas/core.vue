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
	import PhiDebit from '../../components/Phi/PhiDebit.vue';
	var url = "http://localhost/01/api.project/public/index.php/v3/debits/";

	export default{
		data() {
			return {
				period: {}
			}
		},

		mounted(){
			//fetch(url + this.$route.params.debitId)
			app.api.get(`v3/debits/${this.$route.params.debitId}`)
      //.then(response => response.json())
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
