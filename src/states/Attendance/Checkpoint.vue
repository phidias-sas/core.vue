<template>
    <div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
				<h1>{{ $route.query.title }}</h1>
			</div>
		</div>

        <div class="phi-page-contents">

            <div class="picker">
                <label for="">Registrar:</label>
                <select v-model="entry.type">
                    <option v-for="ntype in types.items" :value="ntype.singular">{{ ntype.singular }}</option>
                </select>
                <phi-person-picker :api="app.api" label="buscar" @select="selectPerson"></phi-person-picker>
            </div>

            <div class="phi-card">
                <div v-for="entry in log.items" class="phi-media entry">
                    <div class="phi-media-figure phi-avatar">
                        <img :src="entry.person.avatar" alt="entry.person.firstName">
                    </div>
                    <div class="phi-media-body">
                        <h1 class="name">{{ entry.person.firstName }} {{ entry.person.lastName }}</h1>
                        <span class="type">{{ entry.type }}</span>
                        <span class="timestamp">{{ moment.unix(entry.timestamp).calendar(null, {sameElse: 'MMM D'}) }}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import app from '../../store/app.js';
import moment from 'moment';

import PhiDrawer from '../../components/Phi/Drawer.vue';
import PhiInput from '../../components/Phi/Input.vue';
import PhiPersonPicker from '../../components/Phi/Person/Picker.vue';


export default {

    components: {PhiDrawer, PhiInput, PhiPersonPicker},

    data() {
        return {
            app,
            moment,
            log: app.api.collection(`/attendance/checkpoints/${this.$route.params.nodeId}/log`),
            types: app.api.collection(`/types/checkpoint`),
            tpl: {
                drawerIsOpen: false
            },
            entry: {
                person: null,
                type: null
            }
        }
    },

    methods: {
        selectPerson(person) {
            if (this.entry.person == person.id) {
                return;
            }

            this.entry.person = person.id;
            this.saveEntry();
        },

        saveEntry() {
            app.api
                .post(`/attendance/checkpoints/${this.$route.params.nodeId}/log`, this.entry)
                .then(createdEntry => this.log.unshift(createdEntry));
        }
    },

    mounted() {
        this.log.fetch();
        this.types.fetch().then(() => this.entry.type = this.types.items[0].singular);
    }
}
</script>

<style lang="scss" scoped>
.picker {
    padding: 12px;
    margin-bottom: 24px;

    select {
        font-size: 1em;
        border: none;
        padding: 4px 12px;
    }

    .phi-person-picker {
        margin-top: 12px;
    }
}

.entry {

    .name {
        color: #000;
    }

    .timestamp {
        color: #777;
        font-size: 0.9em;
    }
}

</style>