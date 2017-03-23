<template>
    <div class="phi-person-relevance-picker">



        personIsExpanded: {{personIsExpanded}}

        <v-expansion-panel>
            <v-expansion-panel-content v-model="personIsExpanded">
                <div slot="header" @zzzzzclick="fetchGroups()">
                    <div class="phi-media">
                        <div class="phi-media-figure phi-avatar">
                            <img :src="person.avatar" :alt="person.firstName">
                        </div>
                        <div class="phi-media-body">
                            {{person.firstName}} {{person.lastName}}
                        </div>
                    </div>
                </div>

                <div class="groups">
                    <div class="group" v-for="group in groups" @click="fetchGroupMembers(group)">
                        <h1>{{ group.name }}</h1>
                        <div class="members">
                            <div
                                v-for="member in group.members"
                                class="phi-media member"
                                :class="{selected: isSelected(member.id)}"
                                @click="togglePerson(member.id)"
                            >
                                <div class="phi-media-figure phi-avatar">
                                    <img :src="member.avatar" :alt="member.firstname">
                                </div>
                                <div class="phi-media-body">
                                    {{member.firstname}} {{member.lastname}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </v-expansion-panel-content>
        </v-expansion-panel>


    </div>
</template>

<script>
/*
Componente:

<phi-person-relevance-picker person-id="1504" v-model="personas">
</phi-person-relevance-picker>

*/

import Vue from 'vue';

export default {
    name: "phi-person-relevance-picker",

	model: {
		prop:  'selectedPeople',
		// event: 'selectedPeopleChange' // ?????
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
            person: {},
            groups: [],
            personIsExpanded: false
        }
    },

    watch: {
        personIsExpanded: function(val) {
            if (val && this.groups.length == 0) {
                this.fetchGroups()
                    .then(() => {
                        this.personIsExpanded = false;
                        setTimeout(() => {
                            this.personIsExpanded = true;
                        }, 0);
                    });
            }
        }
    },

    methods: {
        isSelected(personId) {
            return this.selectedPeople.indexOf(personId) >= 0;
        },

        addPerson(personId) {
            this.selectedPeople.push(personId);
        },

        removePerson(personId) {
            this.selectedPeople.splice(this.selectedPeople.indexOf(personId), 1);
        },

        togglePerson(personId) {
            this.isSelected(personId) ? this.removePerson(personId) : this.addPerson(personId);
        },

        fetchPerson() {
            this.api
                .get(`people/${this.personId}`)
                .then(person => this.person = person);
        },

        fetchGroups() {
            return this.api
                .get(`v3/people/${this.personId}/relevance/groups`)
                .then(groups => this.groups = groups);
        },

        fetchGroupMembers(group) {
            this.api
                .get(`v3/people/${this.personId}/relevance/groups/${group.id}`)
                .then(people => Vue.set(group, 'members', people));
        }

    },

    mounted() {
        this.fetchPerson();
    }

}
</script>

<style lang="scss" scoped>

.member.selected {
    background-color: #ff8;
}

.group {
    border: 1px dotted #999;
    padding: 12px;
}

</style>