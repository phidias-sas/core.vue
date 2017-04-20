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

        },

        stopScan() {
            if (!this.scanner.isRunning) {
                return;
            }
            this.scanner.isRunning = false;

            QRScanner.cancelScan(status => {
                console.log(status);
                alert("Cancel: " + JSON.stringify(status));
            });
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
            padding: 4px 36px;
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