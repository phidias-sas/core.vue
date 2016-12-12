<template>
	<div id="state-sebas">
		<button @click="listarPersonas">Listar personas</button>
		
		<ons-page>
			<ons-toolbar>
				<div class="left">
					<router-link to="dashboard"><ons-back-button>Back</ons-back-button></router-link>
				</div>
				<div class="center">{{ state }}</div>
				<div class="right">
					<ons-toolbar-button @click="refresh"><i class="fa fa-refresh"></i></ons-toolbar-button>
				</div>
			</ons-toolbar>

			<div class="contenido">
				<ons-row>
					<ons-col width="20%">
						<button class="button button--material" @click="listarPersonas()">Listar personas</button>
					</ons-col>
					<ons-col>
						<div v-show="loader">
							<ons-progress-circular indeterminate></ons-progress-circular>
						</div>
					</ons-col>
				</ons-row>
				<br>


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
			personas: [],
			loader: false,
		}
	},
	methods:{
		listarPersonas () {
			this.loader = true,
			fetch('https://phidias.api.phidias.co/people')
			.then(response => response.json())
			.then(datos => {
				this.personas = datos;
				this.loader = false;
			});
		},

		refresh () {
			location.reload();
		}
	}
}
</script>

<style lang="scss">
	#state-sebas{
		.navigation-bar--material{
			background: #673AB7;
		}
		.contenido{
			padding: 15px;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
		}
		.button{
			background: red;
		}
	}
</style>