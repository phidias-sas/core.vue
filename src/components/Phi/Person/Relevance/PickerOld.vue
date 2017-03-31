<template>
    <div class="phi-person-relevance-picker">
        <div @click="fetchGroups()">
            <input type="text" v-model="query" />
            <slot>
                <div>
                    <div class="person phi-media">
                        <div class="phi-media-figure phi-avatar">
                            <img :src="person.avatar" :alt="person.firstName">
                        </div>
                        <div class="phi-media-body">
                            {{person.firstName}} {{person.lastName}}
                            <br>
                            <span class="person-info">{{selectedPeople.length}} <span v-if="selectedPeople.length == 1">{{ $t("contact selected") }}</span><span v-else>{{ $t("contacts selected") }}</span></span>
                        </div>
                        <div class="phi-media-actions"><i class="fa fa-chevron-right"></i></div>
                    </div>
                </div>
            </slot>
        </div>
        <phi-slider-pannel :open="groupsPannel" side="right" @closed="groupsPannel = false">
            <person-relevance-groups v-model="selectedPeople" :api="api" :person="person" :groups="resultados" :openParent="groupsPannel" @closeMe="groupsPannel = false"></person-relevance-groups>
        </phi-slider-pannel>
    </div>
</template>

<script>
/*
Componente:

<phi-person-relevance-picker person-id="1504" v-model="personas">
</phi-person-relevance-picker>

*/

import SliderPannel from '../../SliderPannel.vue';
import RelevanceGroups from './Groups.vue';
import Fuse from 'fuse.js';

export default {
    name: "phi-person-relevance-picker",

    components: {
        "phi-slider-pannel": SliderPannel,
        "person-relevance-groups": RelevanceGroups
    },

	model: {
		prop:  'selectedPeople',
		event: 'selectedPeopleChange'
	},

   props: {
		selectedPeople: {
			type: Array,
			required: true,
			default: []
		},

        personId: {
			type: String,
			required: true
		},

        api: {
			required: true
		}
    },

    data() {
        return {
            loadingContent: false,
            person: {},
            groups: [],
            groupsPannel: false,

            query: '',
            searchOptions: {
                shouldSort: true,
                threshold: 0.4,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 2,
                keys: [
                    "name",
                    "people.firstname",
                    "people.lastname",
                    "people.roles",
                    "members.firstname",
                    "members.lastname"
                ]
            },

            fuse: null
        }
    },

    computed: {
        resultados() {
            if (!this.fuse) {
                return [];
            }
            console.log("recomputa");
            return this.query.length ? this.fuse.search(this.query) : this.groups;
        }
    },

    methods: {
        fetchPerson() {
            this.api
                .get(`people/${this.personId}`)
                .then(person => this.person = person);
        },

        fetchGroups() {
            if(!this.loadingContent){
                if(this.groups.length <= 0){
                    this.loadingContent = true;
                    this.api
                        .get(`v3/people/${this.personId}/relevance/groups`)
                        .then(groups => {
                            this.groups = groups;
                            this.groupsPannel = true;
                            this.loadingContent = false;

                            this.fuse = new Fuse(this.groups, this.searchOptions);
                        });
                }else{
                    this.groupsPannel = true;
                    this.loadingContent = false;
                }
            }
        },

        closePeoplePannel(gropupId){
            this.$set(this.peoplePannels, gropupId, false);
        }
    },

    mounted() {
        this.fetchPerson();
    }

}
</script>

<style scoped>
.phi-avatar {
	width: 20px !important;
	height: 20px !important;
	order: 1;
}

.phi-media-body {
	font-size: 1em;
	align-self: center;
	order: 2;
}

.phi-media-actions{
    font-size: .9em;
    text-align: center;
    order: 3;
}
</style>