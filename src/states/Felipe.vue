<template>
	<div class="mapContainer">
		<div id="controlMaps" class="controls">
			<button id="menu"
				@click="$parent.$el.left.toggle()">
				<i class="fa fa-bars"></i>
			</button>

			<div class="options">
				<button id="findMe"
					@click="findMe()"
					title="Reiniciar ruta">
					<i class="ion-android-locate"></i>
				</button>

				<button id="traceMe"
					@click="traceRoute()"
					title="Ver mi ruta">
					<i class="fa fa-bus"></i>
				</button>

				<button id="markStop"
					@click="markStop()"
					title="Marcar parada">
					<i class="fa fa-thumb-tack"></i>
				</button>

				<button id="logMe"
					@click="logs()"
					title="Ver coordenadas">
					<i class="fa fa-binoculars"></i>
				</button>

				<button
					@click="refresh()"
					title="Actualizar">
					<i class="fa fa-map-marker"></i>
				</button>

				<button
					@click="setAutorefresh(!isRefreshing)"
					title="Activar/Desactivar">
					<i v-show="!isRefreshing" class="fa fa-play"></i>
					<i v-show="isRefreshing" class="fa fa-pause"></i>
				</button>

			</div>

		</div>
		<div class="msg"> <div id="printMessage"> {{ message }} </div> </div>
		<div id="map" style="background-color: rgba(0,0,0,0):"> </div>
	</div>
</template>

<script>
import moment from 'moment';
import {load, loaded} from 'vue-google-maps';
import app from '../store/app.js'

var myGoogleMap = null;
var myGoogleMapOptions = {
		controls: {},
		gestures: {}
	};

export default {
	name: "Felipe",

	created() {
		if (typeof google == "undefined") {
			load('AIzaSyCpSKazmH7T7ArBkdcPiRYaYG_QKhj7rRM');
		}
	},

	data() {
		return {
			app,

			lastRefresh: (new Date() / 1000),
			targets: [],
			isRefreshing: false,
			refreshInterval: null,

			myMap: null,
			geoLat: null,
			geoLong: null,
			bearing: null,
			geoLatAnt: null,
			geoLongAnt: null,
			geoAccuracy: null,
			timestamp: null,
			route: [],
			routeStreet: [],
			markers: [],
			stopMarkers: [],
			geoOptions: {
				enableHighAccuracy: false,
				maximumAge: 0,
				timeout: 1000
			},
			geoZoom: 16,
			idWatchPosition: null,
			showCoords: true,
			message: null,
			rotation: 0,
			activeRoute: 0,
			lineRoute: null,
			lineSymbol: null,
			idInterval: null,
			phi_bus: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA9AAAAPQBFLZpEgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAUdEVYdFRpdGxlAGJsdWUgYnVzIC0gMTcwN2TChAAAAp5JREFUSIm9lLtrFUEYxX/fzD7u5t6YxDzQiIIKIiIWErUTMUpA7CwEUfEBCoKFWFgINoKNEUUsjBADok3+gBQWFj4LbQRFBYMSUUIwJsT73MeMxRrNekMsNPfAwtnvfGc5M7PfwAK4cvX6lYX0RkDAyvZ+Du9cz7HhF7RjCQBEaN7aNd50aEs1JwLFSmId15NKiH03oeN7r7srZ3cTNKmicv2CBYjDkjhePsOTsCzaDSwi8+pzwyQGBp9Q/fSNEBhLEk47Gy5w5FwftzevhOHnaeOFvbC/Bz5PL+P9BLwci3j2doa2IKElZyiG2rGG3LfvMbGrkSj12UghYZbbWCGOzKnZut5ZGAu1CH9Na5HRqUKn1px3fJdd7Xk4cTdtUgJ7NqZ8RWv6gMvA4/a67R986gDOnEowD8/9Rc9CieHOyRp9NwtYy2onLn7pOT7UjlU+AN2t0JzLmiZL835rUWCswnd1+iIsVxJNd86GA1i1tN40VW5Qup/QSqXE4qvAoTBXbPLqDeWwvrbYECwi+MogmUnSqr5ZSaNipbD2dyRVi03mD5ue5zg9veiZMjDWYhGspaaM0/ZVTO2XOD5Tb1iab2A6wBgzS6vKbe5+PnjUZ21nWhmbhJlK1tBRoGFQYojiXwHHnWrEg8kSB24dhN6rYIGRV7BvM3wtwvsJeDFaYVNHmbYgIe9BKVY8GuvgTG9CoCs4XrqCJCyhvXyGJ2EZ7QYg8ls3UVrPtWTCxQYGHipODaf3nAgfnDeKocv3SXas4xjCMiz64gj64ghLtnWNewd7qrmeLmFdc4znepRD7NsJHVuhMlPTORytVLouTKjkT24iJernINpYi4AFF5P4okIyAxrFEBuqo1MFA3wUuLTgdvdfu9H/D6f1X/ADTfEOg4RwW1YAAAAASUVORK5CYII=',
			bus_stop: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAI6wAACOsBFpDIHQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAF/SURBVFiF7dY/SAJhHMbx53d3ZVFBmGFIgQSBLTXVEA1NhTRUe2DhEA2NRVTSLdLeGJE1tdRU4SZt1RAETU61KJWdSUqgeO/b0h8y4c2zeCXuO97L+/Lh7n2Pl2CxgdGJLpXjnGuF3oto9NnqOqUpVicSKU4AHiWvtvwWBqgC9FeRe2ej28pE5+Wtryn5dJLxeYayPe77SuYyUl9Ss0t3ZUGu3TC3AqqyIgjzj4HV7dIBWZ9MA8eWKxLWSwdk7iECYb1tL7wJXf9wSN/UxLHQ7q078Eb0BkDeHioTnZp5ZVL6G/qMj6gO86iGQEgrjC9rshVv3cBk/odgKC4dxEHXIOY3gqEEIPuUEcW4Vhg2AmuJ90fSQBw4bGaF8fS0/uWmoAGYs7JgfSbX0RpP6ek+z2Kx0ZGtUJMzZlb2DaJvvxyyggGAwbGpfoWxKzLNzrPYcUI842fV0rEHYIPE2SBRNkiUDRJlg0TZIFE2SJQNEvV/QJyzNIAkc5iV3acFvQJ2dGrMoCEazAAAAABJRU5ErkJggg==',
			flag_start: 'data:image/png;base64,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',
			car: 'M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z',
			openMenu: false,
			stopIconNative: null,
			stopIconJavaScript: null,
			firstPosition: false
		}
	},

	mounted() {

		loaded.then(() => {
			if (isMobile) {
				myGoogleMap = plugin.google.maps.Map.getMap(document.getElementById('map'), {
					controls: {
						compass: true,
						myLocationButton: true,
						indoorPicker: false,
						zoom: true
					},
					gestures: {
						scroll: true,
						tilt: true,
						rotate: true,
						zoom: true
					}
				});
			} else {
				this.myMap = new google.maps.Map(document.getElementById('map'), {
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					zoom: this.geoZoom,
					zoomControl: true,
					mapTypeControl: true,
					scaleControl: true,
					streetViewControl: true,
					rotateControl: true,
					mapTypeControlOptions: {
						style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
						position: google.maps.ControlPosition.TOP_CENTER
					}
				});
			}

			this.getMyPosition();
			this.dummyMarkers();
			//this.idWatchPosition = window.setInterval(this.getCoords, 1000);
			this.idWatchPosition = navigator.geolocation.watchPosition(this.geoSuccess, this.geoError, this.geoOptions);

			document.getElementById("printMessage").style.visibility = this.showCoords ? "visible" : "hidden";

			// Fix cordova-google-maps-plugin-custom
			window.setTimeout(function() {
				if (isMobile) {
					document.getElementById("menu").style.visibility = "hidden";

					var findMe = document.getElementById("findMe");
					var traceMe = document.getElementById("traceMe");
					var markStop = document.getElementById("markStop");
					var logMe = document.getElementById("logMe");

					document.getElementById("map").appendChild(findMe);
					document.getElementById("map").appendChild(traceMe);
					document.getElementById("map").appendChild(markStop);
					document.getElementById("map").appendChild(logMe);
				}
			}, 600);
		});
	},

	beforeDestroy() {
		window.clearInterval(this.idWatchPosition);
		window.clearInterval(this.idInterval);
		if (isMobile) {
			myGoogleMap.clear();
			myGoogleMap.off();
		} else {
			this.clearMarkers();
		}
		this.route = [];
		this.routeStreet = [];
		this.markers = [];
		this.stopMarkers = [];
	},

	methods: {
		// loadApiGoogleMaps() {
		// 	let js = null;

		// 	for (let i=0, js=document.getElementsByTagName('script')[i]; i++)
		// 	{
		// 		if (js.src.indexOf(src)>-1)
		// 	}

		//  	let script = document.createElement("script");
		//  		script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC-w7WOjp6Rgg4pZZDFW7Eqp6gR2AAlt4I&libraries=geometry";
		//  		script.type = "text/javascript";
		//  		script.async = true;
		//  		script.defer = true;
		//  	document.getElementsByTagName("head")[0].appendChild(script);
		// },

		setAutorefresh(value) {
			this.isRefreshing = value;
			if (this.isRefreshing) {
				this.refreshInterval = setInterval(this.refresh, 3000);
			} else {
				clearInterval(this.refreshInterval);
			}
		},

		refresh() {
			app.api
				.get(`people/${app.user.id}/geo/feed`, {t: this.lastRefresh})
				.then(positions => {
					positions.forEach(this.updatePosition);
					if (positions.length > 0) {
						this.lastRefresh = positions[0].timestamp;
					}
				});
		},

		getTarget(targetObj) {
			for (var i = 0; i < this.targets.length; i++) {
				if (this.targets[i].id == targetObj.id) {
					return this.targets[i];
				}
			}

			this.targets.push(targetObj);
			return targetObj;
		},

		updatePosition(position) {
			var target = this.getTarget(position.target);
			var newPosition = new google.maps.LatLng(parseFloat(position.latitude), parseFloat(position.longitude));

			if (target.marker == undefined) {
				target.marker = new google.maps.Marker({
					map: this.myMap,
					title: target.name,
					icon: target.icon,
					animation: isMobile ? plugin.google.maps.Animation.DROP : google.maps.Animation.DROP,
					draggable: false,
					position: newPosition
				});
			} else {
				target.marker.setPosition(newPosition);
			}
		},




		dummyMarkers() {
			let that = this;
			app.api.get(`people/${app.user.id}/geo/feed?t=1491428141`)
				.then(items => {
					items.forEach(item => {
						let marker = {
							position: isMobile ? new plugin.google.maps.LatLng(item.coordinates.latitude, item.coordinates.longitude) : new google.maps.LatLng(item.coordinates.latitude, item.coordinates.longitude),
							map: that.myMap,
							title: item.title,
							icon: isMobile ? this.bus_stop : '',
							timestamp: item.timestamp,
							identifier: item.identifier,
							snippet: isMobile ? item.identifier : null,
							type: item.type,
							animation: isMobile ? plugin.google.maps.Animation.DROP : google.maps.Animation.DROP,
							draggable: isMobile ? null: false
						};
						if (isMobile)
						{
							that.stopMarkers.push(marker);
						}
						else{
							that.stopMarkers.push(new google.maps.Marker(marker));
						}
					});
					that.setMarkersOnMap();
				});
		},

		setMarkersOnMap() {
			console.log("setMarkersOnMap");
			console.log(this.stopMarkers);
			for (let i = 0; i < this.stopMarkers.length; i++)
				{
					if (isMobile)
					{
						myGoogleMap.addMarker(this.stopMarkers[i],
							marker => {
								marker.showInfoWindow();
						});
					}
					else {
						let marker = this.stopMarkers[i];
					}
				}
		},

		getMyPosition() {
			console.log("getMyPosition");
			let that = this;
			let myPosition = null;
			if (isMobile)
			{
				document.getElementById('findMe').style.visibility = 'hidden';
				cordova.plugins.diagnostic.isLocationAvailable( data => {
					// If GPS is enabled
					myGoogleMap.setMapTypeId(plugin.google.maps.MapTypeId.ROADMAP);
					myGoogleMap.addEventListener(plugin.google.maps.event.MAP_CLICK, data => {
						// zzz
						console.log(data);
					});

					myGoogleMap.addEventListener(plugin.google.maps.event.MY_LOCATION_BUTTON_CLICK, () => {
						that.findMe(that);
					});

					myGoogleMap.addEventListener(plugin.google.maps.event.CAMERA_CHANGE, data => {
						console.log(data);
						if (data.zoom <=2 )
						{
							that.geoZoom = 16;
						}
						else {
							that.geoZoom = data.zoom;
						}
					});

					myGoogleMap.addEventListener(plugin.google.maps.event.MAP_READY, data => {
						myGoogleMap.getMyLocation( location => {
							var pos = new plugin.google.maps.LatLng(location.latLng.lat, location.latLng.lng);

							that.geoLat = location.latLng.lat;
							that.geoLong = location.latLng.lng;
							that.geoAccuracy = location.accuracy;
							that.timestamp = location.time;
							that.bearing = location.bearing;
							that.printMessage("Lat: " + that.geoLat + " Long: " + that.geoLong + " Prec: "+that.geoAccuracy);

							myGoogleMap.animateCamera({
								target: location.latLng,
								tilt: 30,
								zoom: that.geoZoom,
								duration: 1000,
								bearing: that.bearing
							}, () => {
								myGoogleMap.addMarker({
									position: pos,
									icon: that.flag_start,
									title: that.app.user.firstName,
									rotation: that.bearing
									}, function(marker) {
										marker.showInfoWindow();
								});
							});
							that.saveRoute(that.geoLat, that.geoLong, that);
						});
					});
				}, () => {
						// if GPS is disable
						this.printMessage("Por favor verifique si su GPS está activo");
				});
			}
			else
			{
				// Javascript Map
				if (navigator.geolocation)
				{
					navigator.geolocation.getCurrentPosition( data =>
						{
							this.geoLat = data.coords.latitude,
							this.geoLong = data.coords.longitude,
							this.geoAccuracy = data.coords.accuracy,
							this.timestamp = data.timestamp;
							this.printMessage("Lat: " + this.geoLat + " Lng: " + this.geoLong + " Acc: "+this.geoAccuracy);
							this.drawMap();
							this.drawMarker(this.geoLat,this.geoLong);
						}, this.geoError, this.geoOptions);
				}
				else
				{
					this.printMessage("Geolocalización no es soportada en este browser");
				}
			}
		},

		findMe(that) {
			if (isMobile)
			{
				navigator.geolocation.clearWatch(that.idWatchPosition);
				that.route = [];
				that.routeStreet = [];
				that.markers = [];
				that.stopMarkers = [];
				myGoogleMap.clear();
				that.getMyPosition();
				that.dummyMarkers();
				//that.idWatchPosition = window.setInterval(that.getCoords, 1000);
				that.idWatchPosition = navigator.geolocation.watchPosition(that.geoSuccess, that.geoError, that.geoOptions);
			}
			else
			{
				navigator.geolocation.clearWatch(this.idWatchPosition);
				this.route = [];
				this.routeStreet = [];
				this.clearMarkers();
				this.markers = [];
				this.stopMarkers = [];
				this.getMyPosition();
				this.dummyMarkers();
				//this.idWatchPosition = window.setInterval(this.getCoords, 1000);
				this.idWatchPosition = navigator.geolocation.watchPosition(this.geoSuccess, this.geoError, this.geoOptions);
			}
		},

		getCoords(){
			let coords=[];
			let that = this;
			let zoom = 0;

			if (isMobile)
			{
				// Check if the GPS is turn on
				cordova.plugins.diagnostic.isLocationAvailable(data => {
					// If GPS is enabled
					myGoogleMap.getMyLocation( location => {
						var pos = new plugin.google.maps.LatLng(location.latLng.lat, location.latLng.lng);

						that.geoLat = location.latLng.lat;
						that.geoLong = location.latLng.lng;
						that.bearing = location.bearing;
						that.printMessage("Lat: " + location.latLng.lat + " Lng: " + location.latLng.lng + " Acc: "+location.accuracy);
						that.saveRoute(that.geoLat, that.geoLong, that);

						myGoogleMap.animateCamera({
							target: location.latLng,
							tilt: 30,
							zoom: that.geoZoom,
							duration: 1000,
							bearing: that.bearing
						});
					});
				}, error => {
					// If GPS is not enabled
					this.printMessage("Por favor verifique si su GPS está activo");
				});
			}
			else
			{
				if (navigator.geolocation || "geolocation" in navigator)
				{
					navigator.geolocation.getCurrentPosition( data =>
						{
							coords.latitude =  data.coords.latitude,
							coords.longitude = data.coords.longitude,
							coords.accuracy = data.coords.accuracy;
							that.geoSuccess(coords);
						}, this.geoError, this.geoOptions);
				}
				else
				{
					this.printMessage("Geolocalización no es sopotada en este browser");
				}
			}
		},

		geoSuccess(data) {
			if (this.geoLat != data.coords.latitude || this.geoLong != data.coords.longitude)
			{
				if (isMobile)
				{
					this.getCoords();
				}
				else
				{
					this.geoLatAnt = this.geoLat;
					this.geoLongAnt = this.geoLong;
					this.geoLat = data.coords.latitude,
					this.geoLong = data.coords.longitude,
					this.geoAccuracy = data.coords.accuracy;
					this.timestamp = new Date().getTime();
					this.printMessage("Lat: " + this.geoLat + " Lng: " + this.geoLong + " Accu: "+this.geoAccuracy);
					this.saveRoute(data.coords.latitude, data.coords.longitude, this);
					this.drawMarker(data.coords.latitude, data.coords.longitude);
				}
			}
		},

		drawMap() {
			let myPosition = null;
			myPosition = new google.maps.LatLng(this.geoLat, this.geoLong);
			this.saveRoute(this.geoLat, this.geoLong, this);
			this.myMap.panTo(myPosition);
		},

		drawMarker(Lat, Long) {
			let newPosition = new google.maps.LatLng(Lat, Long);
			let icon = {
				path: this.car,
				scale: .7,
				strokeColor: 'white',
				strokeWeight: .10,
				fillOpacity: 1,
				fillColor: '#124796',
				offset: '5%',
				rotation: this.rotation,
				anchor: new google.maps.Point(10, 25)
			};

			/*
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
						that.saveRouteStreet(response.routes[0].legs[0].start_location.lat(), response.routes[0].legs[0].start_location.lng());
						let marker = new google.maps.Marker({
							position: response.routes[0].legs[0].start_location,
							map: that.myMap,
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
									that.markers[i].setVisible(false);
								}
						}

						// New marker
						that.myMap.panTo(newPosition);

						let infoMarker = new google.maps.InfoWindow({
							content: '<img src="'+that.app.user.avatar+'">'
						});

						google.maps.event.addListener(marker, 'click', function() {
							infoMarker.open(that.myMap, marker);
						})

					}
			});
			*/
			this.saveRoute(Lat, Long, this);
			let marker = new google.maps.Marker({
				position: newPosition,
				map: this.myMap,
				icon: icon,
				title: this.app.user.firstName,
				draggable: false
			});

			// Clean all markers
			this.markers.push(marker);
			if (this.markers.length > 1)
			{
				for (let i=0; i < this.markers.length - 1; i++)
					{
						// Cualquiera de las dos funcionan, la diferencia es:
						// setVisible(false|true): Oculta o aparece los marcadores
						// setMap(null): Elimina los marcadores
						this.markers[i].setVisible(false);
						//this.markers[i].setMap(null);
					}
				this.rotation = google.maps.geometry.spherical.computeHeading(new google.maps.LatLng(this.geoLatAnt,this.geoLongAnt),new google.maps.LatLng(this.geoLat,this.geoLong));
			}

			// New marker
			this.myMap.panTo(newPosition);

			let infoMarker = new google.maps.InfoWindow({
				content: '<img src="'+this.app.user.avatar+'">'
			});

			google.maps.event.addListener(marker, 'click', () => {
				infoMarker.open(this.myMap, marker);
			});
		},

		traceRoute() {
			this.activeRoute = !this.activeRoute;
			if (isMobile)
			{
				if (this.activeRoute)
				{
					this.lineRoute = myGoogleMap.addPolyline({
						points: this.route,
						color: '#3776dd',
						width: 11,
						geodesic: false
					}, function(polyline) {

						setTimeout(function() {
							polyline.remove();
						}, 10000);
					});
				}
				else
				{
					this.lineSymbol = null;
					window.clearInterval(this.idInterval);
				}
			}
			else
			{
				if (this.activeRoute)
				{
					this.lineSymbol = {
						path: google.maps.SymbolPath.CIRCLE,
						scale: 7,
						strokeColor: '#393',
						strokeWeight: '#3776dd'
					};

					this.lineRoute = new google.maps.Polyline({
						path: this.route,
						icons: [{
							icon: this.lineSymbol,
							offset: '100%'
						}],
						strokeColor: '#4285f4',
						strokeOpacity: '.6',
						strokeWeight: 8,
						geodesic: true,
						map: this.myMap
					});

					let count = 0;
					let that = this;

					this.idInterval = window.setInterval( () => {
						count = (count + 1) % 200;
						let icons = that.lineRoute.get('icons');
						icons[0].offset = (count / 2) + '%';
						that.lineRoute.set('icons', icons);
					}, 20);
					// DirectionService display a route between two points
					// let directionsDisplay = new google.maps.DirectionsRenderer({
					// 	map: this.myMap
					// });
					// let directionsService = new google.maps.DirectionsService;

					// for (var i = 0; i < this.route.length - 1; i++) {
					// 	directionsService.route({
					// 		origin: new google.maps.LatLng(this.route[i].lat, this.route[i].lon),
					// 		destination: new google.maps.LatLng(this.route[i+1].lat, this.route[i+1].lon),
					// 		travelMode: google.maps.TravelMode.DRIVING
					// 		}, function(response, status) {
					// 			if (status == google.maps.DirectionsStatus.OK) {
					// 				directionsDisplay.setDirections(response);
					// 			}
					// 			else {
					// 				this.printMessage("Servicio de direcciones ha fallado por: "+status);
					// 			}
					// 	});
					// }
				}
				else
				{
					this.lineRoute.setMap(null);
					this.lineSymbol = null;
					window.clearInterval(this.idInterval);
				}
			}
		},

		markStop() {
			let position = null;
			let title = null;
			let map = null;

			if (isMobile)
			{
				position = new plugin.google.maps.LatLng(this.geoLat, this.geoLong);
				title = "Lat "+this.geoLat+" Long "+this.geoLong;
				map = myGoogleMap;
				myGoogleMap.addMarker({
					position: position,
					title: title,
					icon: this.bus_stop,
					animation: plugin.google.maps.Animation.DROP
					}, marker => {
						marker.showInfoWindow();
				});

				this.stopMarkers.push({
					title: title,
					map: map,
					position: position
				});
			}
			else
			{
				position = new google.maps.LatLng(this.geoLat, this.geoLong);
				title = "Lat "+this.geoLat+" Long "+this.geoLong;
				map = this.myMap;
				let marker = new google.maps.Marker({
					position: position,
					map: map,
					title: title,
					animation: google.maps.Animation.DROP,
					draggable: false
				});
				this.stopMarkers.push(marker);
			}
			console.log(this.stopMarkers);
		},

		saveRoute(Lat, Long, that) {
			if (isMobile)
			{
				this.route.push({
					lat: Lat,
					lng: Long,
					timestamp: new Date().getTime(),
					LatLng: new plugin.google.maps.LatLng(Lat, Long)
				});
			}
			else
			{
				that.route.push({
					lat: Lat,
					lng: Long,
					timestamp: new Date().getTime(),
					LatLng: new google.maps.LatLng(Lat, Long)
				});
			}
		},

		saveRouteStreet(Lat, Long) {
			this.routeStreet.push({
				lat: Lat,
				lng: Long,
				timestamp: new Date().getTime()
			})
		},

		clearMarkers(){
			for (let i=0; i < this.markers.length; i++)
				{
					this.markers[i].setMap(null);
				}
			for (let i=0; i < this.stopMarkers.length; i++)
				{
					this.stopMarkers[i].setMap(null);
				}
		},

		logs() {
			this.showCoords = !this.showCoords;
			document.getElementById("printMessage").style.visibility = this.showCoords ? "visible" : "hidden";
		},

		printMessage(msg) {
			this.message = msg;
			document.getElementById("printMessage").style.visibility = this.showCoords ? "visible" : "hidden";
		},

		geoError(data) {
			var errors = {
				1: 'Permiso denegado.',
				2: 'Posición no disponible.',
				3: 'Solicitud agotada. Reestableciendo su Ubicación'
			};
			this.printMessage(errors[data.code]);
		}
	}
}
</script>

<style lang="scss">

.mapContainer {
	background-color: rgba(0,0,0,0);

	button {
		cursor: pointer;
		border: 0;
		color: rgb(0, 0, 0);
		font-family: Roboto, Arial, sans-serif;
		user-select: none;
		font-size: 14px;
		background-color: rgba(255, 255, 255, .8);
		padding: 11px;
		-webkit-background-clip: padding-box;
		background-clip: padding-box;
		box-shadow: rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px;
		font-weight: 300;
		width: 38px;
	}
}

#map {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
}

#printMessage {
	position: absolute;
	bottom: 25px;
	background-color: white;
	width: inherit;
	text-align: left;
	margin: auto;

	color: rgb(0, 0, 0);
	font-family: Roboto, Arial, sans-serif;
	user-select: none;
	font-size: 11px;
	background-color: rgba(255, 255, 255, .8);
	padding: 8px;
	-webkit-background-clip: padding-box;
	background-clip: padding-box;
	box-shadow: rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px;
	font-weight: 400;
	z-index: 2;
}

#menu {
	position: absolute;
	top: 10px;
	left: 10px;
}

.options {
	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 5;

	display: flex;
	flex-direction: column;
}

</style>

<!-- para chequear
https://developers.google.com/maps/documentation/javascript/symbols?hl=es-419
https://developers.google.com/maps/documentation/javascript/geometry?hl=es-419
http://www.svennerberg.com/2011/04/calculating-distances-and-areas-in-google-maps-api-3/
https://www.base64-image.de/
https://medium.com/@devlucky/about-passive-event-listeners-224ff620e68c#.cmtcq9ygu
https://github.com/mapsplugin/cordova-plugin-googlemaps/wiki/Migrate-from-v1-to-v2
https://github.com/mapsplugin/cordova-plugin-googlemaps/wiki/Map
http://ionicons.com/
- - -
sudo cordova plugin add cordova.plugins.diagnostic
https://www.npmjs.com/package/cordova.plugins.diagnostic#islocationavailable

- - - cordova-plugin-googlemaps-custom
En googleMaps.java (android)
linea 1115:
comente el result para que no saque el cuadro de dialogo
case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
	Toast.makeText(activity, "Por favor active su GPS...", Toast.LENGTH_SHORT).show();
	GoogleMaps.this.sendNoResult(callbackContext);

linea 1261:
	Toast.makeText(activity, "Ajustando su ubicación...", Toast.LENGTH_SHORT).show();

GoogleMaps.m
Linea 578

cordova plugin add https://github.com/jfelipe11/cordova-plugin-googlemaps-custom --variable API_KEY_FOR_ANDROID="AIzaSyC-w7WOjp6Rgg4pZZDFW7Eqp6gR2AAlt4I" --variable API_KEY_FOR_IOS="AIzaSyCBaFBnuQuh97szyCwJ1yNW3_DpE43i31U" --save

https://github.com/scalessec/Toast
https://github.com/scalessec/Toast-Swift

Callback functions:
http://stackoverflow.com/questions/2190850/create-a-custom-callback-in-javascript
-->