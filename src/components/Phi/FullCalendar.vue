<template>
	<div>
		<ons-page>
			<ons-toolbar>
				<div class="left">
					<ons-toolbar-button data-action="calendar-today">
						<ons-icon icon="fa-calendar-check-o"></ons-icon>
					</ons-toolbar-button>
				</div>
				<div class="center">
					<ons-toolbar-button data-action="calendar-views"></ons-toolbar-button>
				</div>
				<div class="right">
					<ons-toolbar-button data-action="filters-pannel">
						<ons-icon icon="fa-filter"></ons-icon>
					</ons-toolbar-button>
				</div>
			</ons-toolbar>

			<div class="calendar-container" :person="person"></div>
		</ons-page>

		<ons-popover direction="down" data-action="calendar-views" cancelable>
			<ons-list>
				<ons-list-header>Vista</ons-list-header>
				<ons-list-item tappable v-for="calendarDef in calendarViews">
					<label class="left">
						<ons-input name="available-calendar-views" type="radio" :input-id="calendarDef.name"></ons-input>
					</label>
					<label :for="calendarDef.name" class="center">
						{{ calendarDef.es }}
					</label>
				</ons-list-item>
			</ons-list>
		</ons-popover>

		<ons-popover direction="down" data-action="calendar-filters" cancelable>
			<ons-list>
				<ons-list-header>Filtros</ons-list-header>
				<ons-list-item tappable>
					<label class="left">
						<ons-input name="reuniones" type="checkbox" input-id="reuniones"></ons-input>
					</label>
					<label for="reuniones" class="center">
						Reuniones	
					</label>
				</ons-list-item>
				<ons-list-item tappable>
					<label class="left">
						<ons-input name="cumpleanos" type="checkbox" input-id="cumpleanos"></ons-input>
					</label>
					<label for="cumpleanos" class="center">
						Cumpleaños	
					</label>
				</ons-list-item>
				<ons-list-item tappable>
					<label class="left">
						<ons-input name="capacitaciones" type="checkbox" input-id="capacitaciones"></ons-input>
					</label>
					<label for="capacitaciones" class="center">
						Capacitaciones	
					</label>
				</ons-list-item>
			</ons-list>
		</ons-popover>
	</div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import FC from "fullcalendar";

require("../../../node_modules/fullcalendar/dist/locale/es.js");

export default {
	name: "phi-full-calendar",

	props: ["person"],

	data () {
		let that = this;
		return {
			calendarConfig: {
				lang: 'es',
				defaultView: 'listMonth',
				firstDay: 0,
				height: 'parent',
				header: {
					left: false,
					center: 'title',
					right: false
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
				}
			},

			calendarViews: [
				{name: "month", "es": "mes"}, 
				{name: "basicWeek", "es": "semana"}, 
				{name: "basicDay", "es": "día"}, 
				{name: "agendaWeek", "es": "agenda semanal"}, 
				{name: "agendaDay", "es": "agenda día"}, 
				{name: "listYear", "es": "lista anual"}, 
				{name: "listMonth", "es": "lista mensual"}, 
				{name: "listWeek", "es": "lista semanal"}, 
				{name: "listDay", "es": "lista diaria"}
			],
			currentView: null
		}
	},

	watch: {
		currentView: function (val) {
			let viewListButton = this.$el.querySelector("ons-toolbar-button[data-action='calendar-views']");

			this.calendarViews.map(viewDef => {
				if(viewDef.name == this.currentView){
					viewListButton.innerHTML = viewDef.es;

				}	
			});
		}
	},

	methods: {
	
	},

	mounted() {
		let calenndarContainer = this.$el.getElementsByClassName("calendar-container")[0];
		$(calenndarContainer).fullCalendar(this.calendarConfig);
		this.currentView = this.calendarConfig.defaultView;

		this.$el.querySelector("ons-input[input-id='"+this.calendarConfig.defaultView+"']").setAttribute("checked", true);

		let viewListButton = this.$el.querySelector("ons-toolbar-button[data-action='calendar-views']");
		let viewsPopover = this.$el.querySelector("ons-popover[data-action='calendar-views']");
		let filtersPopover = this.$el.querySelector("ons-popover[data-action='calendar-filters']");

		let viewOptions = this.$el.querySelectorAll("ons-input[name='available-calendar-views']");
		for (var viewOption of viewOptions) {
			viewOption.addEventListener("change", evt => {

				viewsPopover.hide();
				let selectedView = evt.srcElement.getAttribute("id");
				$(calenndarContainer).fullCalendar('changeView', selectedView);
				this.currentView = selectedView;

			});
		}

		let headerLeft = this.$el.querySelector("div.fc-toolbar.fc-header-toolbar > div.fc-left");
		let headerRight = this.$el.querySelector("div.fc-toolbar.fc-header-toolbar > div.fc-right");

		let customLeftButton = document.createElement("ons-button");
		customLeftButton.addEventListener("click", () => $(calenndarContainer).fullCalendar('prev'));
		let customLeftButtonIcon = document.createElement("ons-icon");
		customLeftButtonIcon.setAttribute("icon", "fa-chevron-left");
		customLeftButton.appendChild(customLeftButtonIcon);
		headerLeft.appendChild(customLeftButton);

		let customRightButton = document.createElement("ons-button");
		customRightButton.addEventListener("click", () => $(calenndarContainer).fullCalendar('next'));
		let customRightButtonIcon = document.createElement("ons-icon");
		customRightButtonIcon.setAttribute("icon", "fa-chevron-right");
		customRightButton.appendChild(customRightButtonIcon);
		headerRight.appendChild(customRightButton);

		let todayButton = this.$el.querySelector("ons-toolbar-button[data-action='calendar-today']");

		let filtersButton = this.$el.querySelector("ons-toolbar-button[data-action='filters-pannel']");

		todayButton.addEventListener("click", () => $(calenndarContainer).fullCalendar('today'));

		viewListButton.addEventListener("click", () => viewsPopover.show(viewListButton));
		
		filtersButton.addEventListener("click", () => filtersPopover.show(filtersButton));

	}
}

</script>

<style>
	@import url('../../../node_modules/fullcalendar/dist/fullcalendar.min.css');

	div.fc-toolbar.fc-header-toolbar > div.fc-center > h2{
		font-size: 20px;
		line-height: 36px;
		vertical-align: middle;
	}

	div.fc-toolbar.fc-header-toolbar{
		margin-bottom: 0.5em;
	}

	.calendar-container{
		margin-top: 7px;
	}

	div.fc-toolbar.fc-header-toolbar > div.fc-left{
		padding-left: 5px;
	}

	div.fc-toolbar.fc-header-toolbar > div.fc-right{
		padding-right: 5px;
	}
	
</style>