<template>
    <div class="phi-block-v3">
        <template v-if="!action">
            <div v-html="body"></div>
        </template>
    </div>
</template>

<script>
import app from '../../../store/app.js';

export default {
    name: "phi-block-v3",
    props: ["block", "action"],

    data() {
        return {
            body: null
        }
    },

    created() {
        this.load();
    },

    methods: {
        load() {
            if (!this.block.url) return;
            fetch(this.block.url, {
                headers: {
                    'Authorization': 'Bearer ' + app.api.token
                }
            })
            .then(response => response.text())
            .then(body => this.body = body);
        }
    }
}
</script>