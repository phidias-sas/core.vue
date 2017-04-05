<template>
	<div class="phi-page">
		<div class="phi-page-toolbar">
			<h1>Ubicación</h1>
		</div>

		<div class="phi-page-contents">
			<div class="phi-card target" v-if="target">
                <h1>{{ target.name }}</h1>

                <phi-tracker :target="target.id" :every="every" :enabled="enabled" @update="update"></phi-tracker>

                <select v-model="every">
                    <option :value="3000">3 segundos</option>
                    <option :value="10000">10 segundos</option>
                    <option :value="20000">20 segundos</option>
                </select>
                <button @click="enabled = !enabled">
                    <i v-show="enabled" class="fa fa-pause"></i>
                    <i v-show="!enabled" class="fa fa-play"></i>
                </button>

                <ul>
                    <li v-for="position in log">
                        <a target="_blank" :href="`https://www.google.com.co/maps/place//@${position.latitude},${position.longitude},17z`">{{position.latitude}}, {{position.longitude}}</a>
                    </li>
                </ul>

			</div>
		</div>
	</div>
</template>

<script>
import PhiTracker from '../../components/Phi/Tracker.vue';
import app from '../../store/app.js'

export default {
	name: "geo-tracker",
    components: {PhiTracker},

    beforeRouteEnter(to, from, next) {
        app.api
            .get(`/geo/targets/${to.params.targetId}`)
            .then(target => next(vm => vm.target = target));
    },

	data() {
		return {
			app,
            target: null,
            every: 3000,
            enabled: false,

            log: []
		}
	},

    methods: {
        update(position) {
            this.log.push(position);
        }
    }

}
</script>

<style lang="scss" scoped>
.target {
    padding: 12px;

    h1 {
        margin-bottom: 12px;
    }

    img {
        max-width: 200px;
    }
}
</style>