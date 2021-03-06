<template>
	<phi-page :loading="app.api.isLoading">

		<div slot="toolbar">
			<button @click="$parent.$el.left.toggle()">
				<i class="fa fa-bars"></i>
			</button>
			<h1>{{ $t('Settings') }}</h1>
		</div>

		<div v-if="app.user">
			<section v-if="destinations.length">
				<h2>{{ $t('Notifications') }}</h2>
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
								<mu-switch :value="destination.isEnabled == '1'" @change="toggleDestination(destination)"  />
							</div>
						</div>
						<phi-drawer :open="destination.drawerIsOpen">
							<div v-for="preference in destination.preferences" class="phi-media" >
								<div class="phi-media-body">{{preference.type}}</div>
								<mu-switch class="phi-media-right" :value="preference.isEnabled == '1'" @change="togglePreference(preference, destination)"  />
							</div>
						</phi-drawer>
					</div>
				</div>
			</section>

			<section>
				<h2>{{ $t('Language') }}</h2>
				<div class="phi-card">
					<div class="phi-media">
						<div class="phi-media-right fa" :class="locale.language == 'es' ? 'fa-check' : ''"></div>
						<a class="phi-media-body" @click="locale.set('es')">Español</a>
					</div>
					<div class="phi-media">
						<div class="phi-media-right fa" :class="locale.language == 'en' ? 'fa-check' : ''"></div>
						<a class="phi-media-body" @click="locale.set('en')">English</a>
					</div>
				</div>
			</section>

			<section>
				<h2>{{ $t('General') }}</h2>
				<div class="phi-card">
					<div class="phi-media clear-cache" @click="clearCache">
						<div class="phi-media-figure fa fa-trash-o"></div>
						<div class="phi-media-body">{{ $t('Clear cache') }}</div>
					</div>
					<div class="phi-media logout" @click="logout">
						<div class="phi-media-figure fa fa-sign-out"></div>
						<div class="phi-media-body">{{ $t('Logout') }}</div>
					</div>
				</div>
			</section>
		</div>
	</phi-page>
</template>

<script>
import PhiDrawer from '../components/Phi/Drawer.vue';
import app from '../store/app.js';
import locale from '../store/i18n.js';

export default {
	name: "settings",
	components: {PhiDrawer},
	data() {
		return {
			app,
			locale,
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
			this.app.api.cache.empty().then(() => { alert("Caché eliminado") });
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
		},

		logout() {
			this.app.logout();
			this.$router.push('login');
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

.phi-media-body {
	align-self: center;
}

.phi-media-figure {
	align-self: center;
	text-align: center;
}

.logout {
	color: #df3e3e;
}
</style>