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


				<picker2
					:api="app.api"
					:person-id="app.user.id"
					v-model="audience1"
				>
					<h1>Hola, soy picker2!</h1>
				</picker2>


				<phi-person-relevance-picker
					:api="app.api"
					v-model="audience1"
					person-id="1405"
				>
					 <!-- sample slot content -->
					 <div>
						<div class="person phi-media">
							<div class="phi-media-figure phi-avatar">
								<img src="http://www.extramedia1.com/wp-content/uploads/2016/05/02.jpg" alt="Jon">
							</div>
							<div class="phi-media-body">
								Jon Snow
								<br>
								<span class="person-info">knows nothing ({{audience1.length}})</span>
							</div>
							<div class="phi-media-actions"><i class="fa fa-snowflake-o"></i></div>
						</div>
					</div>
				</phi-person-relevance-picker>

				<phi-person-relevance-picker
					:api="app.api"
					v-model="audience2"
					person-id="627"
				>
					<!-- if no content, then fallback to default block -->
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
import PhiPersonRelevancePicker from '../components/Phi/Person/Relevance/Picker.vue';
import Picker2 from '../components/Phi/Person/Relevance/Picker2.vue';

export default {
	name: "leo-sandbox",

	components: {
		Picker2,
		PhiPersonRelevancePicker
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