<template>
	<div id="state-debits-details" class="phi-page">

		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
				<h1>{{period.name}}</h1>
			</div>
		</div>
		
	</div>
</template>

<script>
var url = "http://localhost/01/api.project/public/index.php/v3/debits/";
export default{
	data() {
		return {
			debit: {},
			period: {},
			person: {}
		}
	},
	mounted(){
		fetch(url + this.$route.params.id)
		.then(response => response.json())
		.then(datos => {
			this.debit  = datos;
			this.period = datos.period;
			this.person = datos.person;
		});
	}

}
</script>

<style lang="scss" scoped>
	#state-debits-details{

	}
</style>