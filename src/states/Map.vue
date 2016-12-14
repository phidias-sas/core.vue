<template>
	<div>
		<button class="phi-button" @click="locate()">Mi ubicacion</button>
		<g-map
			ref="mainMap"
			style="position: absolute; top:0; left:0; right:0; bottom:0; width: 100%; height: 100%"
			:center="center"
			:zoom="zoom"
		>
			<g-marker v-if="myMarker.position" :position="myMarker.position">
				<g-info-window>
					<div class="myInfoWindow">
						<img :src="app.user.avatar" />
					</div>
				</g-info-window>
			</g-marker>

			<g-marker v-for="m in markers"
				:position="m.position"
				:draggable="m.draggable"
				:xxxxicon="m.icon"
			></g-marker>
		</g-map>
	</div>
</template>

<script>
import app from '../store/app.js';

import {load, loaded, Map, Marker, InfoWindow} from 'vue-google-maps';
load('AIzaSyCpSKazmH7T7ArBkdcPiRYaYG_QKhj7rRM');

export default {

	mounted() {
		loaded.then(() => {
			this.myMarker.icon = {
				url:    app.user.avatar,
				size:   new google.maps.Size(20, 32), // This marker is 20 pixels wide by 32 pixels high.
				origin: new google.maps.Point(0, 0), // The origin for this image is (0, 0).
				anchor: new google.maps.Point(0, 32) // The anchor for this image is the base of the flagpole at (0, 32).
			};

			setTimeout(() => {
				this.$refs.mainMap.$emit('g-resize-map');
			}, 1000);
		});
	},

	data() {

		return {
			app,
			center: {lat: 1.38, lng: 103.8},
			zoom: 8,

			myMarker: {
				position: null
			},

			markers: [
				// {
				// 	position: {lat: 1.38, lng: 103.8},
				// 	draggable: true,
				// 	icon: 'static/icons/drawable-ldpi-icon.png'
				// },
				// {
				// 	position: {lat: 11.0, lng: 11.0},
				// 	draggable: true
				// }
			]
		}
	},

	methods: {
		locate() {
			navigator.geolocation.getCurrentPosition(position => {
				var coords = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				this.myMarker.position = coords;
				this.zoom = 12;
				this.$refs.mainMap.$emit('g-panTo', coords);
			}, error => {
				console.log("error getting location", error);
				alert("Oops! No fue posible detectar tu ubicacion")
			}, {
				enableHighAccuracy: true
			});
		}
	},

	components: {
		'g-map': Map,
		'g-marker': Marker,
		'g-info-window': InfoWindow
	}
}
</script>

<style lang="scss">
.myInfoWindow {
	width: 60px;
	height: 75px;
	overflow: hidden;
	img {
		width: 100%;
	}
}
</style>

<style lang="scss" scoped>
.phi-button {
	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 2;
}
</style>