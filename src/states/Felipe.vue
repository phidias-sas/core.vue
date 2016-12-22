<template>
<!-- <div id="Settings">
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
	</div> -->
	<div id="map">
		<button class="phi-button" @click="initMap()" id="findMe">
			<i class="fa fa-map-marker" aria-hidden="true" ></i>
		</button>
		<!-- API Key: AIzaSyC-w7WOjp6Rgg4pZZDFW7Eqp6gR2AAlt4I -->
	</div>
</template>

<script>
// import app from '../store/app.js'

// export default {
// 	name: "Felipe",
	
// 	data () {
// 		return {
// 			app,
// 			preferences: [],
// 			loadingEvents: false,
// 			openNotifications: false,
// 			openGeneral: false,
// 			preferenceDest: null
// 		}
// 	},

// 	mounted(){
// 		// Endpoint to get destinations: 
// 		// https://{url}/people/{id_people}/notifications/destination?
// 		this.getPreferences();		
// 	},

// 	methods: {

// 		cacheDelete() {
// 			this.app.api.cache.empty().then(() => { alert("Cache borrado") });
// 		},

// 		getPreferences(){
// 			fetch(this.getEndPointNotifications())
// 				.then(response => response.json())
// 				.then(data => {
// 					data.forEach( dato => {

// 						if (dato.transport == 'gcm')
// 						{
// 							this.preferences = dato.preferences;		
// 							this.preferenceDest = dato.id;
// 							this.openNotifications = dato.isEnabled ? true : false;
// 						}
						
// 					})
// 			})
// 		},		

// 		getEndPointNotifications() {
// 			// return `/people/{id_people}/notifications/destinations?`;  
// 			return this.app.data.endpoint+'/people/'+this.app.user.id+'/notification/destinations';

// 		},

// 		// https://phidias.api.phidias.co/people/{id_people}/notification/destinations/{idDestination}
// 		markNotification(preferenceEnable, preferenceDestination, preferenceType) {

// 			let tempPreferences = [];
// 			this.preferences.forEach( dato => {
// 				if (dato.type == preferenceType)
// 				{
// 					tempPreferences.push({
// 						destination: preferenceDestination,
// 						type: preferenceType,
// 						isEnabled: preferenceEnable ? 1 : 0,
// 						schedule: null
// 					});
// 				}
// 				else
// 				{
// 					tempPreferences.push(dato);
// 				}
// 			});

// 			this.preferences = tempPreferences;

// 			this.app.api
// 			   	.put('people/'+this.app.user.id+'/notification/destinations/'+preferenceDestination, {
// 			   		id: preferenceDestination,
// 			   		person: this.app.user.id,
// 					destination: null,
// 					schedule: null,
// 			   		preferences: this.preferences
				
// 			   	})
// 			   	.then(response => console.log(response));
// 		},

// 		markGeneralNotification(preferenceDestination, preferenceEnable) {

// 			this.app.api
// 			 	.put('people/'+this.app.user.id+'/notification/destinations/'+preferenceDestination,{
// 			 		id: preferenceDestination,
// 			 		isEnabled: preferenceEnable ? 1 : 0
// 			 	})
// 			 	.then(response => console.log(response));
// 		}

// 	}
// }

import app from '../store/app.js'

export default {
	name: "Felipe",
	data () {
		return {
			app,
			myMap: null,
			geoLat: null, 
			geoLong: null,
			geoAccuracy: null,
			geoZoom: 18
			}
	},
	
	mounted(){
		this.loadApiGoogleMaps();
	},

	methods: {
		loadApiGoogleMaps() {
			let script = document.createElement("script");
				script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC-w7WOjp6Rgg4pZZDFW7Eqp6gR2AAlt4I";
				script.type = "text/javascript";
				script.async = true;
				script.defer = true;
			document.getElementsByTagName("head")[0].appendChild(script);
		},

		initMap() {
			this.getMyPosition();
		},

		getMyPosition() {
			if (navigator.geolocation)
			{
				navigator.geolocation.getCurrentPosition( data => 
					{
						this.geoLat = data.coords.latitude,
						this.geoLong = data.coords.longitude,
						this.geoAccuracy = data.coords.accuracy;
						this.drawMap();
						console.log("Started position... Longitud: "+this.geoLat+" Latitud: "+this.geoLong+" Accuracy: "+this.geoAccuracy);
					});

				navigator.geolocation.watchPosition( data => 
					{
						this.geoLat = data.coords.latitude,
						this.geoLong = data.coords.longitude,
						this.geoAccuracy = data.coords.accuracy;
						this.drawMarker();
						console.log("New position... Longitud: "+this.geoLat+" Latitud: "+this.geoLong+" Accuracy: "+this.geoAccuracy);

					});
			}
			else
			{
				console.error("Geolocation function not supported");
			}
		},

		drawMap() {
			let myPosition = new google.maps.LatLng(this.geoLat, this.geoLong);
			this.myMap = new google.maps.Map(document.getElementById('map'), {
			    center: myPosition,
			    mapTypeId: google.maps.MapTypeId.ROADMAP,
			    zoom: this.geoZoom,
			    sensor: false
			});
		},

		drawMarker() {
			let newPosition = new google.maps.LatLng(this.geoLat, this.geoLong);
			let marker = new google.maps.Marker({
				map: this.myMap,
				icon: '../static/img/car-phidias.png',
				title: this.app.user.firstName,
				draggable: false
			});
			marker.setPosition(newPosition);
			this.myMap.panTo(newPosition);
			
			let infoMarker = new google.maps.InfoWindow({
				content: '<img src="'+this.app.user.avatar+'">'
			});

			google.maps.event.addListener(marker, 'click', function() {
				infoMarker.open(this.myMap, marker);
			})
		}
	}
}

</script>

<style>
	#map { 
		height: 100%; 
	}
	#findMe {
		z-index: 10;
	}
</style>

<!-- http://www.w3schools.com/html/html5_geolocation.asp -->