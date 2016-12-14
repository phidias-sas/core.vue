<template>
<div id="Settings">
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()"> 
					<i class="fa fa-bars"></i>
				</button>
				<h1>Preferencias</h1>
			</div>
		</div>

		<ons-progress-bar indeterminate v-show="loadingEvents"></ons-progress-bar>

		<div class="phi-page-contents">
			
			<ons-list-item > 
				<div class="left"><i class="fa fa-bell-o"></i></div> 
				<div class="center"> <h4> Notificaciones Android </h1> </div>
				<div class="right"> 
					<ons-switch 
							:checked="openNotifications" 
							@change="markGeneralNotification(preferenceDest, openNotifications = !openNotifications)">
					</ons-switch> 
				</div>
			</ons-list-item>		

			<phi-drawer :open="openNotifications"> 
			<div id="panel_Notifications">
				<ons-list-item v-for="preference in preferences">
					<div class="left">{{ preference.type }}</div>
					<div class="right">
						<ons-switch 
								:checked="preference.isEnabled == '1' ? true: false" 
								@change="markNotification(preference.isEnabled, preference.destination, preference.type)">
						</ons-switch>
					</div>
				</ons-list-item>
			</div>
			</phi-drawer>	

			<ons-list-item > 
				<div class="left"><i class="fa fa fa-cog"></i></div> 
				<div class="center"> <h4> General </h1> </div>
				<div class="right"> 
					<ons-switch 
							:checked="openGeneral" 
							@change="openGeneral = !openGeneral">
					</ons-switch> 
				</div>
			</ons-list-item>

			<phi-drawer :open="openGeneral"> 
			<div id="panel_General">
				<ons-list-item>
					<div clas="center">
						<button class="phi-button" @click="clearCache()">
							<i class="fa fa-trash-o" aria-hidden="true"></i>
							<span>Elimniar cache</span>
						</button>
					</div>
				</ons-list-item>
			</div>
			</phi-drawer>
				
		</div>
	</div>
	</div>
</template>

<script>
import app from '../store/app.js'

export default {
	name: "Felipe",
	
	data () {
		return {
			app,
			preferences: [],
			loadingEvents: false,
			openNotifications: false,
			openGeneral: false,
			preferenceDest: null
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
							this.preferenceDest = dato.id;
							this.openNotifications = dato.isEnabled ? true : false;
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
						isEnabled: preferenceEnable ? 1 : 0,
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
			   		id: preferenceDestination,
			   		person: this.app.user.id,
					destination: null,
					schedule: null,
			   		preferences: this.preferences
				
			   	})
			   	.then(response => console.log(response));
		},

		markGeneralNotification(preferenceDestination, preferenceEnable) {

			this.app.api
			 	.put('people/'+this.app.user.id+'/notification/destinations/'+preferenceDestination,{
			 		id: preferenceDestination,
			 		isEnabled: preferenceEnable ? 1 : 0
			 	})
			 	.then(response => console.log(response));
		}

	}
}
</script>

<style>
	
</style>