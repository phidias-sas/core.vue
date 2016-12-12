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
					<ons-toolbar-button @click="refresh()" title="Recargar pagina"><i class="fa fa-refresh"></i></ons-toolbar-button>
					<ons-toolbar-button @click="borrarCache()" title="Borrar Cache"><i class="fa fa-trash"></i></ons-toolbar-button>
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
				
				<div class="lista">
					<ons-list-item v-for="persona in personas">
						<div class="left">
							<img class="list__item__thumbnail" :src="persona.avatar">
						</div>
						<div class="center">
							<span class="list__item__title">{{ persona.firstName }}</span><span class="list__item__subtitle">{{ persona.email }}</span>
						</div>
					</ons-list-item>
				</div>
			</div>
		</ons-page>
		
	</div>
</template>

<script>
import app from '../store/app.js'

export default{
	data() {
		return {
			app,
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
		},

		borrarCache () {
			this.app.api.cache.empty().then(() => { alert("Se borró el cache") });
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
		.lista{
			width: 100%;
			height: 480px;
			overflow-y: scroll; 
		}
	}
</style>