<template>
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()">
					<i class="fa fa-bars"></i>
				</button>
				<h1>Phidias</h1>
			</div>
		</div>

		<div class="phi-page-contents">

			<section>
				<h2>Contacto</h2>
				<div class="phi-card">
					<a class="phi-media" href="http://phidias.co" target="_blank">
						<div class="phi-media-figure fa fa-laptop"></div>
						<div class="phi-media-body">Página web</div>
					</a>

					<a class="phi-media" href="tel:7531147">
						<div class="phi-media-figure fa fa-phone"></div>
						<div class="phi-media-body">Llamar al colegio</div>
					</a>

					<a class="phi-media" href="geo:37.786971,-122.399677">
						<div class="phi-media-figure fa fa-map-marker"></div>
						<div class="phi-media-body">Ubicación</div>
					</a>
				</div>
			</section>


		</div>
	</div>
</template>

<script>
import app from '../store/app.js';

export default {
	name: "about",
	data() {
		return {
			app
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