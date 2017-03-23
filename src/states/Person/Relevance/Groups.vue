<template>
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$router.back()">
					<i class="fa fa-arrow-left"></i>
				</button>
				<h1>{{ $t("Groups") }}</h1>
			</div>
		</div>

		<div class="phi-page-contents">
			<ons-progress-bar v-show="isLoading" indeterminate ></ons-progress-bar>

			<section v-for="group in relevantGroups">
				<h2 v-if="group.people.length > 0">{{group.name}}</h2>
				<div class="phi-card">
					<div class="person phi-media"  v-for="person in group.people" 
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

					<div class="person phi-media" 
						v-if="group.type !== 'relatives'" 
						v-bind:class="{ optionsBar: (group.people.length > 0) }" 
						@click="goToPeople(group.id, group.name)"
					>
						<h1 class="phi-media-body"
							v-bind:class="{ optionsHelp: (group.people.length > 0) }"
						>
							<span v-show="(group.people.length > 0)">{{ $t("more people") }}</span>
							<span v-show="(group.people.length <= 0)">{{group.name}}</span>
						</h1>
						<div class="phi-media-options">
							<i class="fa fa-chevron-right"></i>
						</div>
					</div> 
				</div>
			</section>

		</div>

		<ons-fab position="bottom right" v-if="selectedPeople.length > 0">
			<ons-icon icon="fa-check"
				@click="$router.go(-1)" 
			></ons-icon>
		</ons-fab>
	</div>
</template>

<script>
import app from '../../../store/app.js';

export default {
	name: "phi-person-relevance-groups",
	
	data() {
		return {
			app,
			relevantGroups: [],
			isLoading: true,
			person: null
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
		},

		goToPeople(groupId, groupName){
			this.$router.push({ name: 'relevancePeople', params: { personId: this.person, groupId: groupId }, query: {groupName: groupName}});
		},	
	},

	mounted() {
		this.person = this.$router.currentRoute.params.personId;
		
		app.api.get("v3/people/" +this.person+ "/relevance/groups")
			.then(result => {
				this.relevantGroups = result;
				this.isLoading = false;
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

	.optionsHelp{
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
		margin-bottom: 1.1em;
	}

	section h2 {
		font-weight: 1.1em;
		color: #666;
		margin-bottom: 0.5em;
		font-size: 1em;
	}
</style>