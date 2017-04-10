<template>
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()">
					<i class="fa fa-bars"></i>
				</button>
				<h1>QR code components</h1>
			</div>
		</div>

		<div class="phi-page-contents">
			<ons-progress-bar v-show="app.api.isLoading" indeterminate ></ons-progress-bar>

			<phi-qrc-generator :size="250" :value="QRValue"></phi-qrc-generator>
			
			<br>
			<br>
			<br>
			<br>
			<br>
			<button @click="QRReaderEnabled = !QRReaderEnabled;">Scan/Stop</button>
			<phi-qrc-reader 
				:enabled="QRReaderEnabled"
				@result="qrresult" 
				@error="qrerror"
			></phi-qrc-reader>

		</div>
	</div>
</template>

<script>
import app from '../store/app.js';
import qrcGenerator from '../components/Phi/QRCode/Generator.vue';
import qrcReader from '../components/Phi/QRCode/Reader.vue';

export default {
	name: "leo-sandbox",

	components: {
		"phi-qrc-generator": qrcGenerator,
		"phi-qrc-reader": qrcReader
	},

	data () {
		return {
			app,
			QRValue: app.user.id,
			QRReaderEnabled: false
		}
	},

	methods: {
		qrresult(result){	
			alert(result);
			this.QRReaderEnabled = false;
		},

		qrerror(err){	
			console.log(err);
			this.QRReaderEnabled = false;
		}
	},

	mounted () {
		
    }
}
</script>

<style scoped lang="scss">
</style>