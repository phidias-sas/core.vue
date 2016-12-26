<template>
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()">
					<i class="fa fa-bars"></i>
				</button>
				<h1>Preferencias</h1>
			</div>
		</div>

		<ons-progress-bar indeterminate v-show="app.api.isLoading"></ons-progress-bar>

		<div class="phi-page-contents">

			<section v-if="destinations.length">
				<h2>Notificaciones</h2>
				<div class="phi-card">
					<div
						v-for="destination in destinations" 
						v-if="destination.transport == 'gcm' || destination.transport == 'email'"
					>
						<div class="phi-media">
							<div
								@click="destination.drawerIsOpen = !destination.drawerIsOpen"
								class="phi-media-figure fa"
								:class="destination.drawerIsOpen ? 'fa-chevron-down' : 'fa-chevron-right'"
							></div>
							<div
								class="phi-media-body"
								@click="destination.drawerIsOpen = !destination.drawerIsOpen"
							>
								{{destination.transport == 'gcm' ? 'Aplicación móvil' : 'E-mail'}}
							</div>
							<div class="phi-media-right">
								<ons-switch
									:checked="destination.isEnabled == '1'"
									@change="toggleDestination(destination)">
								</ons-switch>
							</div>
						</div>
						<phi-drawer :open="destination.drawerIsOpen">
							<div v-for="preference in destination.preferences" class="phi-media" >
								<div class="phi-media-body">{{preference.type}}</div>
								<ons-switch class="phi-media-right"
									:checked="preference.isEnabled == '1'"
									@change="togglePreference(preference, destination)">
								</ons-switch>
							</div>
						</phi-drawer>
					</div>
					
				</div>
			</section>

			<section>
				<h2>General</h2>
				<div class="phi-card">
					<div class="phi-media" @click="clearCache">
						<div class="phi-media-figure fa fa-trash-o"></div>
						<div class="phi-media-body">Limpiar cache</div>
					</div>
				</div>
			</section>


		</div>
	</div>
</template>

<script>
import PhiDrawer from '../components/Phi/Drawer.vue';
import app from '../store/app.js';

export default {
	name: "settings",
	components: {PhiDrawer},
	data() {
		return {
			app,
			destinations: []
		}
	},

	mounted() {

		app.api
			.get('types/post')
			.then(types => {
				app.api
					.collection(`people/${app.user.id}/notification/destinations`)
					.fetch()
					.then(destinations => {
						this.destinations = destinations.map(destination => {
							if (destination.preferences.length == 0) {
								destinations.preferences = [];
								types.forEach(type => {
									destination.preferences.push({
										destination: destination.id,
										type:        type.singular,
										isEnabled:   "1",
										schedule:    null
									});
								});
							}

							destination.drawerIsOpen = false;
							return destination;
						});
					});
			});
	},

	methods: {
		clearCache() {
			if (confirm('Se limpiarán los datos del almacenamiento temporal.\n\nDesea continuar?')) {
				this.app.api.cache.empty().then(() => { alert("Caché eliminado") });
			}
		},

		toggleDestination(destination) {
			destination.isEnabled = destination.isEnabled == "1" ? "0" : "1";
			app.api.put(`people/${app.user.id}/notification/destinations/${destination.id}`, {
				isEnabled: destination.isEnabled
			})
			.then(() => app.api.clear(`people/${app.user.id}/notification/destinations`));  //limpiar cache
		},

		togglePreference(preference, destination) {
			preference.isEnabled = preference.isEnabled == "1" ? "0" : "1";
			app.api.put(`people/${app.user.id}/notification/destinations/${destination.id}`, {
				preferences: destination.preferences
			})
			.then(() => app.api.clear(`people/${app.user.id}/notification/destinations`));  //limpiar cache
		}

	}
}
</script>

<style lang="scss" scoped>
section {
	margin-bottom: 2em;

	h2 {
		font-weight: 1em;
		text-transform: uppercase;
		color: #666;
		margin-bottom: 0.5em;
		font-size: 0.8em;
	}

}

.phi-media-figure {
	text-align: center;
}
</style>