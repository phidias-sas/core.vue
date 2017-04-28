<template>
<div class="phi-page">
	<div class="phi-page-cover">
		<div class="phi-page-toolbar">
			<button class="phi-button" @click="$parent.$el.left.toggle()">
				<i class="fa fa-bars"></i>
			</button>
			<h1>{{ $t('Transport') }}</h1>
		</div>
	</div>
	
	<mu-linear-progress color="#1c89b8" v-show="app.api.isLoading" />

	<div class="phi-page-contents" v-if="app.user && target" >
		<h2> {{ $t('Tracker') }} </h2>
		<div class="phi-card target">
			<div class="phi-media">
				<div class="phi-media-body">
					<h1>{{ target.name }}</h1>
				</div>
				<div class="phi-media-right">
					<mu-switch :value="enabled" @change="enabled = !enabled" />	
				</div>
			<!--<select v-model="every">
				<option :value="3000">3 segundos</option>
				<option :value="10000">10 segundos</option>
				<option :value="20000">20 segundos</option>
			</select>-->
			<!--<button @click="enabled = !enabled">
				<i v-show="enabled" class="fa fa-pause"></i>
				<i v-show="!enabled" class="fa fa-play"></i>
			</button>-->
			</div>
			<!--<ul>
				<li v-for="position in log">
					<a target="_blank" :href="`https://www.google.com.co/maps/place//@${position.latitude},${position.longitude},17z`">{{position.latitude}}, {{position.longitude}}</a>
				</li>
			</ul>-->
		</div>
		<phi-tracker :target="target.id" :every="every" :enabled="enabled" @update="update" :targetName="target.name"></phi-tracker>
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
		margin-bottom: 0px;
	}

	img {
		max-width: 200px;
	}

	.phi-media {
		padding: 0px;
	}
}
.phi-page-contents {
	h2 {
		font-weight: 1em;
		text-transform: uppercase;
		color: #666;
		margin-bottom: 0.5em;
		font-size: 0.8em;
	}
}
</style>