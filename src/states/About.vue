<template>
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()">
					<i class="fa fa-bars"></i>
				</button>
				<h1 v-text="app.title"></h1>
			</div>
		</div>

		<div class="phi-page-contents">

			<div class="phi-card school">
				<header>
					<img :src="app.logo" :alt="app.title">
				</header>

				<section>
					<div>
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

			<footer>
				<p>Phidias SAS &copy; 2016</p>
				<p>Todos los derechos reservados</p>
				<div id="hidden" @click="openHidden"></div>
			</footer>

		</div>
	</div>
</template>

<script>
import app from '../store/app.js';

export default {
	name: "about",
	data() {
		return {
			app,
			hidden: 7
		}
	},

	methods: {
		openHidden() {
			this.hidden--;
			if (!this.hidden) {
				this.$router.push("/hidden");
			}
		}
	}
}
</script>

<style lang="scss" scoped>

.school {

	header {
		text-align: center;
		padding: 32px 0;

		img {
			max-width: 100%;
			margin: auto;
			background-color: #2196F3;

			max-width: 80%;
		}

		h1 {
			font-weight: normal;
			font-size: 1.6em;
			margin: 8px 0;
			color: #444;
		}
	}

	section {

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

}

footer {
	margin-top: 32px;
	text-align: center;
	font-size: 0.8em;
	color: #666;

	#hidden {
		display: block;
		padding: 16px;
		margin-top: 72px;

		border-top: 1px solid #eee;
	}
}

</style>