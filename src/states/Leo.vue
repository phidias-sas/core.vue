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

			<!-- <ons-progress-bar v-show="!isLoading" indeterminate ></ons-progress-bar> -->

			<phi-person-relevance-picker
				:api="app.api"
				v-model="audience1"
				person-id="1405"
			>
			</phi-person-relevance-picker>
			<h3 v-for="personId in audience1">{{personId}}</h3>

			<phi-person-relevance-picker
				:api="app.api"
				v-model="audience2"
				person-id="627"
			>
			</phi-person-relevance-picker>

			<hr>
			<h3 v-for="personId in audience2">{{personId}}</h3>
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
			audience1: [
				810, 
				1176, 
				756, 
				696, 
				1518, 
				1160, 
				1194, 
				682, 
				1348, 
				1196, 
				3279, 
				1356, 
				4574, 
				858, 
				1405
			],
			audience2: [],
			isLoading: false,
		}
	}
}
</script>