<template>
	<phi-page :style="{'background-image': `url(${coverImage})`}">

		<div slot="toolbar" class="toolbar">
			<button @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
			<ul class="phi-breadcrumbs phi-page-toolbar-wide">
				<li v-for="crumb in app.navigation.breadcrumbs">
					<router-link :to="{name:'node', params:{nodeId:crumb.id}}" v-text="crumb.name"></router-link>
				</li>
			</ul>
		</div>

		<div slot="header">
			<phi-drawer :open="!pageIsCollapsed">
				<div class="phi-page-header">
					<small v-html="node.type.singular || '&nbsp;'"></small> <!-- nbsp helps set the default cover height, which aides the transition animation-->
					<h1 v-html="node.name || '&nbsp;'"></h1>
				</div>
			</phi-drawer>

			<div class="phi-page-navigation">
				<router-link :to="{name:'node', params:{nodeId}}" exact>Inicio</router-link>
				<router-link v-for="type in types" :to="{name:'node-posts', params:{nodeId, type: type.singular}}" v-text="type.plural"></router-link>
				<router-link :to="{name:'node-people', params:{nodeId}}">Personas</router-link>
				<router-link :to="{name:'node-nodes', params:{nodeId}}">Grupos</router-link>
			</div>
		</div>

		<div :class="'moving-'+transitionDirection">
			<!--
			I wasted HOURS finding this:
			http://archive.forum.vuejs.org/topic/4840/keep-canreuse-in-vue-router-2-0/3
			use :key="$route.path"
			-->
			<transition name="slidetab">
				<router-view :key="$route.path"></router-view>
			</transition>
		</div>

	</phi-page>
</template>

<script>
import PhiDrawer from '../../components/Phi/Drawer.vue';
import app from '../../store/app.js';

function base_convert(number, initial_base, change_base) {
	if ((initial_base && change_base) <2 || (initial_base && change_base)>36) {
		return null; // Base must be between 2 and 36
	}
    return parseInt(number + '', initial_base).toString(change_base);
}

export default {
	name: "node-container",
	components: {PhiDrawer},

	created() {
		this.fetch()
			.then(node => {
				app.navigation.push(node);
			});
	},

	data() {
		var nodeId    = this.$route.params.nodeId;
		var nodeNum   = base_convert(nodeId, 36, 10).toString();
		var lastDigit = nodeNum.substring(nodeNum.length-1);

		return {
			app,
			types: [],
            nodeId: this.$route.params.nodeId,
			transitionDirection: "left",
            node: {
				id: null,
				type: {}
			},

			pageIsCollapsed: this.$route.name != 'node',
			coverImage: 'static/covers/' + lastDigit + '.jpg'
		}
	},

    methods: {
        fetch () {
			app.api.get("types/bulletin").then(types => this.types = types);
            return app.api.get("nodes/" + this.nodeId).then(node => this.node = node);
        }
    },

	watch: {
		'$route' (to, from) {
			this.pageIsCollapsed = to.name != 'node'
			if (from.params.type && to.params.type) {
				this.transitionDirection = (from.params.type < to.params.type) ? 'left' : 'right';
			} else {
				this.transitionDirection = (from.meta.order < to.meta.order) ? 'left' : 'right';
			}
		}
	},

	beforeRouteEnter(to, from, next) {
		app.api.get("types/bulletin").then(types => {
			app.api.get("nodes/" + to.params.nodeId).then(node => {
				next(vm => {
					vm.types = types;
					vm.node  = node;
				});
			});
		});
	}

}
</script>

<style lang="scss" scoped>
.phi-page-cover {
	background: #f9f9f9 url('../../../static/covers/9.jpg') no-repeat 0 0;
	background-size: cover;

	.phi-menu {
		color: #333;
	}
}

.toolbar {
	color: #fff;
}

.phi-page-navigation {
	text-transform: uppercase;
	& > * {
		/*color: rgba(255, 255, 255, 0.8);*/
		font-weight: 300;
	}
}

.phi-page-contents {
	position: relative;
}
</style>

<style lang="scss">
/* Transition between tabs */
$transition-duration:     .320s;
$transition-displacement: 120px;

.slidetab-enter-active,
.slidetab-leave-active {
	position: absolute;
	width: 100%;

	transition: transform $transition-duration, opacity $transition-duration;

	ons-fab {
		display: none;
	}
}

.slidetab-enter,
.slidetab-leave-active {
	opacity: 0;
}

.moving-left {
	.slidetab-enter {
		transform: translate3d($transition-displacement, 0, 0);
	}
	.slidetab-leave-active {
		transform: translate3d(-$transition-displacement, 0, 0);
	}
}

.moving-right {
	.slidetab-enter {
		transform: translate3d(-$transition-displacement, 0, 0);
	}
	.slidetab-leave-active {
		transform: translate3d($transition-displacement, 0, 0);
	}
}
</style>