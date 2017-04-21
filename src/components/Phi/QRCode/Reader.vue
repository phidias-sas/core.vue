<template>
	<div class="phi-qr-reader" :class="{enabled: enabled}">
        <slot></slot>
	</div>
</template>

<script>
import QRScanner from "./scanner.js";

export default {
    name: "phi-qr-reader",

	data() {
        return {
			options: {}
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
		start() {
			if (!isMobile) {
				QRScanner.start(this.options);
				return;
			}

            cordova.plugins.barcodeScanner.scan(
                result => {
                    if (result.cancelled) {
						this.$emit("error", "cancelled");
						this.stop();
						return;
                    }
					this.$emit("result", result.text);
					this.stop();
                },

                error => {
                    this.$emit("error", error);
					this.stop();
                },

                {
                    preferFrontCamera:     false, // iOS and Android
                    showFlipCameraButton:  true, // iOS and Android
                    showTorchButton:       true, // iOS and Android
                    torchOn:               false, // Android, launch with the torch switched on (if available)
                    prompt:                "", // Android
                    resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                    formats:               "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                    orientation:           "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                    disableAnimations:     true, // iOS
                    disableSuccessBeep:    false // iOS
                }
            );

		},

		stop() {
			if (!isMobile) {
				QRScanner.stop();
				return;
			}
			this.$emit("stop");
		}
	},

    mounted() {
		this.options.parent    = this.$el;
		this.options.className = "phi-qr-code-reader-container";
		this.options.onResult  = result => { this.$emit("result", result) };
		this.options.onError   = error  =>   { this.$emit("error", error) };
    }
}

</script>

<style>
.phi-qr-code-reader-container {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    z-index: 999999999;
    display: block;
    margin: auto;
	text-align: center;
}
</style>