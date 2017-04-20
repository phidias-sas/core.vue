<template>
	<div id="state-credit-details" class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
				<h1 v-if="credit.method">{{credit.method.name}}</h1>
			</div>
		</div>
		
		<!-- componente -->
		<div class="phi-page-contents">
			<phi-credit :credit="credit"></phi-credit>
		</div>
	</div>
</template>

<script>
import app from '../../store/app.js'
import PhiCredit from '../../components/Phi/Credit.vue';

export default{
	components: {PhiCredit},
	data() {
		return {
			credit: {}
		}
	},
	beforeRouteEnter(to, from, next) {
		app.api.get(`v3/credits/${to.params.creditId}`)
			.then(credit => next(vm => vm.credit = credit));
	}
}
</script>