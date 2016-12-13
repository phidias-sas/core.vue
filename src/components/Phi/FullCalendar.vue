<template>
	<div>
		<phi-drawer :open="drawerIsOpen">
			<ul class="phi-menu">
				<li @click="changeView('month')" data-vname="month">Mes</li>
				<li @click="changeView('agendaDay')" data-vname="agendaDay">Día</li>
				<li @click="changeView('agendaWeek')" data-vname="agendaWeek">Semana</li>
				<li @click="changeView('listMonth')" data-vname="listMonth">Agenda</li>
			</ul>
		</phi-drawer>
		<div class="calendar-container" :person="person"></div>
	</div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import FC from "fullcalendar";

require("../../../node_modules/fullcalendar/dist/locale/es.js");

export default {
	name: "phi-full-calendar",

	props: ["person", "defaultView", "events"],

	data () {
		let that = this;
		return {
			calendarConfig: {
				lang: 'es',
				defaultView: 'listMonth',
				firstDay: 0,
				height: 'parent',
				customButtons: {
					viewSwitcher: {
						text: 'Ver',
						click: function(evt) {
							that.drawerIsOpen = !that.drawerIsOpen;
						}
					}
				},
				header: {
					left: 'viewSwitcher, today',
					center: 'title',
					right: 'prev, next'
				},

				events: function(start, end, timezone, callback) {
					let calendarContainer = this.view.el.parent().parent();
					$.ajax({
						url: 'https://phidias.api.phidias.co/people/'+calendarContainer.attr("person")+'/calendar/feed?start='+start.format("DD-MM-YYYY")+'&end='+end.format("DD-MM-YYYY"),
						dataType: 'json',
						headers: { 'Accept': 'application/json+fullcalendar' },
						success: function(resp) {
							callback(resp);
						}
					});
				},

				eventClick: function(thisEvent) {
					that.$router.push({ name: 'read', params: { threadId: thisEvent.post.thread }});
				},

				loading: function(isLoading, view){
					if(isLoading){
						that.$parent.loadingEvents = isLoading;
					}
				},

				eventAfterAllRender: function(view){
					that.$parent.loadingEvents = false;
				}
			},

			calendarViews: [
				{name: "month", "es": "Mes"}, 
				//{name: "basicWeek", "es": "semana"}, 
				//{name: "basicDay", "es": "día"},
				{name: "agendaDay", "es": "Día"}, 
				{name: "agendaWeek", "es": "Semana"}, 
				//{name: "listYear", "es": "lista anual"}, 
				{name: "listMonth", "es": "Agenda"}, 
				//{name: "listWeek", "es": "lista semanal"}, 
				//{name: "listDay", "es": "lista diaria"}
			],
			currentView: null,
			calendarContainer: null,
			drawerIsOpen: false
		}
	},

	watch: {
		currentView (){
			let drawerItem = this.$el.querySelector("li[data-vname='"+this.currentView+"']");
			drawerItem.classList.add("phi-menu-selected");
		}	
	},

	methods: {
		initializeCalendar () {
			this.calendarContainer = this.$el.getElementsByClassName("calendar-container")[0];

			if(this.defaultView){
				this.calendarConfig.defaultView = this.defaultView;
			}

			$(this.calendarContainer).fullCalendar(this.calendarConfig);
			this.currentView = this.calendarConfig.defaultView;
			
		},

		createToolbar (){
			let viewListButton = this.$el.querySelector("ons-toolbar-button[data-action='calendar-views']");
			let viewsPopover = this.$el.querySelector("ons-popover[data-action='calendar-views']");
			let filtersPopover = this.$el.querySelector("ons-popover[data-action='calendar-filters']");

			let viewOptions = this.$el.querySelectorAll("ons-input[name='available-calendar-views']");
			for (var viewOption of viewOptions) {
				viewOption.addEventListener("change", evt => {

					viewsPopover.hide();
					let selectedView = evt.srcElement.getAttribute("id");
					$(this.calendarContainer).fullCalendar('changeView', selectedView);
					this.currentView = selectedView;

				});
			}

			let headerLeft = this.$el.querySelector("div.fc-toolbar.fc-header-toolbar > div.fc-left");
			let headerRight = this.$el.querySelector("div.fc-toolbar.fc-header-toolbar > div.fc-right");

			let customLeftButton = document.createElement("ons-button");
			customLeftButton.addEventListener("click", () => $(this.calendarContainer).fullCalendar('prev'));
			let customLeftButtonIcon = document.createElement("ons-icon");
			customLeftButtonIcon.setAttribute("icon", "fa-chevron-left");
			customLeftButton.appendChild(customLeftButtonIcon);
			headerLeft.appendChild(customLeftButton);

			let customRightButton = document.createElement("ons-button");
			customRightButton.addEventListener("click", () => $(this.calendarContainer).fullCalendar('next'));
			let customRightButtonIcon = document.createElement("ons-icon");
			customRightButtonIcon.setAttribute("icon", "fa-chevron-right");
			customRightButton.appendChild(customRightButtonIcon);
			headerRight.appendChild(customRightButton);

			let todayButton = this.$el.querySelector("ons-toolbar-button[data-action='calendar-today']");

			let filtersButton = this.$el.querySelector("ons-toolbar-button[data-action='filters-pannel']");

			todayButton.addEventListener("click", () => $(this.calendarContainer).fullCalendar('today'));

			viewListButton.addEventListener("click", () => viewsPopover.show(viewListButton));
			
			filtersButton.addEventListener("click", () => filtersPopover.show(filtersButton));
		},

		changeView (viewName){
			let previousView = this.currentView;
			$(this.calendarContainer).fullCalendar('changeView', viewName);
			this.currentView = viewName;

			let previousItem = this.$el.querySelector("li[data-vname='"+previousView+"']");
			previousItem.classList.remove("phi-menu-selected");

			this.drawerIsOpen = false;
		}
	},

	mounted() {
		this.initializeCalendar();
	}
}

</script>

<style>
	@import url('../../../node_modules/fullcalendar/dist/fullcalendar.min.css');

	div.fc-toolbar.fc-header-toolbar > div.fc-center > h2{
		font-size: 17px;
		line-height: 33px;
		vertical-align: middle;
	}

	div.fc-toolbar.fc-header-toolbar{
		margin-bottom: 0.5em;
	}

	.calendar-container{
		margin-top: 3px;
		height:85vh;
	}

	div.fc-toolbar.fc-header-toolbar > div.fc-left{
		padding-left: 3px;
	}

	div.fc-toolbar.fc-header-toolbar > div.fc-right{
		padding-right: 3px;
	}

	.phi-menu-selected{
		 background-color: rgba(0, 0, 0, 0.1);
		 font-weight: bold;
	}
	
</style>