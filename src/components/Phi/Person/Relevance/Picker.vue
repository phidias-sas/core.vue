<template>
    <div class="phi-person-relevance-picker">
        <div @click="togglePicker">
            <slot></slot>
        </div>

        <phi-slider-panel side="right" :open="template.panelIsOpen" @closed="template.panelIsOpen = false; template.boxIsFlipped = false;">
            <div class="box" :class="{flipped: template.boxIsFlipped}">

                <!-- FRENTE de la caja: Listado de grupos -->
                <div class="front">

                    <div class="toolbar phi-media">
                        <button class="phi-media-left phi-button" @click="template.panelIsOpen = false">
                            <i class="fa fa-chevron-left"></i>
                        </button>
                        <div class="phi-media-body">
                            <input class="search-field" type="text" 
                                v-model="query" 
                                :placeholder="$t('search people by name')"
                            />
                        </div>
                        <button class="phi-media-right phi-button" v-if="query.length > 0" @click="query = ''">
                            <i class="fa fa-times"></i>
                        </button>
                        <button class="phi-media-right phi-button" v-else>
                            <i class="fa fa-search"></i>
                        </button>
                        <button class="phi-media-right phi-button groups-counter">
                           {{selection.length}}
                        </button>
                    </div>

                    <!-- listado de grupos -->
                    <div class="group phi-card" v-for="group in filteredGroups">
                        <h2 v-if="(group.people.length > 0)">{{ group.name }}</h2>

                        <!-- listado de personas en resaltadas del grupo -->
                        <div class="person phi-media"
                            v-for="person in group.people"
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

                        <div class="person phi-media"
                            v-if="(group.type !== 'relatives')"
                            v-bind:class="{ optionsBar: (group.people.length > 0) }"
                            @click="openGroup(group)" 
                        >   
                            <div class="phi-media-body"
                                 v-bind:class="{ optionsHelp: (group.people.length > 0) }"
                            >
                                <h1>
                                    <span v-show="(group.people.length > 0)">{{ $t("more people") }}</span>
                                    <span v-show="(group.people.length <= 0)">{{group.name}}</span>
                                </h1>
                            </div>
                                
                            </h1>
                            <div class="phi-media-options">
                                <i class="fa fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>

                </div>


                <!-- DORSO de la caja: Listado de personas en el grupo activo -->
                <div class="back">
                    <div v-if="activeGroup">
                        
                         <div class="toolbar phi-media">
                            <button class="phi-media-left phi-button" @click="closeGroup()">
                                <i class="fa fa-chevron-left"></i>
                            </button>
                            <div class="phi-media-body">
                                <div>{{ activeGroup.name }}</div>
                            </div>
                            <button class="phi-media-right phi-button groups-counter">
                                {{selection.length}}
                            </button>

                            <!-- seleccion de roles -->
                            <div class="phi-media-right phi-tooltip">
                                <button class="phi-button"> <i class="fa fa-ellipsis-v"></i></button>
                                <ul class="phi-menu _texture-paper">
                                    <li @click="activeGroup.members.forEach(selectPerson)">{{ $t("everyone")}}</li>
                                    <li @click="activeGroup.members.forEach(deselectPerson)">{{ $t("noone")}}</li>
                                    <li v-for="role in distinctRoles(activeGroup)" @click="toggleWithRole(activeGroup.members, role)" :class="{checked: roleIsSelected(activeGroup.members, role)}">
                                        {{ role }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="toolbar phi-media sub-toolbar">
                            <div class="phi-media-body">
                                <input class="search-field" type="text" 
                                    v-model="activeQuery" 
                                    :placeholder="$t('search people by name')"
                                />
                            </div>
                            <button class="phi-media-right phi-button" v-if="activeQuery.length > 0" @click="activeQuery = ''">
                                <i class="fa fa-times"></i>
                            </button>
                            <button class="phi-media-right phi-button" v-else>
                                <i class="fa fa-search"></i>
                            </button>
                        </div>

                        <!-- listado de personas en el grupo activo -->
                        <div class="phi-card" v-for="person in activeMembers">
                            <div class="person phi-media"
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
                            
                            <!-- relatives -->
                            <div class="person phi-media"
                                v-for="relative in person.relatives"
                                @click="togglePerson(relative)"
                                :class="{ selected: isSelected(relative) }"
                            >
                                <div class="phi-media-figure phi-avatar">
                                    <img :src="relative.avatar" :alt="relative.firstname">
                                </div>
                                <div class="phi-media-body">
                                    <h1>{{relative.firstname}} {{relative.lastname}}</h1>
                                    <span class="roles" v-for="(role, key) in relative.roles">{{ $t(role) }}<span v-if="key < relative.roles.length-1">, </span></span>
                                </div>
                                <div class="phi-media-options" v-show="isSelected(relative)">
                                    <i class="blue fa fa-check"></i>
                                </div>
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
            activeGroup: null,
            query: '',
            activeQuery: '',

            activeFuse: null,
            activeFuseKeys: [
                "firstname",
                "lastname",
                "relatives.firstname",
                "relatives.lastname"
            ],

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
                    "people.lastname"
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
        },

        activeMembers() {
            if (!this.activeGroup) {
                return [];
            }

            return this.activeQuery.length ? this.activeFuse.search(this.activeQuery) : this.activeGroup.members;
        }
    },

    methods: {
        isSelected(person) {
            return this.selection.some(selectedPerson => selectedPerson.id == person.id);
        },

        togglePerson(person) {
            this.isSelected(person) ? this.deselectPerson(person) : this.selectPerson(person);
        },

        selectPerson(person) {
            if (this.isSelected(person)) {
                return;
            }

            this.selection.push(person);
        },

        deselectPerson(person) {
            for (var i = 0; i < this.selection.length; i++) {
                if (this.selection[i].id == person.id) {
                    this.selection.splice(i, 1);
                    return;
                }
            }
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
            var promise = null;
            if (!group.hasOwnProperty('members')) {
                promise = this.api
                    .get(`v3/people/${this.personId}/relevance/groups/${group.id}`)
                    .then(members => this.$set(group, "members", members));
            } else {
                promise = new Promise((resolve, reject) => resolve());
            }

            promise.then(() => {
                this.activeGroup = group;
                this.template.boxIsFlipped = true;

                var searchOptions  = Object.assign({}, this.searchOptions);
                searchOptions.keys = this.activeFuseKeys;
                this.activeFuse    = new Fuse(this.activeGroup.members, searchOptions);

                this.query = '';
            });
        },

        closeGroup() {
            this.template.boxIsFlipped = false;
            this.activeGroup      = null;
            this.activeQuery      = '';
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

        roleIsSelected(people, role) {
            return people.filter(person => person.roles.indexOf(role) >= 0).every(this.isSelected);
        },

        selectWithRole(people, role) {
            people.forEach(person => {
                if (person.roles.indexOf(role) >= 0) {
                    this.selectPerson(person);
                }
            });
        },

        deselectWithRole(people, role) {
            people.forEach(person => {
                if (person.roles.indexOf(role) >= 0) {
                    this.deselectPerson(person);
                }
            });
        },

        toggleWithRole(people, role) {
            this.roleIsSelected(people, role) ? this.deselectWithRole(people, role) : this.selectWithRole(people, role);
        },

        togglePicker() {
            if (!this.groups.length) {
                this.fetchGroups().then(() => this.template.panelIsOpen = true);
            } else {
                this.template.panelIsOpen = !this.template.panelIsOpen
            }
            
            //prevent scroll displacement between navigation steps
            this.$el.querySelector("div.box div.front").scrollTop = 0;
            this.$el.querySelector("div.box div.back").scrollTop = 0;
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

.phi-avatar {
	width: 20px !important;
	height: 20px !important;
	order: 1;
}

.phi-media-body{
    text-align: left;

    h1{
        font-size: 1em;
        align-self: center;
        order: 2;
    }

    span.roles{
        font-size: .8em;
    }

    span.person-info{
        font-size: .9em;
    }
}

.phi-media-actions{
    font-size: .9em;
    text-align: center;
    order: 3;
}

.phi-media-options{
	font-size: .9em;
	text-align: center;
	order: 3;

    i.blue{
        color: #1C89B8;
    }
}

.phi-card{
    margin: 0 4px 1.1em 4px;

    h2{
        font-weight: 1.1em;
        color: #111;
        font-size: 1em;
        font-weight: 400;
        padding: .5em 0 .5em .5em;
    }
}

.person.phi-media.selected{
    border-left: 4px solid #1C89B8;
    background-color: #f7fcfe;
}

.optionsBar{
	border-top: 1px solid #D0D0D0;
}

.optionsHelp{
	text-align: right;
	padding-right: 5px;
}

.optionsBar{
	border-top: 1px solid #D0D0D0;
}

.phi-button.groups-counter{
    color: #1C89B8;
}

input.search-field{
    width: 100%;
    content: '\1F50D'
}

.toolbar{
    box-sizing: border-box;
    height: 64px;
    padding: 0 16px;
    display: flex;
    align-items: center;

    button{
        background: transparent;
        border: 0;
        padding: 0;
        font-size: 1.2em;
        width: 32px;
        height: 32px;
        color: inherit;
        box-shadow: none;
    }
}

.sub-toolbar{
    height: 40px;   
    padding: 0 16px 10px 16px; 
}

.phi-menu li{
    text-align: left;

    .checked{
        border-left: 4px solid #1C89B8;
        background-color: #f7fcfe;
    }
}
</style>