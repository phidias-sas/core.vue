<template>
	<div>
		<div class="calendar-container"></div>
	</div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import FC from "fullcalendar";

require("../../node_modules/fullcalendar/dist/locale-all.js");
require("../../node_modules/fullcalendar/dist/gcal.min.js");

export default {
	name: "full-calendar",

	props: {
		options: {
			type: Object,
			default: function () {
				return {};
			}
		},

		currentView: {
			type: String,
			required: true
		}
	},

	data () {
		return {

		}
	},

	watch: {
		currentView: function(newView, prevView){
			if(this.calendar){
				this.calendar.fullCalendar('changeView', newView);
			}
		},

		options: function(newConf, prevConf){
			this.initializeCalendar();
		}	
	},

	methods: {
		initializeCalendar () {

			if(Object.keys(this.options).length > 0){
				if(this.calendar){
					this.calendar.fullCalendar("destroy");
				}
				
				this.calendar = $(this.$el.querySelector(".calendar-container")).fullCalendar(this.options);
				
				this.$emit("created", this.calendar);
			}	

		}
	},

	mounted() {
		this.initializeCalendar();
	}
}

</script>

<style>
	@import url('../../node_modules/fullcalendar/dist/fullcalendar.min.css');

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

</style>