<template>
    <div class="phi-person-relevance-picker">
        <div @click="togglePicker">
            <slot></slot>
        </div>

        <phi-slider-panel side="right" :open="template.panelIsOpen" @closed="template.panelIsOpen = false">
            <div class="box" :class="{flipped: template.boxIsFlipped}">

                <!-- FRENTE de la caja: Listado de grupos -->
                <div class="front">

                    <div class="toolbar phi-media">
                        <i class="phi-media-figure fa fa-times" @click="template.panelIsOpen = false"></i>
                        <div class="phi-media-body">
                            <input type="text" v-model="query" />
                        </div>
                        <div class="phi-media-right">{{selection.length}}</div>
                    </div>

                    <!-- listado de grupos -->
                    <div class="group phi-card" v-for="group in filteredGroups">
                        <h2 @click="openGroup(group)">{{ group.name }}</h2>

                        <!-- listado de personas en resaltadas del grupo -->
                        <div
                            v-for="person in group.people"
                            class="person phi-media"
                            @click="togglePerson(person)"
                            :class="{ selected: isSelected(person) }"
                        >
                            <div class="phi-media-figure phi-avatar">
                                <img :src="person.avatar" :alt="person.firstname">
                            </div>
                            <div class="phi-media-body">
                                <h1>{{person.firstname}} {{person.lastname}}</h1>
                                <span class="roles" v-for="(role, key) in person.roles">{{ $t(role) }}<span v-if="key < person.roles.length-1">, </span></span>
                            </div>
                            <div class="phi-media-options" v-show="isSelected(person)">
                                <i class="blue fa fa-check"></i>
                            </div>
                        </div>

                    </div>

                </div>


                <!-- DORSO de la caja: Listado de personas en el grupo activo -->
                <div class="back">
                    <div v-if="activeGroup">

                        <div class="toolbar phi-media">
                            <i class="phi-media-figure fa fa-chevron-left" @click="template.boxIsFlipped = false"></i>
                            <div class="phi-media-body">{{ activeGroup.name }}</div>
                            <div class="phi-media-right">{{ selection.length }}</div>
                        </div>

                        <!-- seleccion de roles -->
                        <label>Marcar:</label>
                        <div @click="activeGroup.members.forEach(deselectPerson)">Ninguno</div>
                        <div v-for="role in distinctRoles(activeGroup)" @click="selectWithRole(activeGroup.members, role)">{{ role }}</div>

                        <!-- listado de personas en el grupo activo -->
                        <div
                            v-for="person in activeGroup.members"
                            class="person phi-media"
                            @click="togglePerson(person)"
                            :class="{ selected: isSelected(person) }"
                        >
                            <div class="phi-media-figure phi-avatar">
                                <img :src="person.avatar" :alt="person.firstname">
                            </div>
                            <div class="phi-media-body">
                                <h1>{{person.firstname}} {{person.lastname}}</h1>
                                <span class="roles" v-for="(role, key) in person.roles">{{ $t(role) }}<span v-if="key < person.roles.length-1">, </span></span>
                            </div>
                            <div class="phi-media-options" v-show="isSelected(person)">
                                <i class="blue fa fa-check"></i>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </phi-slider-panel>
    </div>
</template>

<script>
import PhiSliderPanel from '../../SliderPannel.vue';
import Fuse from 'fuse.js';

export default {
    name: "phi-person-relevance-picker",
    components: {PhiSliderPanel},

	model: {
		prop: 'selection'
	},

   props: {
        api: {
			required: true
		},

        personId: {
			type: String,
			required: true
		},

		selection: {
			type: Array,
			required: true,
			default: []
		}
    },

    data() {
        return {
            groups: [],
            query: '',
            activeGroup: null,

            fuse: null,
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
                    "people.roles"
                ]
            },

            template: {
                panelIsOpen: false,
                boxIsFlipped: false
            }
        }
    },

    computed: {
        filteredGroups() {
            if (!this.fuse) {
                return [];
            }
            return this.query.length ? this.fuse.search(this.query) : this.groups;
        }
    },

    methods: {
        isSelected(person) {
            return this.selection.indexOf(person) >= 0;
        },

        togglePerson(person) {
            this.isSelected(person) ? this.deselectPerson(person) : this.selectPerson(person);
        },

        selectPerson(person) {
            this.selection.push(person);
        },

        deselectPerson(person) {
            this.selection.splice(this.selection.indexOf(person), 1);
        },

        fetchGroups() {
            return this.api
                .get(`v3/people/${this.personId}/relevance/groups`)
                .then(groups => {
                    this.groups = groups;
                    this.fuse   = new Fuse(this.groups, this.searchOptions);
                });
        },

        openGroup(group) {
            if (!group.hasOwnProperty('members')) {
                this.api
                    .get(`v3/people/${this.personId}/relevance/groups/${group.id}`)
                    .then(members => this.$set(group, "members", members))
                    .then(() => {
                        this.activeGroup = group;
                        this.template.boxIsFlipped = true;
                    });
            } else {
                this.activeGroup = group;
                this.template.boxIsFlipped = true;
            }
        },

        distinctRoles(group) {
            if (!group.hasOwnProperty('members')) {
                return [];
            }

            var retval = [];
            group.members.forEach(member => {
                member.roles.forEach(role => {
                    if (retval.indexOf(role) == -1) {
                        retval.push(role);
                    }
                });
            });

            return retval;
        },

        selectWithRole(people, role) {
            people.forEach(person => {
                if (person.roles.indexOf(role) >= 0) {
                    this.selectPerson(person);
                }
            });
        },

        togglePicker() {
            if (!this.groups.length) {
                this.fetchGroups().then(() => this.template.panelIsOpen = true);
            } else {
                this.template.panelIsOpen = !this.template.panelIsOpen
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
	position: relative;
    width: 100%;
    height: 100%;

	overflow: hidden;
	overflow-y: auto;

	.front,
	.back {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		overflow-y: auto;

		transition: 0.5s;
	}

	.front {
		transform: translateX(0);
	}

	.back {
		transform: translateX(100%);
	}

	&.flipped {
		.front {
			transform: translateX(-100%);
		}
		.back {
			transform: translateX(0);
		}
	}

}
</style>