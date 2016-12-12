<template>
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
				<h1>Preferencias</h1>
			</div>
		</div>
		<div class="phi-page-contents">
			<div class="phi-card _padded">
				<button class="phi-button" @click="clearCache()">
					<i class="fa fa-trash-o" aria-hidden="true"></i>
					<span>ELIMINAR CACHE</span>
				</button>
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