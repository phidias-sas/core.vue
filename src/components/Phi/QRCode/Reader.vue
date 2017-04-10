<template>
	<div class="phi-qrc-reader"></div>
</template>

<script>
import QRScanner from "./scanner.js";

export default {
    name: "phi-qrc-reader",

	data() {
        return {
			options: {
				parent: null,
				className: "phi-qr-code-reader-container",
			}
		}
    },

	props: {
		enabled: {
			type: Boolean,
			required: true
		}
	},

	watch: {
		enabled: function(isEnabled) {
			isEnabled ? this.start() : this.stop();	
		}
	},

	methods: {
		start(){
			QRScanner.start(this.options);
		},

		stop(){
			QRScanner.stop();
		}
	},

    mounted () {
		this.options.parent = this.$el;
		this.options.onResult = result => { this.$emit("result", result) };
		this.options.onError = error => { this.$emit("error", error) };
    }
}

</script>

<style>
.phi-qrc-reader{
	width: 100%;
}

.phi-qr-code-reader-container{
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    z-index: 999999999;
    display: block;
    margin: auto;
	text-align: center;
}
</style>