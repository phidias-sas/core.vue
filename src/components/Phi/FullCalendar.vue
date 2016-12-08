<template>
	<div :person="person"></div>
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
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
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
		$(this.$el).fullCalendar(this.calendarConfig);
	}
}

</script>

<style scoped>
	@import url('../../../node_modules/fullcalendar/dist/fullcalendar.min.css');

	.fc-event-container{
		cursor: pointer;
	}

	td.fc-sat, td.fc-sun {
		background: rgba(136, 212, 255, 0.1);
	}

	.fc-day-number {
		font-size: 11px;
		color: #444;
	}

	.source-selector-container{
		list-style: none;
		margin: 0;
		padding: 0;
	}

	ul.source-selector-container li{
		display: inline-block;
		border-radius: 2px;
		margin-bottom: 5px;
		padding: 2px;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
	}

	ul.source-selector-container li:nth-child(1) {
		margin-top: 5px;
	}

	ul.source-selector-container li.disabled{
		opacity: 0.4;
	}

	ul.source-selector-container input[type=checkbox]{
		vertical-align: middle;
		position: relative;
	}

	ul.source-selector-container label{
		margin-right: 2px;
	}    

	th.fc-day-header{
		font-weight: normal;
	}

	.phidias-fc-container{
		max-width: 1024px;
	}

	.phidias-sources-selector-container{
		width: 145px;
		margin-left: 5px;
		border-left: 1px solid #ccc;
		padding-left: 5px;
	}

	.phidias-sources-selector-container li{
		font-family: Arial, sans-serif;
		font-weight: normal;
		font-size: 13px;
	}

	.source-selector-title{
		font-size: 12px;
		font-weight: bold;
		display: block;
	}

	.hidden-block{
		visibility: hidden;
	}

	.fc-day-number{
		cursor: pointer;
	}

	.fc-day-number:hover{
		text-decoration: underline;
	}

	@keyframes wave {
		from {
			transform: translateY(2px);
		}
		to {
			transform: translateY(-2px);
		}
	}
	.wavetext {
	
	}

	.wavetext span {
	display: inline-block;
	animation-duration: 0.3s;
	animation-name: wave;
	animation-iteration-count: infinite;
	animation-direction: alternate;
	}

	.wavetext :nth-child(40n + 0) {
	animation-delay: -0.6s;
	}

	.wavetext :nth-child(40n + 1) {
	animation-delay: -0.585s;
	}

	.wavetext :nth-child(40n + 2) {
	animation-delay: -0.57s;
	}

	.wavetext :nth-child(40n + 3) {
	animation-delay: -0.555s;
	}

	.wavetext :nth-child(40n + 4) {
	animation-delay: -0.54s;
	}

	.wavetext :nth-child(40n + 5) {
	animation-delay: -0.525s;
	}

	.wavetext :nth-child(40n + 6) {
	animation-delay: -0.51s;
	}

	.wavetext :nth-child(40n + 7) {
	animation-delay: -0.495s;
	}

	.wavetext :nth-child(40n + 8) {
	animation-delay: -0.48s;
	}

	.wavetext :nth-child(40n + 9) {
	animation-delay: -0.465s;
	}

	.wavetext :nth-child(40n + 10) {
	animation-delay: -0.45s;
	}

	.wavetext :nth-child(40n + 11) {
	animation-delay: -0.435s;
	}

	.wavetext :nth-child(40n + 12) {
	animation-delay: -0.42s;
	}

	.wavetext :nth-child(40n + 13) {
	animation-delay: -0.405s;
	}

	.wavetext :nth-child(40n + 14) {
	animation-delay: -0.39s;
	}

	.wavetext :nth-child(40n + 15) {
	animation-delay: -0.375s;
	}

	.wavetext :nth-child(40n + 16) {
	animation-delay: -0.36s;
	}

	.wavetext :nth-child(40n + 17) {
	animation-delay: -0.345s;
	}

	.wavetext :nth-child(40n + 18) {
	animation-delay: -0.33s;
	}

	.wavetext :nth-child(40n + 19) {
	animation-delay: -0.315s;
	}

	.wavetext :nth-child(40n + 20) {
	animation-delay: -0.3s;
	}

	.wavetext :nth-child(40n + 21) {
	animation-delay: -0.285s;
	}

	.wavetext :nth-child(40n + 22) {
	animation-delay: -0.27s;
	}

	.wavetext :nth-child(40n + 23) {
	animation-delay: -0.255s;
	}

	.wavetext :nth-child(40n + 24) {
	animation-delay: -0.24s;
	}

	.wavetext :nth-child(40n + 25) {
	animation-delay: -0.225s;
	}

	.wavetext :nth-child(40n + 26) {
	animation-delay: -0.21s;
	}

	.wavetext :nth-child(40n + 27) {
	animation-delay: -0.195s;
	}

	.wavetext :nth-child(40n + 28) {
	animation-delay: -0.18s;
	}

	.wavetext :nth-child(40n + 29) {
	animation-delay: -0.165s;
	}

	.wavetext :nth-child(40n + 30) {
	animation-delay: -0.15s;
	}

	.wavetext :nth-child(40n + 31) {
	animation-delay: -0.135s;
	}

	.wavetext :nth-child(40n + 32) {
	animation-delay: -0.12s;
	}

	.wavetext :nth-child(40n + 33) {
	animation-delay: -0.105s;
	}

	.wavetext :nth-child(40n + 34) {
	animation-delay: -0.09s;
	}

	.wavetext :nth-child(40n + 35) {
	animation-delay: -0.075s;
	}

	.wavetext :nth-child(40n + 36) {
	animation-delay: -0.06s;
	}

	.wavetext :nth-child(40n + 37) {
	animation-delay: -0.045s;
	}

	.wavetext :nth-child(40n + 38) {
	animation-delay: -0.03s;
	}

	.wavetext :nth-child(40n + 39) {
	animation-delay: -0.015s;
	}
</style>