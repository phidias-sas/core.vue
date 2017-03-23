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
			<ons-progress-bar v-show="!isLoading" indeterminate ></ons-progress-bar>

			<phi-person-relevance-picker 
				v-model="selectedPeople" 
				:person="1405"
				@loaded="isLoading = true"
			>
			</phi-person-relevance-picker>

			<phi-person-relevance-picker 
				v-model="selectedPeople" 
				:person="627"
				@loaded="isLoading = true"
			>
			</phi-person-relevance-picker>

			<hr>
			<h3 v-for="personId in selectedPeople">{{personId}}</h3>
		</div>
	</div>
</template>

<script>
import app from '../store/app.js';
import PhiPersonRelevancePicker from '../components/Phi/Person/Relevance/Picker.vue';

export default {
	name: "leo-sandbox",

	components: {
		PhiPersonRelevancePicker
	},

	data () {
		return {
			app,
			selectedPeople: [],
			isLoading: false,
		}
	},

	mounted() {
		
	}
}
</script>

<style>
</style>