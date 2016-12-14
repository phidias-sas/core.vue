<template>
	<div>
		<h1>Hola {{app.user.firstName}}</h1>
	</div>
</template>

<script>
import app from '../store/app.js';

export default {
	data() {
		return {
			app
		}
	}}
</script>

<style lang="scss">
</style>
