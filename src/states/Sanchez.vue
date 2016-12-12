<template>
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
				<h1>Opciones</h1>
			</div>
		</div>
		<div class="phi-page-contents">
			<div class="phi-card _z-0">
				<div class="phi-media">
					<div>
						<h2>Acerca de</h2>
						<br>
						<p>
							Aplicación desarrollada por Phidias SAS
						</p>
						<br><br>
						<p >  
							Desea  borrar  el caché?
							<ons-button  @click="clearCache()"> <i class="fa fa-trash-o" aria-hidden="true"></i> Borrar</ons-button>
						</p><br><br>
						<p >  
							Registrar notificaciones
							<ons-button  @click="registerPush()"> <i class="fa fa-cog" aria-hidden="true"></i> Registrar</ons-button>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import app from '../store/app.js'

export default {
	data() {
		return {
			app
		}
	},
	methods: {
		clearCache() {
			this.app.api.cache.empty().then(() => { alert("Cache borrado") });
		},

		registerPush() {
			return app.registerPushNotifications();
		}
	},

	mounted() {
	}
}
</script>






<!--
<template>
	<div id="sanchez">
		<button @click="cargarDatos()">Cargar datos</button>
		<h1 @click="showEvents()">Show events</h1>
		<div>
			
		</div>
		<div id='calendar'></div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			titulo: 'hola este es el titulo',
			events: []
		}
	},

	methods: {
		showEvents() {
			var jQuery = require("jquery");
			import fullcalendar from 'fullcalendar';
			console.table(this.events);
			jQuery('#calendar').fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay,listWeek'
				},
				navLinks: true, // can click day/week names to navigate views
				editable: true,
        		events: this.events
   			});
		},

		cargarDatos() {

			var myHeaders = new Headers();
			myHeaders.append("Accept", "application/json+fullcalendar");
			fetch('http://localhost:3000/events')
				.then(response => response.json())
				.then(datos => {
					this.events = datos;
				});
		}
	},

	mounted() {
		this.cargarDatos();
		var jQuery = require("jquery");
			console.table(this.events);
			jQuery('#calendar').fullCalendar({
        		events: this.events
   			});
	}
}
</script>
-->
