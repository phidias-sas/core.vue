<template>
	<div id="state-sebas">
		<button @click="listarPersonas">Listar personas</button>
		
		<ons-page>
			<ons-toolbar>
				<div class="left">
					<ons-back-button>Back</ons-back-button>
				</div>
				<div class="center">{{ state }}</div>
			</ons-toolbar>
			<div class="contenido">
				<button class="button"><router-link to="dashboard">Volver</router-link></button>
				<button class="button" @click="listarPersonas()">Listar personas</button>
				<br><br>


				<ul class="list">
					<li class="list__item list__item--chevron" v-for="persona in personas">
						<div class="list__item__center">{{ persona.firstName }}</div>
					</li>
				</ul>
			</div>
		</ons-page>

	</div>
</template>

<script>
export default{
	data() {
		return {
			state: 'Sebastian',
			personas: []
		}
	},
	methods:{
		listarPersonas () {
			fetch('https://phidias.api.phidias.co/people')
			.then(response => response.json())
			.then(datos => {
				this.personas = datos;
			});
		}
	}
}
</script>

<style lang="scss">
	#state-sebas{
		.navigation-bar--material{
			background: #2196F3;
		}
		.contenido{
			padding: 15px;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
		}
	}
</style>