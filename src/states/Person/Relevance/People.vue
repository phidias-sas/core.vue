<template>
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$router.back()">
					<i class="fa fa-arrow-left"></i>
				</button>
				<h1>{{group.name}}</h1>
			</div>
		</div>

		<div class="phi-page-contents">
			<ons-progress-bar v-show="isLoading" indeterminate ></ons-progress-bar>

			<section>
				<div class="phi-card">
					<div class="person phi-media" v-for="person in relevantPeople" 
						v-if="!person.hasOwnProperty('relatives')"
						@click="togglePerson(person.id)" 
						v-bind:class="{ selectedPerson: (selectedPeople.indexOf(person.id) >= 0) }"
					>
						<div class="phi-media-figure phi-avatar">
							<img :src="person.avatar" :alt="person.firstname">	
						</div>
						<h1 class="phi-media-body">
							{{person.firstname}} {{person.lastname}}
							<input class="person-check" type="checkbox" :value="person.id" :checked="selectedPeople.indexOf(person.id) >= 0">
							<br>
							<span v-for="(role, key, index) in person.roles">{{ $t(role) }}<span v-if="index > 0">,</span></span>
						</h1>
						<div class="phi-media-options" v-show="(selectedPeople.indexOf(person.id) >= 0)">
							<i class="blue fa fa-check"></i>
						</div>
					</div> 
				</div>
			</section>

			<div class="sections-container"  v-for="person in relevantPeople">
				<section v-if="person.hasOwnProperty('relatives')">
					<div class="phi-card">
						<div class="person phi-media"  
							@click="togglePerson(person.id)" 
							v-bind:class="{ selectedPerson: (selectedPeople.indexOf(person.id) >= 0) }"
						>
							<div class="phi-media-figure phi-avatar">
								<img :src="person.avatar" :alt="person.firstname">	
							</div>
							<h1 class="phi-media-body">
								{{person.firstname}} {{person.lastname}}
								<input class="person-check" type="checkbox" :value="person.id" :checked="selectedPeople.indexOf(person.id) >= 0">
								<br>
								<span v-for="(role, key) in person.roles">{{ $t(role) }}<span v-if="key < person.roles.length-1">, </span></span>
							</h1>
							<div class="phi-media-options" v-show="(selectedPeople.indexOf(person.id) >= 0)">
								<i class="blue fa fa-check"></i>
							</div>
						</div> 

						<div class="person phi-media" v-for="relative in person.relatives"
							@click="togglePerson(relative.id)" 
							v-bind:class="{ selectedPerson: (selectedPeople.indexOf(relative.id) >= 0) }"
						>
							<div class="phi-media-figure phi-avatar">
								<img :src="relative.avatar" :alt="relative.firstname">	
							</div>
							<h1 class="phi-media-body">
								{{relative.firstname}} {{relative.lastname}}
								<input class="person-check" type="checkbox" :value="relative.id" :checked="selectedPeople.indexOf(relative.id) >= 0">
								<br>
								<span v-for="(role, key) in relative.roles">{{ $t(role) }}<span v-if="key < relative.roles.length-1">, </span></span>
							</h1>
							<div class="phi-media-options" v-show="(selectedPeople.indexOf(relative.id) >= 0)">
								<i class="blue fa fa-check"></i>
							</div>
						</div> 
					</div>
				</section>
			</div>
			
		</div>

		<ons-fab position="bottom right" v-if="selectedPeople.length > 0">
			<ons-icon icon="fa-check"
				@click="$router.go(-2)" 
			></ons-icon>
		</ons-fab>
	</div>
</template>

<script>
import app from '../../../store/app.js';

export default {
	name: "phi-person-relevance-people",
	
	data() {
		return {
			app,
			person: null,
			group: {},
			relevantPeople: [],
			isLoading: true,
		}
	},

	props: {
       
	},

	computed: {
		selectedPeople () {
			return this.$store.state.relevance.people;
		}
  	},

	methods: {
		togglePerson(id){
			let check = this.$el.querySelector("input.person-check[type='checkbox'][value='"+id+"']");
			check.checked = !check.checked;

			let mutation = null;
			if(check.checked){
				mutation = "relevance/addPerson";
			}else{
				mutation = "relevance/removePerson";
			}
			
			this.$store.commit({
				type: mutation,
				person: id
			})
		}
	},

	mounted() {
		this.person = this.$router.currentRoute.params.personId;
		this.group = {id: this.$router.currentRoute.params.groupId, name: this.$router.currentRoute.query.groupName};

		app.api.get("v3/people/" +this.person+ "/relevance/groups/" + this.group.id)
			.then(result => {
				this.isLoading = false;
				this.relevantPeople = result;
			});
	}
}
</script>

<style scoped>
	.phi-avatar {
		width: 20px !important;
		height: 20px !important;
		order: 1;
	}

	.phi-media-body {
		font-size: 1em;
		align-self: center;
		order: 2;
	}

	.phi-media-body span{
		font-size: .8em;
	}

	.phi-media-options{
		font-size: .9em;
		text-align: center;
		order: 3;
	}

	div.phi-media-options i.blue{
		color: #1C89B8;
	}

	.options-help{
		text-align: right;
		padding-right: 5px;
	}

	.optionsBar{
		border-top: 1px solid #D0D0D0;
	}

	input.person-check{
		visibility: hidden;
		display: none;
	}

	.selectedPerson{
		border-left: 4px solid #1C89B8;
		background-color: #f7fcfe;
	}

	section {
		margin-bottom: 0.5em;
	}

	section h2 {
		font-weight: 1.1em;
		color: #666;
		margin-bottom: 0.5em;
		font-size: 1em;
	}
</style>