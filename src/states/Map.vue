<template>
	<div>
		<button class="phi-button" @click="locate()">Mi ubicacion</button>
		<div id="main-map"></div>
	</div>
</template>

<script>
import app from '../store/app.js';
import {load, loaded} from 'vue-google-maps';

export default {

	created() {
		if (typeof google == "undefined") {
			load('AIzaSyCpSKazmH7T7ArBkdcPiRYaYG_QKhj7rRM');
		}
	},

	mounted() {
		loaded.then(() => {

			// Create a map object and specify the DOM element for display.
			this.map = new google.maps.Map(document.getElementById('main-map'), {
				center: {lat: -34.397, lng: 150.644},
				zoom: 9
			});

			this.myLocation = new google.maps.InfoWindow({
				content: `<div class="myPosition">
						<img src="${app.user.avatar}">
					</div>`
			});

			setTimeout(() => {
				google.maps.event.trigger(this.map, "resize");
			}, 1000);
		});
	},

	data() {
		return {
			app,
			center: {lat: 1.38, lng: 103.8},
			zoom: 8,

			map: null,
			myLocation: null
		}
	},

	methods: {
		locate() {
			navigator.geolocation.getCurrentPosition(position => {
				var coords = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				this.myLocation.setPosition(coords);
				this.myLocation.open(this.map);

				this.map.setZoom(18);
				this.map.panTo(coords);
			}, error => {
				console.log("error getting location", error);
				alert("Oops! No fue posible detectar tu ubicacion")
			}, {
				enableHighAccuracy: true
			});
		}
	}
}
</script>

<style lang="scss">
#main-map {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
}

.myPosition {
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