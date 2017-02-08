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
					<div v-if="app.organization">

						<a v-if="app.organization.website"
							:href="app.organization.website"
							target="_blank"
							class="phi-media"
						>
							<div class="phi-media-figure fa fa-laptop"></div>
							<div class="phi-media-body">Página web</div>
						</a>

						<a v-if="app.organization.phone"
							:href="'tel:' + app.organization.phone"
							class="phi-media"
						>
							<div class="phi-media-figure fa fa-phone"></div>
							<div class="phi-media-body">Llamar al colegio</div>
						</a>

						<a v-if="app.organization.latitude"
							:href="`geo:${app.organization.latitude},${app.organization.longitude}`"
							class="phi-media"
						>
							<div class="phi-media-figure fa fa-map-marker"></div>
							<div class="phi-media-body">Ubicación</div>
						</a>

						<a v-if="app.organization.phidias"
							:href="app.organization.phidias"
							target="_blank"
							class="phi-media"
						>
							<div class="phi-media-figure fa fa-building"></div>
							<div class="phi-media-body">Phidias</div>
						</a>
					</div>
				</section>
			</div>

			<footer>
				<p>Desarrollado por Phidias SAS &copy; 2016</p>
				<p v-if="app.organization">para {{ app.organization.name }}</p>
				<p>Todos los derechos reservados</p>
				<div id="hidden" @click="openHidden"></div>
			</footer>

		</div>
	</div>
</template>

<script>
import app from '../store/app.js';

var md5 = require("../../node_modules/blueimp-md5/js/md5");
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
		},

		tokenLink() {
			let time = Math.round((new Date()).getTime()/1000);
			app.organization.phidias = app.data.endpoint.replace(".api", "");
			let tli = app.user.id;
			let tld = time + 604800;
			let tlh = md5(`speak FR13nD and enter:${tli}@${tld} ${app.organization.phidias.replace("https://", "")}`);
			app.organization.phidias = `${app.organization.phidias}?tli=${tli}&tld=${tld}&tlh=${tlh}`;
		}
	},

	mounted() {
		this.tokenLink();
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