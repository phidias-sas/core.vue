<template>
	<div id="state-login">

		<form class="phi-card" @submit.prevent="login()">
			<img :src="app.logo" :alt="app.title">

			<div class="phi-card-contents">
				<phi-input @input="error = null" v-model="username" label="usuario" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></phi-input>
				<phi-input @input="error = null" v-model="password" label="contraseña" type="password"></phi-input>
			</div>

			<div class="phi-card-actions">
				<button class="phi-button login" :class="{danger: !!error}">
					<span v-show="isLoading">ingresando</span>
					<span v-show="!isLoading && !error">ingresar</span>
					<span v-show="!isLoading && error" v-text="error"></span>
				</button>
				<button class="phi-button google" type="button" @click="googleLogin()">ingresar con google</button>
			</div>
		</form>

		<button v-if="!app.isFixed" class="reset" @click="resetCode()">Cambiar institución</button>

	</div>
</template>

<script>
import PhiInput from '../components/Phi/Input.vue';
import app from '../store/app.js';

export default {
	data() {
		return {
			app,
			username: null,
			password: null,
			error: null
		}
	},

	computed: {
		isLoading() {
			return !!app.api && app.api.isLoading;
		}
	},

	methods: {
		login() {
			this.error = null;

			if (!this.username || !this.password) {
				this.error = "debes escribir tu usuario y contraseña";
				return;
			}

			if (this.username == "demo") {
				this.password = this.username;
				this.app.set({endpoint: 'https://demo.api.phidias.co'});
				this.app.initialize();
			}

			this.app.login(this.username, this.password)
				.then(() => {
					this.redirect();
				})
				.catch(error => {
					this.error = "usuario o contraseña incorrectos";
					console.log("app.login error", error);
				});
		},

		googleLogin() {
			this.app.googleLogin()
				.then(data => {
					this.redirect();
				})
				.catch(error => {
					this.error = "usuario o contraseña incorrectos";
					console.log("app.login error", error);
				});				
		},

		redirect() {
			this.username = this.password = null;
			this.$router.push("/dashboard");
		},

		resetCode() {
			// this.app.clear();
			this.$router.push('code');
		}
	},

	components: {
		PhiInput
	}

	/*
	Autofocus is REALLY anoying on mobile because it opens the keyboard unexpectedly
	mounted() {
		this.$el.querySelector("input").focus();
	}
	*/
}

</script>


<style lang="scss">
#state-login {

	padding: 6px;
	padding-top: 5%;
	text-align: center;

	.phi-card {
		margin: auto;
		width: 100%;
		max-width: 600px;
		padding: 12px;

		img {
			max-width: 100%;
			margin: 24px auto;
			background-color: #2196F3;
		}
	}

	.phi-input {
		display: block;
		margin-bottom: 32px;
	}

	.phi-button {
		display: block;
		width: 100%;
		margin-bottom: 16px;

		&.google {
			background-color: #eee;
			color: #333;
		}
	}

	.reset {
		display: block;
		margin: auto;
		width: 100%;
		max-width: 600px;

		margin-top: 15px;

		padding: 12px;
		color: #555;
		text-transform: uppercase;
		text-decoration: none;

		border: 0;
		background: transparent;
		font-size: 1em;
		cursor: pointer;
	}

}
</style>