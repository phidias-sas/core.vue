<template>
	<div class="phi-card" style="margin-top: 5px;">
		<div id="map" style="background-color: rgba(0,0,0,0):"> </div>
	</div>
</template>

<script>
import {load, loaded} from 'vue-google-maps';
import deepstream from 'deepstream.io-client-js';
import app from '../../store/app.js';
var intervalPosition = null;
var dp = "wss://deepstream.phidias.co:6020/deepstream";

export default{
	props: {
		target:{
			type: String,
			required: true
		},

		every:{
			type: Number,
			required: true
		},

		enabled:{
			type: Boolean,
			required: true
		},

		targetName:{
			type: String,
			required: true
		}
	},

	created() {
		if (typeof google == "undefined") {
			load('AIzaSyCpSKazmH7T7ArBkdcPiRYaYG_QKhj7rRM', null, ['geometry']);
		}
	},

	data() {
		return {
			app,
			myMap: null,
			position: {
				latitude: null,
				longitude: null,
				altitude: null,
				accuracy: null,
				altitudeAccuracy: null,
				heading: null,
				speed: null,
				author: null,
				timestamp: null,
				client: null,
				record: null
			},
			geoOptions: {
				enableHighAccuracy: false,
				maximumAge: 0,
				timeout: 5000
			},
			interval: null,
            client: null,
            lastLatitude: null,
            lastLongitude: null,
            car: 'M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z',
            bus_stop: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAI6wAACOsBFpDIHQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAF/SURBVFiF7dY/SAJhHMbx53d3ZVFBmGFIgQSBLTXVEA1NhTRUe2DhEA2NRVTSLdLeGJE1tdRU4SZt1RAETU61KJWdSUqgeO/b0h8y4c2zeCXuO97L+/Lh7n2Pl2CxgdGJLpXjnGuF3oto9NnqOqUpVicSKU4AHiWvtvwWBqgC9FeRe2ej28pE5+Wtryn5dJLxeYayPe77SuYyUl9Ss0t3ZUGu3TC3AqqyIgjzj4HV7dIBWZ9MA8eWKxLWSwdk7iECYb1tL7wJXf9wSN/UxLHQ7q078Eb0BkDeHioTnZp5ZVL6G/qMj6gO86iGQEgrjC9rshVv3cBk/odgKC4dxEHXIOY3gqEEIPuUEcW4Vhg2AmuJ90fSQBw4bGaF8fS0/uWmoAGYs7JgfSbX0RpP6ek+z2Kx0ZGtUJMzZlb2DaJvvxyyggGAwbGpfoWxKzLNzrPYcUI842fV0rEHYIPE2SBRNkiUDRJlg0TZIFE2SJQNEvV/QJyzNIAkc5iV3acFvQJ2dGrMoCEazAAAAABJRU5ErkJggg==',
            rotation: 0,
            positions: [],
            markers: []
		}
	},
	mounted() {
		loaded.then(() => {
			if (!navigator.geolocation) {
				console.log("Geolocalización no es soportada en este browser");
				return;
			}

			navigator.geolocation.getCurrentPosition(data => {
				this.lastLatitude  = data.coords.latitude,
				this.lastLongitude = data.coords.longitude;
				this.getMap();
				
				let marker = new google.maps.Marker({
					position: new google.maps.LatLng(this.lastLatitude, this.lastLongitude),
					map: this.myMap,
					icon: this.bus_stop,
					animation: google.maps.Animation.DROP
				});
			});

		});
	},
	watch: {
		enabled: function(value) {
			if (!value) {
				clearInterval(this.interval);
			} else {
				this.mountDeepstream();
				this.trackPosition();
			}
		},

		every: function(value) {
			clearInterval(this.interval);
			this.trackPosition();
		}
	},

	methods: {
		getMap() {
			let position = null;
			let marker   = null;
			this.myMap = new google.maps.Map(document.getElementById('map'), {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: {lat: this.lastLatitude, lng: this.lastLongitude},
				zoom: 15,
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
		},
		mountDeepstream() {
			this.client = deepstream(dp).login();
			this.client.event.emit('transport/8jmmgsc6', 'Ruta 1A');
		},
		pushPosition() {
			if (!navigator.geolocation) {
				console.log("Geolocalización no es soportada en este browser");
				return;
			}

			navigator.geolocation.getCurrentPosition(data => {
				this.position.latitude         = data.coords.latitude + (Math.random() * 0.005),
				this.position.longitude        = data.coords.longitude + (Math.random() * 0.005),
				this.position.altitude         = data.coords.altitude,
				this.position.accuracy         = data.coords.accuracy
				this.position.altitudeAccuracy = data.coords.altitudeAccuracy,
				this.position.heading          = data.coords.heading,
				this.position.speed            = data.coords.speed
				this.position.timestamp        = Math.round(data.timestamp / 1000);

				app.api
					.post(`geo/targets/${this.target}/position`, this.position)
					.then(data => this.$emit("update", Object.assign({}, this.position)));
				
				this.client.event.emit('transport/8jmmgsc6', this.position);
				this.markPosition(this.position);

			}, this.handleError, this.geoOptions);

		},
		markPosition(data) {
			let newPosition  = new google.maps.LatLng(data.latitude, data.longitude);
			
			let icon = {
				path: this.car,
				scale: .5,
				strokeColor: 'white',
				strokeWeight: .10,
				fillOpacity: 1,
				fillColor: '#d30808',
				offset: '5%',
				rotation: this.rotation,
				anchor: new google.maps.Point(10, 25)
			};
			this.positions.push(newPosition);

			let marker = new google.maps.Marker({
				position: newPosition,
				map: this.myMap,
				icon: icon,
				title: this.targetName,
				draggable: false
			});

			this.markers.push(marker);
			if (this.markers.length > 1)
			{
				for (let i=0; i < this.markers.length - 1; i++)
					{
						this.markers[i].setVisible(false);
					}
				this.rotation = google.maps.geometry.spherical.computeHeading(new google.maps.LatLng(this.lastLatitude,this.lastLongitude),new google.maps.LatLng(data.latitude,data.longitude));
			}

			this.lastLatitude  = data.latitude;
			this.lastLongitude = data.longitude;
		},
		trackPosition() {
			if (!this.enabled) {
				return;
			}

			this.interval = setInterval(this.pushPosition, this.every);
		},

		handleError(data) {
			var errors = {
				1: 'Permiso denegado.',
				2: 'Posición no disponible.',
				3: 'Solicitud agotada. Reestableciendo su Ubicación.'
			};
			console.log(errors[data.code]);
		}
	}
}
</script>

<style lang="scss" scoped>
.mapContainer {
	background-color: rgba(0,0,0,0);
}
#map {
	position: absolute;
	top: 150px;
	bottom: 0;
	width: 100%;
	height: 75%;
}
</style>