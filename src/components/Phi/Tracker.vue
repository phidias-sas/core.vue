<template></template>

<script>
import app from '../../store/app.js';
var intervalPosition = null;

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
		}
	},

	data() {
		return {
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
			},
			geoOptions: {
				enableHighAccuracy: false,
				maximumAge: 0,
				timeout: 5000
			},
			interval: null
		}
	},

	watch: {
		enabled: function(value) {
			if (!value) {
				clearInterval(this.interval);
			} else {
				this.trackPosition();
			}
		},

		every: function(value) {
			clearInterval(this.interval);
			this.trackPosition();
		}
	},

	methods: {
		pushPosition() {
			if (!navigator.geolocation) {
				console.log("Geolocalización no es soportada en este browser");
				return;
			}

			navigator.geolocation.getCurrentPosition(data => {
				this.position.latitude         = data.coords.latitude,
				this.position.longitude        = data.coords.longitude,
				this.position.altitude         = data.coords.altitude,
				this.position.accuracy         = data.coords.accuracy
				this.position.altitudeAccuracy = data.coords.altitudeAccuracy,
				this.position.heading          = data.coords.heading,
				this.position.speed            = data.coords.speed
				this.position.timestamp        = Math.round(data.timestamp / 1000);

				app.api
					.post(`geo/targets/${this.target}/position`, this.position)
					.then(data => this.$emit("update", data));

			}, this.handleError, this.geoOptions);

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
				3: 'Solicitud agotada. Reestableciendo su Ubicación'
			};
			console.log(errors[data.code]);
		}
	}
}
</script>