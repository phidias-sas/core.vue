<template>
	<div id="state-sebas">
		<div class="phi-page">

			<div class="phi-page-cover">
				<div class="phi-page-toolbar">
					<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
					<h1>Sebastian</h1>
				</div>
			</div>
				
			<div class="phi-page-contents">
				<div class="phi-card">
					<div class="phi-media">
						<button @click="buscar" class="phi-button">Mi ubicacion</button>
					</div>
				</div>
				<br>
				
				<div id="mapa" v-show="latitud"></div>
			</div>
			
		</div>
	</div>
</template>

<script>
import app from '../store/app.js'

export default{
	data() {
		return {
			app,
			latitud: '',
			longitud: ''
		}
	},
	methods:{
		buscar(){
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(this.showPosition,this.showErrors);
			}else{
				alert("EL navigator no lo soporta");
			}
		},
		showPosition(position){
			this.latitud  = position.coords.latitude;
			this.longitud = position.coords.longitude;
			var latlon    = new google.maps.LatLng(this.latitud, this.longitud);

			var mapa = new google.maps.Map(document.getElementById("mapa"),{
				center: latlon,
				zoom: 17,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});

			var marker = new google.maps.Marker({
				position: latlon,
				map: mapa,
				title: this.app.user.firstName,
				// draggable: true,
				animation: google.maps.Animation.DROP
			});
		},
		showErrors(error){
			if(error.code == error.PERMISSION_DENIED){
				alert("ADVRETENCIA: Aceptar el permiso...");
			}
		}
	}
}
</script>

<style lang="scss">
	#state-sebas{
		#mapa{
			width: 100%;
			height: 400px;
		}

		button .phi-button{
			background-color: #FFC107;
		}
	}
</style>