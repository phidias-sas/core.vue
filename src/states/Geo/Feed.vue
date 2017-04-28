<template>
	<div>
	<div class="mapContainer">
		<div id="controlMaps" class="options">
			<button 
				id     ="markStop"
				@click ="markStop()"
				title  ="Marcar parada">
				<i class="fa fa-thumb-tack"></i>
			</button>
		</div>
	</div>
	<div id="map" style="background-color: rgba(0,0,0,0):"> </div>
	</div>
</template>

<script>

import {load, loaded} from 'vue-google-maps';
import app from '../../store/app.js';
import deepstream from 'deepstream.io-client-js';
var dp = "wss://deepstream.phidias.co:6020/deepstream";

export default {
	name: "GeoFeed",

	created() {
		if (typeof google == "undefined") {
			load('AIzaSyCpSKazmH7T7ArBkdcPiRYaYG_QKhj7rRM', null, ['geometry']);
		}
	},

	data() {
		return {
			app,
			client: null,
			myMap: null,
			positions: [],
			car: 'M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z',
			flag_start: 'data:image/png;base64,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',
			bus_stop: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAI6wAACOsBFpDIHQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAF/SURBVFiF7dY/SAJhHMbx53d3ZVFBmGFIgQSBLTXVEA1NhTRUe2DhEA2NRVTSLdLeGJE1tdRU4SZt1RAETU61KJWdSUqgeO/b0h8y4c2zeCXuO97L+/Lh7n2Pl2CxgdGJLpXjnGuF3oto9NnqOqUpVicSKU4AHiWvtvwWBqgC9FeRe2ej28pE5+Wtryn5dJLxeYayPe77SuYyUl9Ss0t3ZUGu3TC3AqqyIgjzj4HV7dIBWZ9MA8eWKxLWSwdk7iECYb1tL7wJXf9wSN/UxLHQ7q078Eb0BkDeHioTnZp5ZVL6G/qMj6gO86iGQEgrjC9rshVv3cBk/odgKC4dxEHXIOY3gqEEIPuUEcW4Vhg2AmuJ90fSQBw4bGaF8fS0/uWmoAGYs7JgfSbX0RpP6ek+z2Kx0ZGtUJMzZlb2DaJvvxyyggGAwbGpfoWxKzLNzrPYcUI842fV0rEHYIPE2SBRNkiUDRJlg0TZIFE2SJQNEvV/QJyzNIAkc5iV3acFvQJ2dGrMoCEazAAAAABJRU5ErkJggg==',
			lastLatitude: 0,
			lastLongitude: 0,
			markers: [],
			rotation: 0
		}
	},

	mounted() {

		this.client = deepstream(dp).login();

		this.client.event.subscribe('transport/8jmmgsc6', this.markPosition);

		loaded.then(() => {
			if (!navigator.geolocation) {
				console.log("Geolocalización no es soportada en este browser");
				return;
			}

			navigator.geolocation.getCurrentPosition(data => {
				this.lastLatitude  = data.coords.latitude,
				this.lastLongitude = data.coords.longitude;
				this.getMap();
			});
		});

		this.client.event.listen('transport/8jmmgsc6', (eventName, isSubscribed, response) => {
			if (isSubscribed) {
				response.accept();
			}
			else {
				response.reject();
			}
		});
	},

	methods: {
		getMap() {
			let position = null;
			let marker   = null;
			this.myMap = new google.maps.Map(document.getElementById('map'), {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: {
					lat: this.lastLatitude, 
					lng: this.lastLongitude
				},
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
			position = new google.maps.LatLng(this.lastLatitude, this.lastLongitude);
			marker = new google.maps.Marker({
				position: position,
				map: this.myMap,
				icon: this.flag_start,
				animation: google.maps.Animation.DROP
			});
		},
		markPosition(data) {
			let newPosition  = new google.maps.LatLng(data.latitude, data.longitude);
			
			let icon = {
				path: this.car,
				scale: .5,
				strokeColor: 'white',
				strokeWeight: .10,
				fillOpacity: 1,
				rotation: this.rotation,
				fillColor: '#124796',
				offset: '5%',
				anchor: new google.maps.Point(10, 25)
			};
			this.positions.push(newPosition);

			this.myMap.panTo(newPosition);

			let infoMarker = new google.maps.InfoWindow({
				content: '<img src="'+this.app.user.avatar+'">'
			});
			
			let marker = new google.maps.Marker({
				position: newPosition,
				map: this.myMap,
				icon: icon,
				title: this.app.user.firstName,
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
		markStop() {
			this.client.event.unsubscribe('transport/8jmmgsc6');
			let position = new google.maps.LatLng(this.lastLatitude, this.lastLongitude);
			let marker = new google.maps.Marker({
				position: position,
				map: this.myMap,
				icon: this.bus_stop,
				title: this.lastLatitude+" , "+this.lastLongitude,
				animation: google.maps.Animation.DROP
			});
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