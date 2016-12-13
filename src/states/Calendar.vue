<template>

    <div class="phi-page">
        <div class="phi-page-cover">
            <div class="phi-page-toolbar">
                <button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
                <h1>Calendario</h1>
            </div>            
        </div>

        <div class="phi-page-contents">
            <div>
                <phi-full-calendar :person="app.user.id"></phi-full-calendar>
            </div>
        </div>

    </div>
</template>

<script>
import app from '../store/app.js'

export default {
	name: "calendar",
	data () {
		return {
			app
		}
	}
}
</script>