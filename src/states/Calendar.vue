<template>

    <div class="phi-page">
        <div class="phi-page-cover">
            <div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
                <h1>Calendario</h1>
                <a :href="`${app.api.host}/people/${app.user.id}/calendar/ics`"><i class="fa fa-calendar-plus-o"></i></a>
            </div>            
        </div>
		
		<ons-progress-bar v-show="isLoading" indeterminate ></ons-progress-bar>
        
		<div class="phi-page-contents">
			<phi-full-calendar 
			:defaultView="defaultView"
			:eventSources="eventSources"  
			@loadingEvents="switchProgressBar"
			></phi-full-calendar>
        </div>
    </div>
	
</template>

<script>
import PhiFullCalendar from '../components/Phi/FullCalendar.vue';
import app from '../store/app.js';

export default {
	name: "calendar",
    components: {PhiFullCalendar},
	data () {
		return {
			app,
			defaultView: 'listMonth',
			eventSources: [`${app.api.host}/people/${app.user.id}/calendar/feed`], //only urls by now!!!
			isLoading: false
		}
	},

	methods: {
		switchProgressBar (state) {
			this.isLoading = state;
		}
	}
}
</script>

<style>

</style>