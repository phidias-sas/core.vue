<template>
    <phi-page :loading="isLoading">
		<div slot="toolbar">
			<button @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
			<h1>{{ $t("Calendar") }}</h1>
			<a :href="`${app.api.host}/people/${app.user.id}/calendar/ics?h=${hash}`"><i class="fa fa-calendar-plus-o"></i></a>
		</div>

		<div>
			<div class="views-list-menu" v-show="displayViewsMenu">
				<ul class="phi-menu">
					<li @click="currentView = 'month'" 		v-bind:class="{ 'phi-menu-selected': currentView === 'month' }">{{ $t("Month") }}</li>
					<li @click="currentView = 'agendaDay'" 	v-bind:class="{ 'phi-menu-selected': currentView === 'agendaDay' }">{{ $t("Day") }}</li>
					<li @click="currentView = 'agendaWeek'" v-bind:class="{ 'phi-menu-selected': currentView === 'agendaWeek' }">{{ $t("Week") }}</li>
					<li @click="currentView = 'listMonth'"	v-bind:class="{ 'phi-menu-selected': currentView === 'listMonth' }">{{ $t("Agenda") }}</li>
				</ul>
			</div>

			<div class="sources-filter-menu" v-show="displaySourcesFilter">
				<ul class="phi-menu short-padding">
					<li @click="sourceDef.toggle()" v-for="sourceDef in eventSources" v-bind:class="{ 'phi-menu-selected-alt': sourceDef.enabled }" class="prevent-menu-hiding">
						<span class="list-square" v-bind:style="{color: sourceDef.color}">■ </span>
						{{sourceDef.title}}
					</li>
				</ul>
			</div>

			<full-calendar
				:options="myCalendar"
				:current-view="currentView"
				@created="setCalendar"
			></full-calendar>
        </div>
    </phi-page>
</template>

<script>
import md5 from 'blueimp-md5';
import FullCalendar from '../components/Fullcalendar.vue';
import FCUtils from '../libraries/phidias.js/lib/Fullcalendar.js';
import app from '../store/app.js';
import locale from '../store/i18n.js';

export default {
	name: "calendar",
    components: {FullCalendar},

	data () {
		return {
			app,
			isLoading: false,
			displayViewsMenu: false,
			displaySourcesFilter: false,
			currentView: 'listMonth', //for switching views externaly
			fullCalendarInstance: null, //fullcalendar object returned on creation
			myCalendar: {},
			eventSources: [],
			hash: md5(`cal${app.user.id}shh`)
		}
	},

	methods: {
		initializeSources(){
			let calendarConfig = {
				googleCalendarApiKey: 'AIzaSyC-w7WOjp6Rgg4pZZDFW7Eqp6gR2AAlt4I',
				locale: locale.language,
        		firstDay: 0,
				defaultView: 'listMonth',
				height: 'parent',
				header: {
					left: 'viewSwitcher,sourcesFilter',
					center: 'title',
					right: 'today,prev,next'
				},
				loading: (isLoading, view) => {
					this.isLoading = isLoading;
				},
				customButtons: {
					viewSwitcher: {
						text: this.$t("View"),
						click: evt => {
							evt.stopPropagation();
							this.displaySourcesFilter = false;
							this.displayViewsMenu = !this.displayViewsMenu;
						}
					},

					sourcesFilter: {
						text: this.$t("Type"),
						click: evt => {
							evt.stopPropagation();
							this.displayViewsMenu =  false;
							this.displaySourcesFilter = !this.displaySourcesFilter;
						}
					}
				},
				viewRender: (view, element) => {
					this.positionMenu("button.fc-viewSwitcher-button", "div.views-list-menu");
					this.positionMenu("button.fc-sourcesFilter-button", "div.sources-filter-menu");
				},
				eventClick: (calEvent, jsEvent, view) => {
					jsEvent.preventDefault();

					if (calEvent.source.googleCalendarId) {
						let googleWindow = window.open(calEvent.url, '_blank');
						googleWindow.focus();
					} else {
						if (calEvent.hasOwnProperty('post')) {
							this.$router.push({ name: 'thread', params: { threadId: calEvent.post.thread2 }});
						} else {
							if (calEvent.url) {
								let newWindow = window.open(calEvent.url, '_blank');
								newWindow.focus();
							}
						}
					}
				}
			};

			//main sources array
			let sources = [];

			//get post types and create feeds for every one of them
			let calendarsByType = app.api.collection(`people/${app.user.id}/posts/types`)
				.fetch()
				.then( types => {
					types.forEach( (typeDef, index) => {
						sources.push({
							title: typeDef.plural,
							url: `${app.api.host}/people/${app.user.id}/calendar/feed?type=${typeDef.singular}`,
							headers: {
								Accept: 'application/json+fullcalendar',
								Authorization: `Bearer ${app.api.token}`
							}
						});
					});
				});

			//google example from educacem, uncomment to test, disabled by default
			//sources.push({enabled: false, title:"Lengua Extranjera: Ingl\u00e9s I 1\u00ba BXTO A",googleCalendarId:"educacem.com_8ab01jm6fnkksi46vv16u187ag@group.calendar.google.com"});

			//wait for everything to finish, then configure the calendar
			Promise.all([calendarsByType]).then( () => {
				this.preparedSources = FCUtils.prepareSources(sources);
				this.myCalendar = calendarConfig;
			});

		},

		setCalendar(fullCalendarInstance){
			this.fullCalendarInstance = fullCalendarInstance;
			this.eventSources = FCUtils.injectSources(this.fullCalendarInstance, this.preparedSources);
		},

		positionMenu (anchor, menuElement){
			let viewChangerButton = this.$el.querySelector(anchor);
			let viewChangerMenu = this.$el.querySelector(menuElement);
			let buttonHeight = parseInt(window.getComputedStyle(viewChangerButton).getPropertyValue('height'));

			let xPos = 0;
  			let yPos = 0;

			xPos += (viewChangerButton.getBoundingClientRect().left - viewChangerButton.scrollLeft + viewChangerButton.clientLeft);
      		yPos += (viewChangerButton.getBoundingClientRect().top - viewChangerButton.scrollTop + viewChangerButton.clientTop);

			viewChangerMenu.style.left = xPos + "px";
			viewChangerMenu.style.top = yPos + buttonHeight + 3 + "px";
		},

		addMenuEvents (){
			window.addEventListener("resize", () => {
				this.positionMenu("button.fc-viewSwitcher-button", "div.views-list-menu");
				this.positionMenu("button.fc-sourcesFilter-button", "div.sources-filter-menu");
			});

			document.body.addEventListener("click", evt => {
				if(evt.target.classList.contains("prevent-menu-hiding")){
					evt.stopPropagation();
					return false;
				}

				if(this.displayViewsMenu){
					this.displayViewsMenu = false;
				}

				if(this.displaySourcesFilter){
					this.displaySourcesFilter = false;
				}
			});

			document.addEventListener('scroll', evt =>  {
				this.positionMenu("button.fc-viewSwitcher-button", "div.views-list-menu");
				this.positionMenu("button.fc-sourcesFilter-button", "div.sources-filter-menu");
			}, true);

			this.$parent.$on("transitionFinished", () => {
				this.positionMenu("button.fc-viewSwitcher-button", "div.views-list-menu");
				this.positionMenu("button.fc-sourcesFilter-button", "div.sources-filter-menu");
			});
		}
	},

	mounted() {
		this.initializeSources();
		this.addMenuEvents();
	}
}
</script>

<style>
	.phi-menu-selected{
		background-color: rgba(0, 0, 0, 0.1);
		font-weight: bold;
	}

	.phi-menu-selected-alt{
		background-color: rgb(238, 238, 238);
		border-left: 5px solid #303e4d;
	}

	.phi-menu.short-padding li{
		padding-left: 10px;
	}

	.phi-menu.short-padding li:first-child{
		border-top-left-radius:3px;
	}

	.phi-menu.short-padding li:last-child{
		border-bottom-left-radius:3px;
	}

	.views-list-menu{
		width:200px;
		position: fixed;
		background-color: #eee;
		border: 1px solid #ccc;
		border-radius: 3px;
		z-index: 2;
	}

	.sources-filter-menu{
		width:200px;
		position: fixed;
		background-color: #eee;
		border: 1px solid #ccc;
		border-radius: 3px;
		z-index: 2;
	}

	.list-square{
		font-size: 16px;
	}
</style>