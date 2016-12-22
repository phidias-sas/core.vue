<template>
	<div id="state-code">

		<form @submit.prevent="submit()">

			<phi-input v-model="inputCode" label="código de la institución" @input="error = false" autocorrect="off" autocapitalize="off" spellcheck="false"></phi-input>

			<footer>

				<button class="phi-button" :class="{danger: !!error}" :disabled="!inputCode.trim()">
					<span v-show="!isLoading && !error">CONTINUAR</span>
					<span v-show="isLoading" class="loading">
						<i class="fa fa-spinner fa-spin"></i>
						BUSCANDO
					</span>
					<span v-show="error">CÓDIGO NO ENCONTRADO</span>					
				</button>

			</footer>

			<a id="toggle-dialog" @click="showDialog()">Qué es esto ?</a>

		</form>

		<ons-dialog id="dialog" cancelable>
			<h2>C&oacute;digo de acceso</h2>
			<p>Esta aplicaci&oacute;n funciona exclusivamente para colegios que utilizan el sistema <strong>Phidias Académico</strong>.</p>
			<p>Comunícate con tu colegio para obtener tu código de acceso e ingresar al sistema</p>

			<div class="buttons">
				<button @click="hideDialog()">OK</button>
			</div>
		</ons-dialog>

	</div>
</template>

<script>
import PhiInput from '../components/Phi/Input.vue';

import app from '../store/app.js';

export default {
	data () {
		return {
			app,
			inputCode: "",
			isLoading: false,
			error: false
		}
	},

	methods: {
		submit () {

			this.isLoading = true;

			this.app.loadCode(this.inputCode)
				.then(() => {
					this.isLoading = false;
					this.$router.push("login");
				})
				.catch(error => {
					this.isLoading = false;
					this.error     = true;
				});

			return false;
		},

		showDialog () {
			this.$el.querySelector("#dialog").show();
		},

		hideDialog () {
			this.$el.querySelector("#dialog").hide();
		}
	},

	components: {
		PhiInput
	}
}
</script>


<style lang="scss">
#state-code {

	text-align: center;
	height: 100%;
	background-color: #000;
	overflow: auto; /* prevents margin collapse (i.e. form's top margin is not translated to this parent) */

	.phi-input {
		display: block;
    	color: #fff;
	}

	form {
		width: 270px;
		margin: auto;
		margin-top: 76px;
		background: url('../assets/phidias-label.png') no-repeat center top;
		padding-top: 64px + 48px;

		footer {
			margin: 48px 0;
		}
	}

	#dialog {
		text-align: left;
		padding: 12px 24px;

		h2 {
			margin: 0;
			margin-bottom: 1em;
		}

		p {
			margin: 0;
		}

		strong {
			font-weight: bold;
		}
	}

	#toggle-dialog {
		display: block;
		color: #fff;
		opacity: 0.8;
		cursor: pointer;
		padding: 8px 12px;
	}

}
</style>