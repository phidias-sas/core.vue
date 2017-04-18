<template>
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()">
					<i class="fa fa-bars"></i>
				</button>
				<h1>Labs</h1>
			</div>
		</div>

		<div class="phi-page-contents">
			<div class="phi-card">
				<router-link to="/map" class="phi-media">
					<div class="phi-media-figure fa fa-map-marker"></div>
					<div class="phi-media-body">Mapa</div>
				</router-link>
				<router-link to="/felipe" class="phi-media">
					<div class="phi-media-figure fa fa-map-marker"></div>
					<div class="phi-media-body">Mapa v2</div>
				</router-link>
				<router-link to="/leo" class="phi-media">
					<div class="phi-media-figure fa fa-map-marker"></div>
					<div class="phi-media-body">QR Test</div>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
import app from '../store/app.js';
export default {
	data() {
		return {
			app
		}
	}
}
</script>