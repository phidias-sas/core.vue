<template>
	<ons-page>
		<ons-toolbar>
			<div class="left">
				<ons-toolbar-button data-action="calendar-back">
					<ons-icon icon="fa-chevron-left"></ons-icon>
				</ons-toolbar-button>
				<ons-toolbar-button data-action="calendar-forward">
					<ons-icon icon="fa-chevron-right"></ons-icon>
				</ons-toolbar-button>
			</div>
			<div class="center">
				<ons-toolbar-button data-action="calendar-today">Hoy</ons-toolbar-button>
			</div>
			<div class="right">
				<ons-toolbar-button data-action="calendar-month">Mes</ons-toolbar-button>
				<ons-toolbar-button data-action="calendar-week">Sem</ons-toolbar-button>
				<ons-toolbar-button data-action="calendar-day">Día</ons-toolbar-button>
			</div>
		</ons-toolbar>
		<div class="calendar-container" :person="person"></div>
	</ons-page>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import FC from "fullcalendar";
import FCLang from "../../../node_modules/fullcalendar/dist/locale/es.js";

export default {
	name: "phi-full-calendar",

	props: ["person"],

	data () {
		return {
			calendarConfig: {
				lang: 'es',
				defaultView: 'agendaDay',
				firstDay: 0,
				aspectRatio: 1,
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
					alert("Post thread id: "+thisEvent.post.thread);
				}
			}
		}
	},

	methods: {
	
	},

	mounted() {
		let calenndarContainer = this.$el.getElementsByClassName("calendar-container")[0];
		$(calenndarContainer).fullCalendar(this.calendarConfig);

		let backButton = this.$el.querySelector("ons-toolbar-button[data-action='calendar-back']");
		let forwardButton = this.$el.querySelector("ons-toolbar-button[data-action='calendar-forward']");
		let todayButton = this.$el.querySelector("ons-toolbar-button[data-action='calendar-today']");
		let monthButton = this.$el.querySelector("ons-toolbar-button[data-action='calendar-month']");
		let weekButton = this.$el.querySelector("ons-toolbar-button[data-action='calendar-week']");
		let dayButton = this.$el.querySelector("ons-toolbar-button[data-action='calendar-day']");

		backButton.addEventListener("click", () => $(calenndarContainer).fullCalendar('prev'));
		forwardButton.addEventListener("click", () => $(calenndarContainer).fullCalendar('next'));
		todayButton.addEventListener("click", () => $(calenndarContainer).fullCalendar('today'));
		monthButton.addEventListener("click", () => $(calenndarContainer).fullCalendar('changeView', 'month'));
		weekButton.addEventListener("click", () => $(calenndarContainer).fullCalendar('changeView', 'agendaWeek'));
		dayButton.addEventListener("click", () => $(calenndarContainer).fullCalendar('changeView', 'agendaDay'));

		let title = this.$el.querySelector("div.fc-toolbar.fc-header-toolbar > div.fc-center > h2");
		title.style.fontSize = "20px";
	}
}

</script>

<style scoped>
	@import url('../../../node_modules/fullcalendar/dist/fullcalendar.min.css');

	.calendar-container{
		margin-top: 7px;
	}
</style>