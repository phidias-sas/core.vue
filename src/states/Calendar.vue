<template>

    <div class="phi-page">
        <div class="phi-page-cover">
            <div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
                <h1>Calendario</h1>
            </div>            
        </div>
		
		<ons-progress-bar indeterminate v-show="loadingEvents"></ons-progress-bar>
        
		<div class="phi-page-contents">
			<phi-full-calendar 
			:person="app.user.id" 
			:defaultView="defaultView"
			></phi-full-calendar>
        </div>
    </div>
	
</template>

<script>
import app from '../store/app.js';

export default {
	name: "calendar",
	data () {
		return {
			app,
			defaultView: 'listMonth',
			loadingEvents: false
		}
	}
}
</script>

<style>

</style>