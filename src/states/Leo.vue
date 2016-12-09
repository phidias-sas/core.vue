<template>
	<div>
		<phi-full-calendar :person="app.user.id"></phi-full-calendar>
	</div>
</template>

<script>
import app from '../store/app.js'

export default {
	name: "fullcalendar",

	data () {
		return {
			app,

		}
	}
}
</script>

<style>
</style>