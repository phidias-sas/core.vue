<template>
	<div id="santiago">
		<h1 @click="cambiarTitulo()">HOLA MUNDO</h1>
		<span>{{ titulo }}</span>
		<button @click="cargarDatos()">Cargar datos</button>
		<ul>
			<li v-for="persona in personas">{{ persona.firstName }}</li>
		</ul>
	</div>
</template>

<script>
export default {
	data() {
		return {
			titulo: 'hola este es el titulo',
			personas: []
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
		this.cargarDatos();
	}
}
</script>

<style lang="scss">
#santiago {
	border: 2px solid red;
	padding: 20px;
}
</style>