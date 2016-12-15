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

		<ons-progress-bar indeterminate v-show="loadingEvents"></ons-progress-bar>

		<div class="phi-page-contents">

			<div class="phi-card">
				<div class="phi-media">
					<div class="phi-media-figure fa fa-bell-o"></div>
					<div class="phi-media-body">Notificaciones</div>
					<ons-switch class="phi-media-right"
						:checked="openNotifications"
						@change="markGeneralNotification(preferenceDest, openNotifications = !openNotifications)">
					</ons-switch>
				</div>
				<phi-drawer :open="openNotifications">
					<div class="phi-media" v-for="preference in preferences">
						<div class="phi-media-body">{{ preference.type }}</div>
						<ons-switch class="phi-media-right"
							:checked="preference.isEnabled == '1'"
							@change="togglePreference(preference)">
						</ons-switch>
					</div>
				</phi-drawer>
			</div>

			<div class="phi-card">
				<div class="phi-media" @click="openGeneral = !openGeneral">
					<div class="phi-media-figure fa fa-cog"></div>
					<div class="phi-media-body">General</div>
					<div class="phi-media-right fa" :class="openGeneral ? 'fa-chevron-down' : 'fa-chevron-right'"></div>
				</div>
				<phi-drawer :open="openGeneral">
					<div class="phi-media">
						<button class="phi-button" @click="cacheDelete()">
							<i class="fa fa-trash-o" aria-hidden="true"></i>
							<span>Limpiar cache</span>
						</button>
					</div>
				</phi-drawer>
			</div>

		</div>
	</div>
</template>

<script>
import app from '../store/app.js'

export default {
	name: "settings",

	data() {
		return {
			app,
			preferences: [],
			postTypes: [],
			loadingEvents: false,
			openNotifications: false,
			openGeneral: false,
			preferenceDest: null
		}
	},

	mounted() {
		this.getPreferences();
	},

	methods: {

		cacheDelete() {
			this.app.api.cache.empty().then(() => { alert("Cache borrado") });
		},

		getPreferences() {

			/* Load post types */
			app.api.get('types/post')
				.then(datos => {
					datos.forEach(dato => {
						this.postTypes.push({
							type: dato.singular,
							isEnabled: 1
						})
					})
				});

			/* Load preferences from gcm transport type*/
			app.api.get(`people/${app.user.id}/notification/destinations`)
				.then(data => {
					data.forEach(dato => {
						if (dato.transport == 'gcm') {
							if (dato.preferences.length == 0) {
								this.preferences = this.postTypes;
							} else {
								this.preferences = dato.preferences;
							}
							this.preferenceDest    = dato.id;
							this.openNotifications = dato.isEnabled == "1";
						}
					})
			});
		},

		// {endPoint}/people/{id_people}/notification/destinations/{idDestination}
		togglePreference(preference) {

			preference.isEnabled = preference.isEnabled == "1" ? "0" : "1";

			app.api.put(`people/${app.user.id}/notification/destinations/${this.preferenceDest}`, {
				preferences: this.preferences
			})
			// .then(response => console.log(response))
			.then(() => app.api.clear(`people/${app.user.id}/notification/destinations`));  //limpiar cache
		},

		markGeneralNotification(preferenceDestination, preferenceEnable) {
			app.api.put(`people/${app.user.id}/notification/destinations/${preferenceDestination}`, {
				id: preferenceDestination,
				isEnabled: preferenceEnable ? 1 : 0
			})
			// .then(response => console.log(response))
			.then(() => app.api.clear(`people/${app.user.id}/notification/destinations`));  //limpiar cache
		}

	}
}
</script>

<style lang="scss" scoped>
.phi-card {
	margin-bottom: 1em;
}

.phi-media-figure {
	text-align: center;
}
</style>