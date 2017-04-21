<template>
	<div class="phi-person-picker">

        <div class="search">
            <input type="text" :placeholder="label" v-model="query" @input="debounce()" />
            <i class="fa fa-times clear" @click="reset" v-show="query.trim().length > 0"></i>

            <phi-qr-reader :enabled="scanner.isRunning" @result="readCode" @stop="scanner.isRunning = false">
                <i class="fa fa-barcode" @click="scanner.isRunning = !scanner.isRunning"></i>
            </phi-qr-reader>
        </div>

        <div class="results">

            <p class="empty" v-show="query.trim().length > 0 && !results.length && !timer">No hay resultados</p>

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
import PhiQrReader from '../QRCode/Reader.vue';

export default {
    name: "phi-person-picker",
    components: {PhiInput, PhiQrReader},
	props: ["api", "label"],

    data() {
        return {
            query: "",
            timer: null,
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
                .then(results => {
                    this.results = results;
                    this.timer   = null;
                });
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

        readCode(text) {
            try {
                this.select(JSON.parse(text));
                setTimeout(() => this.scanner.isRunning = true, 0);  // restart scanner
            } catch (e) {
                alert("invalid code");
            }
        }
	}
}

</script>

<style scoped lang="scss">
.phi-person-picker {
    .search {
        display: flex;

        input {
            flex: 1;
            border: none;
            background: transparent;
        }

        .clear {
            align-self: center;
        }

        .phi-qr-reader {
            border: 0;
            margin-left: 16px;
            font-size: 24px;
            padding: 0 12px;

            &.enabled {
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

    .empty {
        color: #777;
        display: block;
        font-size: 14px;
        margin-top: 12px;
    }
}
</style>