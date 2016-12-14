<template>
	<div>
		<div class="views-list-menu" v-show="displayViewsMenu">
			<ul class="phi-menu">
				<li @click="changeView('month')" data-vname="month">Mes</li>
				<li @click="changeView('agendaDay')" data-vname="agendaDay">Día</li>
				<li @click="changeView('agendaWeek')" data-vname="agendaWeek">Semana</li>
				<li @click="changeView('listMonth')" data-vname="listMonth">Agenda</li>
			</ul>
		</div>

		<div class="calendar-container"></div>
	</div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import FC from "fullcalendar";

require("../../../node_modules/fullcalendar/dist/locale/es.js");

export default {
	name: "phi-full-calendar",

	props: ["defaultView", "eventSources"],

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
							evt.stopPropagation();
							that.positionViewMenu();
							that.displayViewsMenu = !that.displayViewsMenu;
						}
					}
				},
				header: {
					left: 'viewSwitcher',
					center: 'title',
					right: 'today,prev,next'
				},
/*
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
*/
				eventClick: function(thisEvent) {
					that.$router.push({ name: 'read', params: { threadId: thisEvent.post.thread }});
				},

				loading: function(isLoading, view){
					if(isLoading){
						that.$emit("loadingEvents", isLoading);
					}
				},

				eventAfterAllRender: function(view){
					that.$emit("loadingEvents", false);
				},

				viewRender: function(view, element) {
					that.positionViewMenu();	
				}
			},

			calendarViews: [
				{name: "month", "es": "Mes"}, 
				{name: "agendaDay", "es": "Día"}, 
				{name: "agendaWeek", "es": "Semana"}, 
				{name: "listMonth", "es": "Agenda"}, 
			],
			currentView: null,
			calendarContainer: null,
			displayViewsMenu: false
		}
	},

	watch: {
		currentView (){
			let changerButton = this.$el.querySelector("button.fc-viewSwitcher-button");
			
			this.calendarViews.map((viewDef) => {
				if(viewDef.name == this.currentView) {
					changerButton.innerHTML = viewDef.es;
				}
			});

			let menuItem = this.$el.querySelector("li[data-vname='"+this.currentView+"']");
			menuItem.classList.add("phi-menu-selected");
		}	
	},

	methods: {
		initializeCalendar () {
			this.calendarContainer = this.$el.getElementsByClassName("calendar-container")[0];

			if(this.defaultView){
				this.calendarConfig.defaultView = this.defaultView;
			}

			let internalSources = [];

			let that = this;
			for (let i = 0; i < this.eventSources.length; i++){
				let sourceUrl =  that.eventSources[i];
				let source = {
					events: function(start, end, timezone, callback){
						$.ajax({
						url: sourceUrl + '?start='+start.format("DD-MM-YYYY")+'&end='+end.format("DD-MM-YYYY"),
							dataType: 'json',
							headers: { 'Accept': 'application/json+fullcalendar' },
							success: function(resp) {
								callback(resp);
							}
						});
					}
				}
				internalSources.push(source);
			}
			this.calendarConfig.eventSources = internalSources;

			$(this.calendarContainer).fullCalendar(this.calendarConfig);
			this.currentView = this.calendarConfig.defaultView;
			
		},

		changeView (viewName){
			let previousView = this.currentView;
			$(this.calendarContainer).fullCalendar('changeView', viewName);
			this.currentView = viewName;

			let previousItem = this.$el.querySelector("li[data-vname='"+previousView+"']");
			previousItem.classList.remove("phi-menu-selected");

			this.displayViewsMenu = false;
		},

		positionViewMenu (){
			let viewChangerButton = this.$el.querySelector("button.fc-viewSwitcher-button");
			let viewChangerMenu = this.$el.querySelector("div.views-list-menu");
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
				this.positionViewMenu();
			});

			document.body.addEventListener("click", evt => {
				if(this.displayViewsMenu){
					this.displayViewsMenu = false;
				}
			});
		}
	},

	mounted() {
		this.addMenuEvents();
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

	.views-list-menu{
		width:200px;
		position: fixed;
		background-color: #eee;
		border: 1px solid #ccc;
		border-radius: 3px;
		z-index: 2;
		overflow: scroll;
	}
	
</style>