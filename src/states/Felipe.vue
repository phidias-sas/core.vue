<template>
	<div id="Settings">
			<ons-page>
			<ons-toolbar><div class="center"> Preferencias</div></ons-toolbar>
			<ons-list>
				<ons-list-header>Notificaciones Android</ons-list-header>
				<ons-list-item v-for="preference in preferences">
					<div class="left"><i class="fa fa-bell-o"></i></div> 
					<div class="center">{{ preference.type }}</div>
					<div class="right">
						<ons-switch 
								:checked="preference.isEnabled == '1' ? true: false" 
								@change="markNotification(preference.isEnabled, preference.destination, preference.type)">
						</ons-switch>
					</div>
				</ons-list-item>
				
				<ons-list-header>General</ons-list-header>
				<ons-list-item>
					<div class="left"> <i class="fa fa-trash"></i> </div>
					<div clas="center">
						<button class="phi-button" @click="cacheDelete">
							Borrar cache
						</button>
					</div>
				</ons-list-item>
			</ons-list>
			</ons-page>
	</div>
</template>

<script>
import app from '../store/app.js'

export default {
	name: "Felipe",
	
	data () {
		return {
			app,
			preferences: []
		}
	},

	mounted(){
		// Endpoint to get destinations: 
		// https://{url}/people/{id_people}/notifications/destination?
		this.getPreferences();		
	},

	methods: {

		cacheDelete() {
			this.app.api.cache.empty().then(() => { alert("Cache borrado") });
		},

		getPreferences(){
			fetch(this.getEndPointNotifications())
				.then(response => response.json())
				.then(data => {
					data.forEach( dato => {
						if (dato.transport == 'gcm')
						{
							this.preferences = dato.preferences;		
						}
					})
			})
		},		

		getEndPointNotifications() {
			// return `/people/{id_people}/notifications/destinations?`;  
			return this.app.data.endpoint+'/people/'+this.app.user.id+'/notification/destinations';

		},

		// https://phidias.api.phidias.co/people/{id_people}/notification/destinations/{idDestination}
		markNotification(preferenceEnable, preferenceDestination, preferenceType) {

			let tempPreferences = [];
			this.preferences.forEach( dato => {
				if (dato.type == preferenceType)
				{
					tempPreferences.push({
						destination: preferenceDestination,
						type: preferenceType,
						isEnabled: preferenceEnable ? 0 : 1,
						schedule: null
					});
				}
				else
				{
					tempPreferences.push(dato);
				}
			});
			this.preferences = tempPreferences;

			this.app.api
			  	.put('people/'+this.app.user.id+'/notification/destinations/'+preferenceDestination, {
			  		person: this.app.user.id,
			  		preferences: this.preferences
			  	})
			  	.then(response => console.log(response));
		}

	}
}
</script>

<style>

</style>