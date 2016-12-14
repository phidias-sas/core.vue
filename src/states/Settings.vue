<template>
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
								@change="markNotification(preference.isEnabled = !preference.isEnabled, preference.destination, preference.type)">
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
						<button class="phi-button" @click="cacheDelete()">
							<i class="fa fa-trash-o" aria-hidden="true"></i>
							<span>Elimniar cache</span>
						</button>
					</div>
				</ons-list-item>
			</div>
			</phi-drawer>
		</div>
	</div>
</template>

<script>
import app from '../store/app.js'

export default {
	name: "settings",
	
	data () {
		return {
			app,
			preferences: [],
			postTypes: [],
			loadingEvents: false,
			openNotifications: false,
			openGeneral: false,
			preferenceDest: null
		}
	},

	mounted(){
		this.getPreferences();		
	},

	methods: {

		cacheDelete() {
			this.app.api.cache.empty().then(() => { alert("Cache borrado") });
		},

		getPreferences(){
			
			/* Load post types */
			fetch(this.getPostTypes())
			 	.then(response => response.json())
			 	.then(datos => {
			 		datos.forEach( dato => {
			 			this.postTypes.push({
			 				type: dato.singular,
			 				isEnabled: 1
			 			})
			 		})
			 	})

			/* Load preferences from gcm transport type*/
			fetch(this.getEndPointNotifications())
				.then(response => response.json())
				.then(data => {
					data.forEach( dato => {
						if (dato.transport == 'gcm')
						{
							if (dato.preferences.length == 0)
							{
								this.preferences = this.postTypes;										
							}
							else
							{
								this.preferences = dato.preferences;			
							}							
							this.preferenceDest = dato.id;
							this.openNotifications = dato.isEnabled == "1" ? true : false;	
						}
					})
			})
		},		

		getEndPointNotifications() {
			// {endPoint}/people/{id_people}/notifications/destinations  
			return this.app.data.endpoint+'/people/'+this.app.user.id+'/notification/destinations';

		},

		getPostTypes() {
			return this.app.data.endpoint+'/types/post';
		},

		// {endPoint}/people/{id_people}/notification/destinations/{idDestination}
		markNotification(preferenceEnable, preferenceType) {

			let tempPreferences = [];
			this.preferences.forEach( dato => {
				if (dato.type == preferenceType)
				{
					tempPreferences.push({
						destination: this.preferenceDest,
						type: preferenceType,
						isEnabled: preferenceEnable,
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
			  	.put('people/'+this.app.user.id+'/notification/destinations/'+this.preferenceDest, {
			   		person: this.app.user.id,					
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