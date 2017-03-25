<template>
    <div class="person-relevance-groups">
        <div class="list-container">
            <div class="groups-container">
                <div class="phi-page-toolbar">
                    <button class="phi-button" @click="closeGroupPannel">
                        <i class="fa fa-chevron-left"></i>
                    </button>
                    <h1> {{person.firstName}} {{person.lastName}}</h1>
                    <button class="phi-button counter">
                        {{selectedPeople.length}}
                    </button>
                </div>
                <section v-for="group in groups">
                    <h2 v-if="group.people.length > 0">{{group.name}}</h2>
                    <div class="phi-card">
                        <div class="person phi-media"  v-for="person in group.people"
                            @click="togglePerson(person)"
                            v-bind:class="{ selectedPerson: isSelected(person) }"
                        >
                            <div class="phi-media-figure phi-avatar">
                                <img :src="person.avatar" :alt="person.firstname">
                            </div>
                            <h1 class="phi-media-body">
                                {{person.firstname}} {{person.lastname}}
                                <input class="person-check" type="checkbox" :value="person.id" :checked="isSelected(person)">
                                <br>
                                <span class="roles" v-for="(role, key) in person.roles">{{ $t(role) }}<span v-if="key < person.roles.length-1">, </span></span>
                            </h1>
                            <div class="phi-media-options" v-show="isSelected(person)">
                                <i class="blue fa fa-check"></i>
                            </div>
                        </div>

                        <div class="person phi-media"
                            v-if="group.type !== 'relatives'"
                            v-bind:class="{ optionsBar: (group.people.length > 0) }"
                            @click="fetchGroupMembers(group)"
                        >
                            <h1 class="phi-media-body"
                                v-bind:class="{ optionsHelp: (group.people.length > 0) }"
                            >
                                <span v-show="(group.people.length > 0)">{{ $t("more people") }}</span>
                                <span v-show="(group.people.length <= 0)">{{group.name}}</span>
                            </h1>
                            <div class="phi-media-options">
                                <i class="fa fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div class="people-container">
                <div class="phi-page-toolbar">
                    <button class="phi-button" @click="closePersonPannel">
                        <i class="fa fa-chevron-left"></i>
                    </button>
                    <h1>{{activeGroup}}</h1>
                    <button class="phi-button counter">
                        {{selectedPeople.length}}
                    </button>
                </div>
                <section>
                    <div class="phi-card">
                        <div class="person phi-media" v-for="person in membersToLoad"
                            v-if="!person.hasOwnProperty('relatives')"
                            @click="togglePerson(person)"
                            v-bind:class="{ selectedPerson: (isSelected(person)) }"
                        >
                            <div class="phi-media-figure phi-avatar">
                                <img :src="person.avatar" :alt="person.firstname">
                            </div>
                            <h1 class="phi-media-body">
                                {{person.firstname}} {{person.lastname}}
                                <input class="person-check" type="checkbox" :value="person.id" :checked="isSelected(person)">
                                <br>
                                <span class="roles" v-for="(role, key, index) in person.roles">{{ $t(role) }}<span v-if="index > 0">,</span></span>
                            </h1>
                            <div class="phi-media-options" v-show="(isSelected(person))">
                                <i class="blue fa fa-check"></i>
                            </div>
                        </div>
                    </div>
			    </section>

                <div class="sections-container"  v-for="person in membersToLoad">
                    <section v-if="person.hasOwnProperty('relatives')">
                        <div class="phi-card">
                            <div class="person phi-media"
                                @click="togglePerson(person)"
                                v-bind:class="{ selectedPerson: (isSelected(person)) }"
                            >
                                <div class="phi-media-figure phi-avatar">
                                    <img :src="person.avatar" :alt="person.firstname">
                                </div>
                                <h1 class="phi-media-body">
                                    {{person.firstname}} {{person.lastname}}
                                    <input class="person-check" type="checkbox" :value="person.id" :checked="isSelected(person)">
                                    <br>
                                    <span class="roles" v-for="(role, key) in person.roles">{{ $t(role) }}<span v-if="key < person.roles.length-1">, </span></span>
                                </h1>
                                <div class="phi-media-options" v-show="isSelected(person)">
                                    <i class="blue fa fa-check"></i>
                                </div>
                            </div>

                            <div class="person phi-media" v-for="relative in person.relatives"
                                @click="togglePerson(relative)"
                                v-bind:class="{ selectedPerson: isSelected(relative) }"
                            >
                                <div class="phi-media-figure phi-avatar">
                                    <img :src="relative.avatar" :alt="relative.firstname">
                                </div>
                                <h1 class="phi-media-body">
                                    {{relative.firstname}} {{relative.lastname}}
                                    <input class="person-check" type="checkbox" :value="relative.id" :checked="isSelected(relative)">
                                    <br>
                                    <span class="roles" v-for="(role, key) in relative.roles">{{ $t(role) }}<span v-if="key < relative.roles.length-1">, </span></span>
                                </h1>
                                <div class="phi-media-options" v-show="isSelected(relative)">
                                    <i class="blue fa fa-check"></i>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "person-relevance-groups",

    model: {
		prop:  'selectedPeople',
		event: 'selectedPeopleChange'
	},

    props: {
        api: {
			required: true
		},

		selectedPeople: {
			type: Array,
			required: true
		},

        groups: {
			type: Array,
			required: true
		},

        person: {
			type: Object,
			required: true
		}
    },

    data() {
        return {
            groupsContainer: null,
            peopleContainer: null,
            activeGroup: null,
            membersToLoad: []
        }
    },

    methods: {
        togglePerson(person) {
            this.isSelected(person) ? this.removePerson(person) : this.addPerson(person);
        },

        isSelected(person) {
            return this.selectedPeople.indexOf(person) >= 0;
        },

        addPerson(person) {
            this.selectedPeople.push(person);
        },

        removePerson(person) {
            this.selectedPeople.splice(this.selectedPeople.indexOf(person), 1);
        },

        openPersonPannel(){
            this.$parent.$el.querySelector(".slider-pannel").scrollTop = 0;

            this.groupsContainer.style.setProperty("left", "-100%");
            this.groupsContainer.style.setProperty("opacity", "0");
            this.peopleContainer.style.setProperty("opacity", "1");
            this.peopleContainer.style.setProperty("left", "0");
        },

        closePersonPannel(){
            this.groupsContainer.style.setProperty("left", "0");
            this.groupsContainer.style.setProperty("opacity", "1");
            this.peopleContainer.style.setProperty("opacity", "0");
            this.peopleContainer.style.setProperty("left", "100%");
        },

        closeGroupPannel(){
            this.$emit("closeMe", true);
        },

        fetchGroupMembers(group) {
            this.membersToLoad = [];
            this.activeGroup = group.name;

            if(!group.hasOwnProperty("members")){
                this.api
                    .get(`v3/people/${this.personId}/relevance/groups/${group.id}`)
                    .then(people => {
                        group.members = people;
                        this.membersToLoad.splice(0, 0, ...group.members);
                        this.openPersonPannel();
                    });
            }else{
                this.membersToLoad.splice(0, 0, ...group.members);
                this.openPersonPannel();
            }
        }
    },

    mounted() {
        this.groupsContainer = this.$el.querySelector(".groups-container");
        this.peopleContainer = this.$el.querySelector(".people-container");
    }

}
</script>

<style scoped>
.list-container{
   overflow-x: hidden;
}

.groups-container{
    background-color: #F3F3F3;
    height: 100vh;
    z-index: 2;
    transition: 0.5s;
    width: 100%;

    position: absolute;
    top: 0;
    left: 0;
}

.people-container{
    background-color: #F3F3F3;
    height: 100vh;
    z-index: 100;
    transition: 0.5s;
    width: 100%;

    position: absolute;
    top: 0;
    left: 100%;
}

.phi-page-toolbar h1{
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}


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

.phi-card{
    margin: 0 4px 0 4px;
}

.phi-media-body span.roles{
	font-size: .8em;
}

.phi-media-body span.person-info{
	font-size: .9em;
}


.phi-media-options{
	font-size: .9em;
	text-align: center;
	order: 3;
}

div.phi-media-options i.blue{
	color: #1C89B8;
}

.optionsHelp{
	text-align: right;
	padding-right: 5px;
}

.optionsBar{
	border-top: 1px solid #D0D0D0;
}

input.person-check{
	visibility: hidden;
	display: none;
}

.selectedPerson{
	border-left: 4px solid #1C89B8;
	background-color: #f7fcfe;
}

section {
	margin-bottom: 1.1em;
}

section h2 {
	font-weight: 1.1em;
	color: #111;
	font-size: 1em;
    padding: 0 0 .5em .5em;
}

.phi-button.counter{
    background-color: #1C89B8;
    color: #fff;
    margin-left: 5px;
    vertical-align: middle;
    font-size: 1em;
}

.phi-page-toolbar h1{
    font-size: 1em;
}
</style>