<template>
	<div id="test">
		<h1>Huh</h1>
	</div>
</template>

<script>
window.jQuery = window.$ = require('jquery')

export default {
	data() {
		return {
			titulo: 'hola este es el titulo',
			personas: [],
			events: [
				{
					title  : 'event1',
					start  : '2010-01-01',
				},
				{
					title  : 'event2',
					start  : '2010-01-05',
					end    : '2010-01-07',
				},
				{
					title  : 'event3',
					start  : '2010-01-09T12:30:00',
					allDay : false,
				}
			]
		}
	},

	methods: {
		cambiarTitulo() {
			this.titulo = 'el titulo ha cambiado';
		},

		cargarDatos() {
			fetch('https://phidias.api.phidias.co/people')
				.then(response => response.json())
				.then(datos => {
					this.personas = datos;
				});
		}
	},

	mounted() {
		// this.cargarDatos();
	}
}
</script>

<style lang="scss">
#test {
	border: 2px solid red;
	padding: 20px;
}
</style>