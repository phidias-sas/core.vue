<template>
	<div class="phi-qrc-generator">
		<canvas class="qr-container"></canvas>
	</div>
</template>

<script>
import QRious from "qrious";

export default {
    name: "phi-qrc-generator",

	data() {
        return {
			qriousInstance: null,
			canvasContainer: null	
		}
    },

	props: {
		background:{
			type: String,
			required: false,
			default: "white"	
		},

		backgroundAlpha:{
			type: Number,
			required: false,
			default: 1.0	
		},

		foreground:{
			type: String,
			required: false,
			default: "black"	
		},

		foregroundAlpha:{
			type: Number,
			required: false,
			default: 1.0	
		},

		level:{
			type: String,
			required: false,
			default: "L" // Error correction level of the QR code (L, M, Q, H)
		},

		mime:{
			type: String,
			required: false,
			default: "image/png"	
		},

		padding:{
			type: Number,
			required: false,
			default: null //(pixels)
		},

		size:{
			type: Number,
			required: false,
			default: 100 //(pixels)
		},

		value: {
			type: String,
			required: true
		}
	},

	methods: {
		initialize(){
			this.qriousInstance = new QRious({
				element: 			this.canvasContainer,
				background: 		this.background,
				backgroundAlpha: 	this.backgroundAlpha,
				foreground: 		this.foreground,
				foregroundAlpha: 	this.foregroundAlpha,
				level: 				this.level,
				padding: 			this.padding,
				size: 				this.size,
				value: 				this.value
			});
		}
	},

    mounted () {
		this.canvasContainer = this.$el.querySelector("canvas.qr-container");	
		this.initialize();
    }
}

</script>

<style scoped>
.phi-qrc-generator{
	width: 100%;
	text-align: center;
}
</style>