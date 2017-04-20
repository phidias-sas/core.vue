<template>
	<div class="phi-person-picker">

        <div class="search">
            <phi-input :label="label" v-model="query" @input="debounce()"></phi-input>
            <button :class="{running: scanner.isRunning}" @click="toggleScan"><i class="fa fa-qrcode"></i></button>
        </div>

        <div class="results">
            <div v-for="person in results" class="person phi-media" @click="select(person)">
                <div class="phi-media-figure phi-avatar">
                    <img :src="person.avatar" :alt="person.firstName">
                </div>
                <h1 class="phi-media-body">{{person.firstName}} {{person.lastName}}</h1>
            </div>
        </div>
	</div>
</template>

<script>
import PhiInput from '../Input.vue';

export default {
    name: "phi-person-picker",
    components: {PhiInput},
	props: ["api", "label"],

    data() {
        return {
            query: "",
            results: [],
            scanner: {
                isRunning: false
            }
        }
    },

	methods: {
        select(person) {
            this.selected = person;
            this.$emit("select", person);
            this.reset();
        },

        find() {
            this.api
                .get("people", {q: this.query})
                .then(results => this.results = results);
        },

        debounce() {
            if (!this.query) {
                return this.reset();
            }
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.find(), 500);
        },

        reset() {
            this.query   = "";
            this.results = [];
        },

        startScan() {
            if (this.scanner.isRunning) {
                return;
            }
            this.scanner.isRunning = true;

            cordova.plugins.barcodeScanner.scan(
                result => {
                    // alert("We got a barcode\n" +
                    //     "Result: " + result.text + "\n" +
                    //     "Format: " + result.format + "\n" +
                    //     "Cancelled: " + result.cancelled);

                    if (result.cancelled) {
                        this.stopScan();
                    }

                    try {
                        this.select(JSON.parse(result.text));
                        this.stopScan();
                        this.startScan();
                    } catch (e) {
                        // not valid JSON
                    }
                },

                error => {
                    alert("Scanning failed: " + error);
                },

                {
                    preferFrontCamera : false, // iOS and Android
                    showFlipCameraButton : true, // iOS and Android
                    showTorchButton : true, // iOS and Android
                    torchOn: false, // Android, launch with the torch switched on (if available)
                    prompt : "", // Android
                    resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                    formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                    orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                    disableAnimations : true, // iOS
                    disableSuccessBeep: false // iOS
                }
            );
        },

        stopScan() {
            if (!this.scanner.isRunning) {
                return;
            }
            this.scanner.isRunning = false;
        },

        _startScan() {
            if (typeof QRScanner == 'undefined') {
                alert("Lector de codigo QR no soportado");
                return;
            }

            if (this.scanner.isRunning) {
                return;
            }
            this.scanner.isRunning = true;

            QRScanner.scan((err, contents) => {
                if (err) {
                    return;
                }

                try {
                    this.select(JSON.parse(contents));
                } catch (e) {
                    // not valid JSON
                }

                // restart scanner
                this.scanner.isRunning = false;
                this.startScan();
            });

            QRScanner.show();
            // document.documentElement.style.opacity = 0.3;
        },

        _stopScan() {
            if (!this.scanner.isRunning) {
                return;
            }
            this.scanner.isRunning = false;

            QRScanner.cancelScan(status => {
                console.log(status);
                alert("Cancel: " + JSON.stringify(status));
            });
            // document.documentElement.style.opacity = 1;
        },

        toggleScan() {
            this.scanner.isRunning ? this.stopScan() : this.startScan();
        }
	}
}

</script>

<style scoped lang="scss">
.phi-person-picker {

    .search {
        display: flex;

        .phi-input {
            flex: 1;
        }

        button {
            margin-left: 16px;

            border: 0;
            border-radius: 8px;
            padding: 4px 24px;
            font-size: 24px;

            &.running {
                background-color: #ff8;
                color: red;
            }
        }
    }

    .results {
        max-height: 400px;
        overflow: auto;

        .person {
            .phi-avatar {
                width: 20px !important;
                height: 20px !important;
            }

            .phi-media-body {
                font-size: 1em;
                align-self: center;
            }
        }
    }
}
</style>