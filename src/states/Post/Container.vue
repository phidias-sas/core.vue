<template>
	<div class="phi-page scrollable">
		<ons-progress-bar indeterminate v-show="app.api.isLoading"></ons-progress-bar>
		<div class="phi-page-cover" :style="{'background-image': `url(${coverImage})`}">

			<div class="phi-page-toolbar" :class="{_hidden: toolbarIsHidden}">
				<button class="phi-button" @click="$router.go(-1)">
					<i class="fa fa-arrow-left"></i>
				</button>
				<h1></h1>
				<a v-if="post.event"
					:href="`${app.api.host}/calendar/events/${post.event.id}/ics`"
				><i class="fa fa-calendar-plus-o"></i></a>
			</div>

			<phi-drawer :open="!pageIsCollapsed">
				<div class="phi-page-header">
					<h1 v-html="post.title || '&nbsp;'"></h1><!-- nbsp helps set the default cover height, which aides the transition animation-->
				</div>
			</phi-drawer>
		</div>
		<div class="phi-page-contents" :class="'moving-'+transitionDirection">
			<!--
			I wasted HOURS finding this:
			http://archive.forum.vuejs.org/topic/4840/keep-canreuse-in-vue-router-2-0/3
			use :key="$route.path"
			-->
			<transition name="slidepost">
				<router-view :key="$route.path"></router-view>
			</transition>
		</div>
	</div>
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

	data() {
		var postNumericId = base_convert(this.$route.params.postId, 36, 10).toString();
		var lastDigit     = postNumericId.substring(postNumericId.length - 1);

		return {
			app,
			post: {
				id: this.$route.params.postId,
				type: {}
			},

			pageIsCollapsed: this.$route.name != 'post',
			transitionDirection: "left",
			coverImage: 'static/covers/' + lastDigit + '.jpg',
			toolbarIsHidden: false
		}
	},

	methods: {
		fetch() {
			return app.api.get("posts/" + this.post.id).then(post => this.post = post);
		}
	},

	watch: {
		'$route' (to, from) {
			this.pageIsCollapsed = to.name != 'post'
			if (from.params.type && to.params.type) {
				this.transitionDirection = (from.params.type < to.params.type) ? 'left' : 'right';
			} else {
				this.transitionDirection = (from.meta.order < to.meta.order) ? 'left' : 'right';
			}
		}
	},

	mounted() {
		/*
		Hide toolbar on scroll
		https://codepen.io/IliaSky/pen/VjgBqQ?editors=0110
		*/
		var page        = this.$el;
		var scrollValue = 0;
		var toolbar     = this.$el.querySelector(".phi-page-toolbar");

		['scroll', 'touchmove'].forEach((eventName) => {   // apparently 'touchmove' event is also needed for iOS
			page.addEventListener(eventName, () => {
				var delta = page.scrollTop - scrollValue;
				if (Math.abs(delta) > 8) {
					this.toolbarIsHidden = delta > 0 && scrollValue > toolbar.clientHeight;
					scrollValue = page.scrollTop;
				}
			});
		});
	},

	beforeRouteEnter(to, from, next) {
		app.api.get("posts/" + to.params.postId).then(post => {
			next(vm => {
				vm.post = post;
			});
		});
	}

}
</script>

<style scoped lang="scss">

.phi-page-cover {
	// background: #1C89B8 url('../../../static/covers/9.jpg') no-repeat 0 0;
	background: #1C89B8 !important;
	background-size: cover;

	.phi-menu {
		color: #333;
	}
}

.phi-page-header {
	h1 {
		font-size: 24px;
	}
}

.phi-page-navigation {
	background-color: rgba(0, 0, 0, 0.2);
}

.phi-page-toolbar {
	background-color: #1C89B8;
	color: #fff;
}

ons-progress-bar {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
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
$transition-displacement: 64px;

.slidepost-enter-active,
.slidepost-leave-active {
	position: absolute;
	top: 8px; /* must be the same as .phi-page-contents padding */
	left: 8px;
	right: 8px;

	transition: transform $transition-duration, opacity $transition-duration;

	// Hide footer during transitions
	/*
	Notice that the when the footer is position:fixed
	it will not position correctly, because
	CHILDREN OF transform'd elements create a new coordinate system (!!!)
	http://stackoverflow.com/questions/15194313/transform3d-not-working-with-position-fixed-children
	*/
	footer {
		display: none;
	}
}

.slidepost-enter,
.slidepost-leave-active {
	opacity: 0;
}

.moving-left {
	.slidepost-enter {
		transform: translate3d(0, $transition-displacement, 0);
	}
	.slidepost-leave-active {
		transform: translate3d(0, -$transition-displacement, 0);
	}
}

.moving-right {
	.slidepost-enter {
		transform: translate3d(0, -$transition-displacement, 0);
	}
	.slidepost-leave-active {
		transform: translate3d(0, $transition-displacement, 0);
	}
}
</style>