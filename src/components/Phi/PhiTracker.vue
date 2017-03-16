<template>
	<div id="phi-tracker"></div>
</template>

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
		}
	},

	data () {
		return {
			geo: {
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
			geoOptions:{
				enableHighAccuracy: false, 
				maximumAge: 0, 
				timeout: 5000
			}
		}
	},

	mounted () {
		this.MyPosition();
	},

	methods: {
		MyPosition() {
			// Obtain my Position "every" time ...
			var that = this;
			intervalPosition = setInterval(
				function () { 
					if ( navigator.geolocation ) {
						navigator.geolocation.getCurrentPosition(data => {
							
							that.geo.latitude = data.coords.latitude,
							that.geo.longitude = data.coords.longitude,
							that.geo.altitude = data.coords.altitude,
							that.geo.accuracy = data.coords.accuracy
							that.geo.altitudeAccuracy = data.coords.altitudeAccuracy,
							that.geo.heading = data.coords.heading,
							that.geo.speed = data.coords.speed

							that.geo.author = app.user.id;
							that.geo.timestamp = Math.round(data.timestamp / 1000);
							
							// Sending data 
							app.api.post(`geo/targets/${that.target}/position`, that.geo)
								.then(data => {
									console.log(data);
								});
						}, that.geoError, that.geoOptions);
					}
					else {
						console.log("Geolocalización no es soportada en este browser");
					}		
				},  this.every);
		},

		geoError(data) {
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

<style lang="scss" scoped>

#phi-tracker{

}

</style>