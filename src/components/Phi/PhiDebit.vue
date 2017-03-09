<template>
	<div id="phi-debit">

		{{prices}}

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
			prices: {}
		}
	},

	mounted () {
		app.api.get(`v3/debits/${this.id}`)
			.then(datos => {
				this.debit  = datos;
				this.person = datos.person;
				this.prices = datos.prices;
			});
	}
}
</script>

<style lang="scss" scoped>

#phi-debit{

}

</style>