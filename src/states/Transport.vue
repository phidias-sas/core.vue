<template>
	<div>
		<phi-tracker
			target	="123abc"
			every	= 5000
		></phi-tracker>
	</div>
</template>

<script>
	import PhiTracker from '../components/Phi/PhiTracker.vue';
	import app from '../store/app.js'

	export default {
	name: 'transport',
	components: {PhiTracker},
		data () {
			return {
				app
			}
		},
		mounted () {
		}
	}
</script>

<style lang="scss">


</style>