<template>
    <div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
				<h1>{{ $route.query.title }}</h1>
			</div>
		</div>

        <div class="phi-page-contents">

            <div class="picker phi-card">

                <div class="select">
                    <i class="fa fa-arrow-left direction leave" v-show="newRecord.type && newRecord.type.settings && newRecord.type.settings.direction < 0"></i>
                    <i class="fa fa-arrow-right direction enter" v-show="newRecord.type && newRecord.type.settings && newRecord.type.settings.direction > 0"></i>
                    <i class="fa fa-exclamation direction info" v-show="newRecord.type && (!newRecord.type.settings || !newRecord.type.settings.direction)"></i>

                    <select v-model="newRecord.type">
                        <option v-for="ntype in types.items" :value="ntype">{{ ntype.singular }}</option>
                    </select>
                </div>

                <phi-person-picker :api="app.api" label="buscar" @select="selectPerson"></phi-person-picker>
            </div>

            <div class="phi-card">
                <div v-for="entry in log.items" class="phi-media entry">
                    <div class="phi-media-figure phi-avatar">
                        <img :src="entry.person.avatar" alt="entry.person.firstName">
                    </div>
                    <div class="phi-media-body">
                        <h1 class="name">{{ entry.person.firstName }} {{ entry.person.lastName }}</h1>
                        <i class="fa fa-arrow-left direction leave" v-show="entry.direction < 0"></i>
                        <i class="fa fa-arrow-right direction enter" v-show="entry.direction > 0"></i>
                        <i class="fa fa-exclamation direction info" v-show="entry.direction == 0"></i>
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
            newRecord: {
                person: null,
                type: null
            }
        }
    },

    methods: {
        selectPerson(person) {
            if (person.id == this.log.items[0].person.id && this.newRecord.type.singular == this.log.items[0].type) {
                return;
            }

            this.newRecord.person = person;

            this.logEntry({
                person: this.newRecord.person.id,
                type:   this.newRecord.type.singular
            });
        },

        logEntry(entry) {
            app.api
                .post(`/attendance/checkpoints/${this.$route.params.nodeId}/log`, entry)
                .then(createdEntry => this.log.unshift(createdEntry));
        }
    },

    mounted() {
        this.log.fetch();
        this.types.fetch().then(() => this.newRecord.type = this.types.items[0]);
    }
}
</script>

<style lang="scss" scoped>
$top-card-offset: 20px;

.phi-page-cover {
    background-color: #1C89B8;
    color: #fff;
    padding-bottom: $top-card-offset;
}

.picker {

    position: relative;
    top: -$top-card-offset;

    padding: 12px;

    .select {

        display: flex;

        & > .direction {
            display: block;
            padding: 6px;
            font-size: 12px;
        }

        & > select {
            flex: 1;

            font-size: 1em;
            border: none;
            background: transparent;
        }
    }


    .phi-person-picker {
        margin-top: 12px;
    }
}

.entry {
    .name {
        color: #000;
    }

    .direction {
        font-size: 11px;
        padding-right: 3px;
    }

    .timestamp {
        color: #777;
        font-size: 0.9em;
    }
}

.direction {
    &.enter {
        color: #23CF5F;
    }

    &.leave {
        color: #F64744;
    }

    &.info {
        color: #0F6698;
    }
}

</style>