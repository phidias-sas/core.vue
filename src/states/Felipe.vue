<template>
	<div>
		<div class="controls">
			<button id="menu" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
			<button id="findMe" @click="findMe()" title="Reiniciar ruta"> <i class="fa fa-street-view"></i> Ubicame</button>
			<button id="traceMe" @click="traceRoute()" title="Ver mi ruta"> <i class="fa fa-map-o"></i> Mi ruta</button>
		</div>
		<div id="map"></div>
	</div>
</template>

<script>

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
			geoZoom: 17,
			timestamp: null,
			route: [],
			markers: []
			}
	},
	
	mounted(){
		//this.loadApiGoogleMaps();
		let geoOptions = {
			enableHighAccuracy: true, 
			maximumAge        : 3000, 
			timeout           : 0
		};
		this.currentPosition();
		navigator.geolocation.watchPosition(this.geoSuccess, this.geoError, geoOptions);
	},

	methods: {
		// loadApiGoogleMaps() {
		// 	let script = document.createElement("script");
		// 		script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC-w7WOjp6Rgg4pZZDFW7Eqp6gR2AAlt4I";
		// 		script.type = "text/javascript";
		// 		script.async = true;
		// 		script.defer = true;
		// 	document.getElementsByTagName("head")[0].appendChild(script);
		// },

		// initMap() {
		// 	this.getMyPosition();
		// },

		findMe() {
			this.route = [];
			this.drawMap();
			this.drawMarker();
		},

		currentPosition() {

			if (navigator.geolocation)
			{
				navigator.geolocation.getCurrentPosition( data => 
					{
						this.geoLat = data.coords.latitude,
						this.geoLong = data.coords.longitude,
						this.geoAccuracy = data.coords.accuracy,
						this.timestamp = data.timestamp;
						this.drawMap();
						console.log("Current position... Longitud: "+this.geoLat+" Latitud: "+this.geoLong+" Accuracy: "+this.geoAccuracy+" Fecha: "+this.timestamp);
					});
			}
			else
			{
				console.error("Geolocation function not supported. Error 1");
			}
		},

		saveRoute(Lat, Long) {
			this.route.push({
								lat: Lat,
								lon: Long,
								timestamp: new Date().getTime()
							});
		},

		geoSuccess(data) {
			this.geoLat = data.coords.latitude,
			this.geoLong = data.coords.longitude,
			this.geoAccuracy = data.coords.accuracy;
			this.timestamp = Date.now();
			this.saveRoute(data.coords.latitude, data.coords.longitude);
			this.drawMarker();
			console.log("New position... Longitud: "+this.geoLat+" Latitud: "+this.geoLong+" Accuracy: "+this.geoAccuracy+" Fecha: "+this.timestamp);
		},

		geoError() {
			console.log("Geolocation function not supported. Error 2");
		},

		drawMap() {
			let myPosition = new google.maps.LatLng(this.geoLat, this.geoLong);
			this.saveRoute(this.geoLat, this.geoLong);
			this.myMap = new google.maps.Map(document.getElementById('map'), {
			    center: myPosition,
			    mapTypeId: google.maps.MapTypeId.ROADMAP,
			    zoom: this.geoZoom,
			    sensor: false
			});
		},

		drawMarker() {
			let newPosition = new google.maps.LatLng(this.geoLat, this.geoLong);

			let car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";

			let icon = {
				path: car,
				scale: .7,
				strokeColor: 'white',
				strokeWeight: .10,
				fillOpacity: 1,
				fillColor: '#124796',
				offset: '5%',
				rotation: -35,
				anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
			};
			
			let directionsService = new google.maps.DirectionsService;

			let request = {
				origin: newPosition, 
				destination: newPosition,
				optimizeWaypoints: true,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};

			let that = this;

			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) 
					{
						// --
						let marker = new google.maps.Marker({
							position: response.routes[0].legs[0].start_location, 
							map: that.myMap,
							//icon: 'static/img/car-phidias.png',
							icon: icon,
							title: that.app.user.firstName,
							draggable: false
						});

						// Clean all markers
						that.markers.push(marker);
						if (that.markers.length > 1)
						{
							for (let i=0; i < that.markers.length - 1; i++)
								{
									// Cualquiera de las dos funcionan, la diferenca es:
									// setVisible(false|true): Oculta o aparece los marcadores
									// setMap(null): Elimina los marcadores
									that.markers[i].setVisible(false);
									// that.markers[i].setMap(null);
								}
						}

						// New marker
						//marker.setPosition(newPosition);
						//that.myMap.panTo(newPosition);
						let infoMarker = new google.maps.InfoWindow({
							content: '<img src="'+that.app.user.avatar+'">'
						});

						google.maps.event.addListener(marker, 'click', function() {
							infoMarker.open(that.myMap, marker);
						})

					}
			});

		},

		traceRoute() {
			console.log(this.route);
			let directionsDisplay = new google.maps.DirectionsRenderer({
				map: this.myMap
			});
			let directionsService = new google.maps.DirectionsService;

			for (var i = 0; i < this.route.length - 1; i++) {
				directionsService.route({
					origin: new google.maps.LatLng(this.route[i].lat, this.route[i].lon),
					destination: new google.maps.LatLng(this.route[i+1].lat, this.route[i+1].lon),
					travelMode: google.maps.TravelMode.DRIVING
					}, function(response, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							directionsDisplay.setDirections(response);
						} 
						else {
							window.alert('Directions request failed due to ' + status);
						}
				});
			}
		}
	}
}

</script>

<style lang="scss">

	#map {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
	}

	.controls {

		#menu {
			position: absolute;
			top: 10px;
			left: 10px;
			z-index: 2;

			border: 0;
			cursor: pointer;
			border-radius: 2px;

			/* copy google maps control styles */
			color: rgb(0, 0, 0);
			font-family: Roboto, Arial, sans-serif;
			user-select: none;
			font-size: 16px;
			background-color: rgb(255, 255, 255);
			padding: 8px;
			-webkit-background-clip: padding-box;
			background-clip: padding-box;
			box-shadow: rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px;
			font-weight: 500;
		}

		#findMe {
			position: absolute;
			top: 10px;
			right: 10px;
			z-index: 2;
			border-radius: 2px;

			border: 0;
			cursor: pointer;

			/* copy google maps control styles */
			color: rgb(0, 0, 0);
			font-family: Roboto, Arial, sans-serif;
			user-select: none;
			font-size: 11px;
			background-color: rgb(255, 255, 255);
			/*padding: 8px;*/
			padding: 11px;
			-webkit-background-clip: padding-box;
			background-clip: padding-box;
			box-shadow: rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px;
			font-weight: 500;
			width: 82px;
		}

		#traceMe{
			position: absolute;
			top: 50px;
			right: 10px;
			z-index: 2;
			border-radius: 2px;

			border: 0;
			cursor: pointer;

			/* copy google maps control styles */
			color: rgb(0, 0, 0);
			font-family: Roboto, Arial, sans-serif;
			user-select: none;
			font-size: 11px;
			background-color: rgb(255, 255, 255);
			/*padding: 8px;*/
			padding: 11px;
			-webkit-background-clip: padding-box;
			background-clip: padding-box;
			box-shadow: rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px;
			font-weight: 500;
			width: 82px;
		}
	}

</style>

<!-- http://www.w3schools.com/html/html5_geolocation.asp -->
<!-- http://stackoverflow.com/questions/23149613/change-google-map-marker-orientation-according-path-direction -->
<!-- http://stackoverflow.com/questions/4804495/google-maps-v3-snap-to-nearest-street -->
<!-- https://developers.google.com/maps/documentation/javascript/examples/directions-complex?hl=es-419 -->
<!-- http://stackoverflow.com/questions/5959788/google-maps-api-v3-how-show-the-direction-from-a-point-a-to-point-b-blue-line -->