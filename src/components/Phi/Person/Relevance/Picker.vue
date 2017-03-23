<template>
	<div>
		<div class="phi-person-relevance-picker" v-show="!isLoading">
			<div class="person phi-media" @click="goToGroups">
                <div class="phi-media-figure phi-avatar">
                    <img :src="personObj.avatar" :alt="personObj.firstName">
                </div>
                <h1 class="phi-media-body">
					{{personObj.firstName}} {{personObj.lastName}}
					<br>
					{{ $t("Contacts") }}
				</h1>
				<div class="selected-people-counter"><i class="fa fa-chevron-right"></i></div>
            </div>
		</div>
	</div>
</template>

<script>
import app from '../../../../store/app.js';
import Groups from '../../../../states/Person/Relevance/Groups.vue';
import People from '../../../../states/Person/Relevance/People.vue';

export default {
	name: "phi-person-relevance-picker",

	model: {
		prop: 'selectedPeople',
		event: 'selectedPeopleChange'
	},
	
	props: {
		selectedPeople: {
			type: Array,
			required: false,
			default: []
		},

		//default to deck for this particular app
		rootRoute: {
			type: String,
			required: false,
			default: "/deck"
		},

        person: {
			type: Number,
			required: true
		}
	},

	watch: {
		isLoading: function (loading) {
			if(!loading){
				this.$emit("loaded", true);
			}
		}
	},

	computed: {
		selectedContacts () {
			return this.$store.state.relevance.people;
		}
  	},

	data () {
		return {
			isLoading: true,
			personObj: {},
			relatedRoutes: ["relevanceGroups", "relevancePeople"]	
		}
	},

	methods: {
		initializeComponent () {
			this.isLoading = true;
			app.api.get("people/"+this.person)
				.then(result => {
					this.personObj = result;
					this.isLoading = false;
				});
		},

		goToGroups(){
			this.$router.push({ name: 'relevanceGroups', params: { personId: this.person }});
		},

		initailizeStorage(){

			let storageName = "relevance";
			let storageDefinition = {
				namespaced: true,
				state: {
					people: []
				},

				mutations: {
					addPerson (state, payload) {
						state.people.push(payload.person);
					},

					removePerson (state, payload) {
						let index = state.people.indexOf(payload.person);

						if(index >= 0){
							state.people.splice(index, 1);
						}
					}
				}	
			};

			if(this.relatedRoutes.indexOf(this.$router.previousRoute.name) < 0){
				if(this.$store.state.hasOwnProperty(storageName)){
					this.$store.unregisterModule(storageName);
				}	
			}
			
			if(!this.$store.state.hasOwnProperty(storageName)){
				this.$store.registerModule(storageName, storageDefinition);
			}
			
		},

		initializeRoutes(){
			
			let rootIndex = null;
			for(let i = 0; i < this.$router.options.routes.length; i++){
				if(this.$router.options.routes[i].path === this.rootRoute){
					rootIndex = i;
					break;
				}
			}
			
			let myRoutes = [];
			let routesDefinition = [
				{ 
					path: '/person/:personId/relevance/groups',  
					component: Groups,
					name: 'relevanceGroups'
				},

				{ 
					path: '/person/:personId/relevance/group/:groupId/people',  
					component: People,
					name: 'relevancePeople'
				},
			];

			if(rootIndex !== null){
				myRoutes = [
					{
						path: this.$router.options.routes[rootIndex].path, 
						component: this.$router.options.routes[rootIndex].component,
						children: routesDefinition
					}
				];
			}else{
				myRoutes = routesDefinition;
			}

			this.$router.addRoutes(myRoutes);
		}
	},

	created() {
		this.initailizeStorage();
		this.initializeRoutes();
	},

	mounted() {
		this.initializeComponent();

		this.$emit("selectedPeopleChange", this.selectedContacts);
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

	.selected-people-counter{
		font-size: .9em;
		text-align: center;
		order: 3;
	}
</style>