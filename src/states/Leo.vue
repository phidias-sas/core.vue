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
			<ons-progress-bar v-show="app.api.isLoading" indeterminate ></ons-progress-bar>

			<div style="max-width: 768px">


				<phi-person-relevance-picker
					:api="app.api"
					:person-id="app.user.id"
					v-model="audience1"
				>
					<h1>Nuevo picker ({{audience1.length}})</h1>
				</phi-person-relevance-picker>

				<div class="selected-people">
					<div class="phi-media person" v-for="person in audience1">
						<div class="phi-media-figure phi-avatar">
							<img :src="person.avatar" alt="person.firstname">
						</div>
						<h3 class="phi-media-body">{{ person.firstname }} {{ person.lastname }}</h3>
						<div class="phi-media-right fa fa-times" @click="audience1.splice(audience1.indexOf(person), 1)"></div>
					</div>
				</div>
			</div>


		</div>
	</div>
</template>

<script>
import app from '../store/app.js';
import personPicker from '../components/Phi/Person/Relevance/Picker.vue';

export default {
	name: "leo-sandbox",

	components: {
		"phi-person-relevance-picker": personPicker
	},

	data () {
		return {
			app,
			audience1: [],
			audience2: []
		}
	}
}
</script>

<style scoped lang="scss">
</style>