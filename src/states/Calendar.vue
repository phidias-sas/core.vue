<template>

    <div class="phi-page">
        <div class="phi-page-cover">
            <div class="phi-page-toolbar">
				<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
                <h1>Calendario</h1>
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
import app from '../store/app.js'

export default {
	name: "calendar",
	data () {
		return {
			app,
			defaultView: 'listMonth',
			eventSources: ['https://phidias.api.phidias.co/people/'+app.user.id+'/calendar/feed'], //only urls by now!!!
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