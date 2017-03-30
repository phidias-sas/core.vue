<template>
    <div class="person-relevance-groups">
        <div class="list-container">
            <div class="groups-container">
                <div class="groups-toolbar">
                    <button class="phi-button" @click="closeGroupPannel">
                        <i class="fa fa-chevron-left"></i>
                    </button>
                    <transition name="fade">
                        <h1 v-if="!searching">{{person.firstName}} {{person.lastName}}</h1>
                        <input v-else type="text" :placeholder="$t('search people by name')" v-model="groupsQuery" name="search-in-groups" class="search-field">
                    </transition>
                    <button class="phi-button counter" v-if="selectedPeople.length > 0">
                        {{selectedPeople.length}}
                    </button>
                    <button class="phi-button" @click="toggleSearch('groups')">
                        <i class="fa" :class="[searching ? 'fa-times' : 'fa-search']"></i>
                    </button>
                    <div class="phi-tooltip" v-if="!searching">
                        <button class="phi-button"> <i class="fa fa-ellipsis-v"></i></button>
                        <ul class="phi-menu _texture-paper">
                            <li v-for="groupFilter in  peopleFilters.groups" :class="{ checked: groupFilter.selected }">
                                <input class="groups-filter-check" type="checkbox" :id="person.id+'-'+groupFilter.name" value="1" @change="toggleGroupRoleFilter(groupFilter.name, $event)">
                                <label :for="person.id+'-'+groupFilter.name">{{groupFilter.name}}</label>
                            </li>
                        </ul>
                    </div>
                </div>
                <section v-if="searching">
                    <div class="empty-search-help" v-if="peopleFinded.length <= 0">
                        <h3 v-if="groupsQuery.length <= 0">{{ $t("type a name") }}</h3>
                        <h3 v-else>{{ $t("no one with that name") }}</h3>
                    </div>
                    <div class="person phi-media"  v-for="person in peopleFinded"
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
                </section>
                <section v-else v-for="group in groups">
                    <h2 v-if="(group.people.length > 0)">{{group.name}}</h2>
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
                            v-if="(group.type !== 'relatives')"
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
                <div class="groups-toolbar">
                    <button class="phi-button" @click="closePersonPannel">
                        <i class="fa fa-chevron-left"></i>
                    </button>
                    <transition name="fade">
                        <h1 v-if="!searching">{{activeGroup.name}}</h1>
                        <input v-else type="text" :placeholder="$t('search people by name')" v-model="membersQuery" name="search-in-members" class="search-field">
                    </transition>
                    <button class="phi-button counter" v-if="selectedPeople.length > 0">
                        {{selectedPeople.length}}
                    </button>
                    <button class="phi-button" @click="toggleSearch('members')">
                        <i class="fa" :class="[searching ? 'fa-times' : 'fa-search']"></i>
                    </button>
                    <div class="phi-tooltip" v-if="!searching">
                        <button class="phi-button"> <i class="fa fa-ellipsis-v"></i></button>
                        <ul class="phi-menu _texture-paper">
                            <li v-for="groupFilter in  peopleFilters.members[activeGroup.id]" :class="{ checked: groupFilter.selected }">
                                <input class="groups-filter-check" type="checkbox" :id="activeGroup.id+'-'+groupFilter.name" value="1" @change="toggleMemberRoleFilter(groupFilter.name, $event)">
                                <label :for="activeGroup.id+'-'+groupFilter.name">{{groupFilter.name}}</label>
                            </li>
                        </ul>
                    </div>
                </div>
                <section v-if="searching">
                    <div class="empty-search-help" v-if="peopleFinded.length <= 0">
                        <h3 v-if="membersQuery.length <= 0">{{ $t("type a name") }}</h3>
                        <h3 v-else>{{ $t("no one with that name") }}</h3>
                    </div>
                    <div class="person phi-media"  v-for="person in peopleFinded"
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
                </section>
                <section v-if="!searching">
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

                <div class="sections-container"  v-for="person in membersToLoad" v-if="!searching">
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
		},

        openParent: {
			type: Boolean,
			required: false
		}
    },

    data() {
        return {
            groupsContainer: null,
            peopleContainer: null,
            activeGroup: {id: 0, name: "undefined"},
            membersToLoad: [],
            peopleFilters: {
                groups: [],
                members: {}
            },
            searching: false,
            groupsQuery: '',
            membersQuery: '',
            peopleFinded: []
        }
    },

    watch: {
		groups: function(newArray) {
			if(this.groups.length > 0){
                this.populateGroupRoles();
            }
		},

        openParent: function(isOpen) {
			if(!isOpen){
                this.closePersonPannel();
            }
		},

        groupsQuery: function(newQuery){
            this.findPeople("groups", newQuery);
        },

        membersQuery: function(newQuery){
            this.findPeople("members", newQuery);
        }
	},

    methods: {
        togglePerson(person) {
            console.log(person);
            this.isSelected(person) ? this.removePerson(person) : this.addPerson(person);
        },

        isSelected(person) {
            
            return this.selectedPeople.some( selectedPerson => {
                if(selectedPerson.id === person.id){
                   return true
                }
            });

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

            this.groupsQuery = "";
            this.searching = false;
        },

        closePersonPannel(){
            this.groupsContainer.style.setProperty("left", "0");
            this.groupsContainer.style.setProperty("opacity", "1");
            this.peopleContainer.style.setProperty("opacity", "0");
            this.peopleContainer.style.setProperty("left", "100%");

            this.membersQuery = "";
            this.searching = false;
        },

        closeGroupPannel(){
            this.groupsQuery = "";
            this.membersQuery = "";
            this.searching = false;
            this.$emit("closeMe", true);
        },

        fetchGroupMembers(group) {
            this.membersToLoad = [];
            this.activeGroup = {id: group.id, name:group.name};

            if(!group.hasOwnProperty("members")){
                this.api
                    .get(`v3/people/${this.personId}/relevance/groups/${group.id}`)
                    .then(people => {
                        group.members = people;
                        this.membersToLoad.splice(0, 0, ...group.members);

                        this.populateMembersRoles(group);

                        this.openPersonPannel();
                    });
            }else{
                this.membersToLoad.splice(0, 0, ...group.members);
                this.openPersonPannel();
            }

        },

        populateMembersRoles(group){
            let cache = ["everyone"];
            this.$set(this.peopleFilters.members, group.id, []);
            this.peopleFilters.members[group.id].splice(0, 0, {name: "everyone", selected: false});

            group.members.map( member => {
                member.roles.forEach( role => {
                    if(cache.indexOf(role) < 0){
                        cache.push(role);
                        this.peopleFilters.members[group.id].splice( this.peopleFilters.members[group.id].length, 0, {name: role, selected: false}); 
                    }
                });

                if(member.hasOwnProperty("relatives")){
                     member.relatives.map( relative => {
                        relative.roles.forEach( role => {
                            if(cache.indexOf(role) < 0){
                                cache.push(role);
                                this.peopleFilters.members[group.id].splice( this.peopleFilters.members[group.id].length, 0, {name: role, selected: false}); 
                            }
                        });
                    }); 
                }
            });  
        },

        populateGroupRoles(){
            let cache = ["everyone"];
            this.peopleFilters.groups.splice(0, 0, {name: "everyone", selected: false});
            this.groups.map(group => {
                group.people.forEach( person => {
                    person.roles.forEach( role => {
                        if(cache.indexOf(role) < 0){
                            cache.push(role);
                            this.peopleFilters.groups.splice(this.peopleFilters.groups.length, 0, {name: role, selected: false}); 
                        }
                    });
                });
            });
        },

        toggleGroupRoleFilter(role, evt){
            this.peopleFilters.groups.map( filter => {
                if(filter.name === role || role === "everyone"){
                    filter.selected = evt.target.checked;
                }
            });

            this.groups.map(group => {
                group.people.forEach( person => {
                    if(person.roles.indexOf(role) >= 0 || role === "everyone"){
                        if(evt.target.checked){
                            if(!this.isSelected(person)){
                                this.addPerson(person);
                            }
                        }else{
                            if(this.isSelected(person)){
                                this.removePerson(person);
                            }
                        }
                    }
                });
            });
        },

        toggleMemberRoleFilter(role, evt){
            this.peopleFilters.members[this.activeGroup.id].map( filter => {
                if(filter.name === role || role === "everyone"){
                    filter.selected = evt.target.checked;
                }
            });

            this.membersToLoad.forEach( person => {
                if(person.roles.indexOf(role) >= 0 || role === "everyone"){
                    if(evt.target.checked){
                        if(!this.isSelected(person)){
                            this.addPerson(person);
                        }
                    }else{
                        if(this.isSelected(person)){
                            this.removePerson(person);
                        }
                    }
                }
                
                if(person.hasOwnProperty("relatives")){
                    person.relatives.forEach( relative => {
                        if(relative.roles.indexOf(role) >= 0 || role === "everyone"){
                            if(evt.target.checked){
                                if(!this.isSelected(relative)){
                                    this.addPerson(relative);
                                }
                            }else{
                                if(this.isSelected(relative)){
                                    this.removePerson(relative);
                                }
                            }
                        }
                    });
                }
            });
        },

        toggleSearch(type){
            this.searching = !this.searching;
            
            if(!this.searching){
                switch(type){
                    case "groups":
                        this.groupsQuery = "";
                    break;

                    case "members":
                        this.membersQuery = "";
                    break;
                }
            }

        },

        searchResult(type, person){
            if(type === "groups"){
                if(this.searching && this.groupsQuery.trim().length > 0){
                    if(person.firstname.toLowerCase().includes(this.groupsQuery.toLowerCase()) || person.lastname.toLowerCase().includes(this.groupsQuery.toLowerCase())){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return true;
                }
            }
        },

        findPeople(type, query){
            if(query.trim().length > 0){
                let filteredPeople = [];
                let idsCache = [];
                switch(type){
                    case "groups":
                        this.groups.map(group => {
                            group.people.forEach( person => {
                                if(idsCache.indexOf(person.id) < 0){
                                    idsCache.push(person.id);
                                    if(person.firstname.toLowerCase().includes(query.toLowerCase()) || person.lastname.toLowerCase().includes(query.toLowerCase())){
                                        filteredPeople.push(person);    
                                    }    
                                }
                            });
                        });
                        this.peopleFinded = filteredPeople;
                    break;

                    case "members":
                        this.membersToLoad.forEach( person => {
                            if(idsCache.indexOf(person.id) < 0){
                                idsCache.push(person.id);
                                if(person.firstname.toLowerCase().includes(query.toLowerCase()) || person.lastname.toLowerCase().includes(query.toLowerCase())){
                                    filteredPeople.push(person);    
                                }    
                            }

                            if(person.hasOwnProperty("relatives")){
                                person.relatives.forEach( relative => {
                                    if(idsCache.indexOf(relative.id) < 0){
                                        idsCache.push(relative.id);
                                        if(relative.firstname.toLowerCase().includes(query.toLowerCase()) || relative.lastname.toLowerCase().includes(query.toLowerCase())){
                                            filteredPeople.push(relative);    
                                        }    
                                    }
                                });
                            }
                        });
                        this.peopleFinded = filteredPeople;
                    break;
                }

            }else{
                this.peopleFinded = [];
            }

            console.log(this.peopleFinded);
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

.groups-toolbar h1{
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
    color: #1C89B8;
    margin-left: 5px;
    vertical-align: middle;
    font-size: 1em;
    font-weight: 600;
}

.groups-toolbar h1{
    font-size: 1em;
}

.groups-filter-check{
    visibility: hidden;
    display: none;
}

.phi-menu li label{
    display: block; 
    min-height: 100%;
    height: 100%;
}

.phi-menu li.checked{
    border-left: 4px solid #1C89B8;
    background-color: #f7fcfe;
}

input.search-field{
    width: 100%;
}

.empty-search-help{
    text-align: center;
}

.empty-search-help h3{
    font-size: 1.1em;
}

.fade-enter-active {
    transition: opacity .5s
}

.fade-leave-active {
    transition: opacity 0s
}

.fade-enter, .fade-leave-to {
    opacity: 0
}
</style>