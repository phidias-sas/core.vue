<template>
	<div>
		<div class="controls">
			<button id="menu" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
			<button id="myLocation" @click="locate()">Mi ubicacion</button>
		</div>
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
				// center: {lat: -34.397, lng: 150.644},
				mapTypeControl: true,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
					position: google.maps.ControlPosition.TOP_CENTER
				},
				zoom: 18
			});

			this.myLocation = new google.maps.InfoWindow({
				content:
					`<div class="myPosition">
						<img src="${app.user.avatar}">
					</div>`
			});

			/* Trigger a resize after 800ms.  This redraws the element correctly ¯\_(ツ)_/¯ */
			setTimeout(() => {
				google.maps.event.trigger(this.map, "resize");

				this.locate();
			}, 800);

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

	#myLocation {
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
	}
}

</style>