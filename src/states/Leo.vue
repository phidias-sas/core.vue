<template>
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()">
					<i class="fa fa-bars"></i>
				</button>
				<h1>Relevance test</h1>
			</div>
		</div>

		<div class="phi-page-contents">
			<ons-progress-bar v-show="isLoading" indeterminate ></ons-progress-bar>
			
			<phi-person-relevance-picker
				:api="app.api"
				v-model="audience1"
				person-id="1405"
			>
			</phi-person-relevance-picker>
			
			<phi-person-relevance-picker
				:api="app.api"
				v-model="audience2"
				person-id="627"
			>
			</phi-person-relevance-picker>
 
		</div>
	</div>
</template>

<script>
import app from '../store/app.js';
import PhiPersonRelevancePicker from '../components/Phi/Person/Relevance/Picker.vue';

export default {
	name: "leo-sandbox",

	components: {
		"phi-person-relevance-picker": PhiPersonRelevancePicker
	},

	data () {
		return {
			app,
			audience1: [],
			audience2: [],
			isLoading: false,
		}
	},

	methods: {
		
	}
}
</script>

<style scoped>

</style>