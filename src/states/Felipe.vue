<!-- <template>
<div id="Felipe">
	<ons-page>
	<ons-toolbar>
		<div class="center">Opciones</div>
	</ons-toolbar>
	
	<ons-list>
	<ons-list-header > Opciones </ons-list-header>
		<ons-list-item v-for="calendar in registros">
			<div class="left">
				<img class="list__item__thumbnail" src="http://placekitten.com/g/40/40">
			</div>
			<div class="center">
				<span class="list__item__title">{{ calendar.title }}</span>
				<span class="list__item__subtitle">{{ calendar.postEvent.post.type }}</span>
			</div>
			<label class="right">
				<ons-switch></ons-switch>
			</label>
		</ons-list-item>
	</ons-list>
	</ons-page>
</div>
</template>

<script>
export default {
	data() {
		return {
			registros: []	
		}
	},
	methods: {
		loadDataAPI: function(){

			fetch("https://phidias.api.phidias.co/people/7/calendar/feed?start=12-12-2016&end=13-12-2016")
				.then(response => response.json())
				.then(datos => {
					this.registros = datos;
				});
		}
	},
	mounted() {
		this.loadDataAPI();
	}
}

</script>

<style lang="scss"></style> -->

<template>
	<div id="Felipe">
		<ons-page>
		<ons-toolbar><div class="center">Preferencias</div></ons-toolbar>
		<ons-list>
			<ons-list-header>Notificaciones</ons-list-header>
			<ons-list-item>
				<div class="left">
				<i class="fa fa-bell-o"></i>
				</div>
				<div class="center">Habilitar Notificaciones</div>
				<div class="right"><ons-switch></ons-switch></div>
			</ons-list-item>
			<ons-list-header>General</ons-list-header>
			<ons-list-item>
				<div class="left">
				<i class="fa fa-key"></i>
				</div>
				<div class="center">Cambiar contraseña</div>
			</ons-list-item>
			<ons-list-item>
				<div class="left">
				<i class="fa fa-question-circle-o"></i>
				</div>
				<div class="center">
					<button class="phi-button" @click="showHelp(this)">
					Acerca de
					</button>
				</div>
			</ons-list-item>
			<ons-list-item>
				<div class="left"> 
				<i class="fa fa-trash"></i>
				</div>
				<div clas="center">
				<button class="phi-button" @click="cacheDelete">
					Borrar cache
				</button>
				</div>
			</ons-list-item>
		</ons-list>
		<ons-popover direction="up" id="popover">
			<div style="padding: 10px; text-align: center;">
				<p>	Software desarrollado por Phidias S.A.S</p>
			</div>
		</ons-popover>
		</ons-page>
	</div>
</template>

<script>
import app from '../store/app.js'

export default {
	name: "Felipe",
	
	data () {
		return {
			app
		}
	},

	methods: {
		cacheDelete() {
			this.app.api.cache.empty().then(() => { alert("Cache borrado") });
		},
		showHelp(target) {
			document
			.getElementById('popover')
			.show(target);
		}
	}
}
</script>

<style>

</style>