<template>
	<ons-splitter>

		<ons-splitter-content id="main-view" :class="'move-'+transitionDirection">
			<transition
				name="slide"
				@before-enter="beforeEnter"
				@before-leave="beforeLeave"
				@enter="enter"
				@after-leave="afterLeave"
				>
				<router-view :key="$route.params.nodeId"></router-view>
			</transition>
		</ons-splitter-content>

		<ons-splitter-side
			id="sidemenu"

			swipe-target-width="64"
			side="left"
			width="314px"
			collapse="portrait"
			swipeable
			>

			<header>
				<div class="school">
					<h1 v-text="app.title"></h1>
				</div>

				<div class="user" v-if="app.user">
					<div class="phi-media" @click="isOpen.user = !isOpen.user; isOpen.school = false">
						<div class="phi-media-figure phi-avatar">
							<img :src="app.user.avatar" :alt="app.user.firstName">
						</div>
						<h1 class="phi-media-body" v-text="app.user.firstName + ' ' + app.user.lastName"></h1>
						<i class="phi-media-right fa" :class="{'fa-caret-right': !isOpen.user, 'fa-caret-down': isOpen.user}"></i>
					</div>
					<phi-drawer :open="isOpen.user">
						<div class="phi-menu" @click="toggleMenu">
							<router-link to="/settings">Preferencias</router-link>
							<div @click="logout()">Cerrar sesión</div>
						</div>
					</phi-drawer>
				</div>
			</header>


			<div class="phi-menu main-options" @click="toggleMenu">
				<router-link to="/dashboard">Bandeja de entrada</router-link>
				<router-link to="/archive">Archivados</router-link>
				<router-link to="/calendar">Calendario</router-link>
				<router-link to="/map">Mapa</router-link>

				<hr>

				<label class="phi-menu-label">años lectivos</label>
				<router-link v-for="node in nodes.items"
					:to="{name:'node', params:{nodeId:node.id}}"
					v-text="node.name"
					@click.native="app.navigation.clear()"
				></router-link>

				<hr>

				<div class="collapsable">
					<div @click.stop="isOpen.school = !isOpen.school" class="phi-media">
						<span class="phi-media-body">Contactar</span>
						<i class="phi-media-right fa" :class="{'fa-caret-right': !isOpen.school, 'fa-caret-down': isOpen.school}"></i>
					</div>

					<phi-drawer :open="isOpen.school">
						<div class="phi-menu" @click="isOpen.school = false">
							<a href="http://phidias.co" target="_blank">
								<i class="fa fa-laptop"></i>
								<span class="phi-media-body">Página web</span>
							</a>
							<a href="tel:7531147">
								<i class="fa fa-phone"></i>
								<span class="phi-media-body">Llamar</span>
							</a>
							<a href="geo:37.786971,-122.399677">
								<i class="fa fa-map-marker"></i>
								<span class="phi-media-body">Ubicación</span>
							</a>
						</div>
					</phi-drawer>
				</div>

			</div>
		</ons-splitter-side>

	</ons-splitter>
</template>

<script>
import PhiDrawer from '../components/Phi/Drawer.vue';
import app from '../store/app.js';

var incomingCover = null;
var outgoingCover = null;

export default {
	name: "deck",
	components: {PhiDrawer},
	data () {
		return {
			app,
			nodes: app.api.collection("nodes"),
			transitionDirection: 'left',

			isOpen: {
				school: false,
				user: false
			}
		}
	},

	mounted () {
		// this.nodes = app.api.collection("nodes");
		this.nodes.fetch();
	},

	methods: {
		logout() {
			this.app.logout();
			this.$router.push('login');
		},

		toggleMenu() {
			this.isOpen.school = false;
			this.isOpen.user   = false;

			this.$el.left.toggle();
		},

		beforeEnter(el) {
			incomingCover = el.querySelector('.phi-page-cover');
		},

		beforeLeave(el) {
			outgoingCover = el.querySelector('.phi-page-cover');

			setTimeout(() => {
				incomingCover && (incomingCover.initialHeight = incomingCover.clientHeight);

				var newCoverHeight = outgoingCover ? outgoingCover.clientHeight : 0;
				incomingCover && (incomingCover.style.height = newCoverHeight + "px");
				outgoingCover && (outgoingCover.style.height = newCoverHeight + "px");

				if (incomingCover && outgoingCover) {
					incomingCover.initialbackgroundColor = window.getComputedStyle(incomingCover).backgroundColor;
					incomingCover.style.backgroundColor  = window.getComputedStyle(outgoingCover).backgroundColor;
				}

				// force repaint
				incomingCover && incomingCover.offsetHeight;
				outgoingCover && outgoingCover.offsetHeight;
			}, 0);
		},

		enter(el) {
			setTimeout(() => {
				var newCoverHeight = incomingCover ? incomingCover.initialHeight : 0;
				incomingCover && (incomingCover.style.height = newCoverHeight + "px");
				outgoingCover && (outgoingCover.style.height = newCoverHeight + "px");

				incomingCover && (incomingCover.style.backgroundColor = incomingCover.initialbackgroundColor);

			}, 0);
		},

		afterLeave(el) {
			incomingCover && (incomingCover.style.height = "auto");
			outgoingCover && (outgoingCover.style.height = "auto");
		}
	},

	watch: {
		$route(to, from) {
			if (to.params.nodeId) {
				this.transitionDirection = from.params.nodeId < to.params.nodeId ? 'left' : 'right';
			} else {
				this.transitionDirection = (to.meta.order - from.meta.order) > 0 ? 'left' : 'right';
			}
		}
	}

}
</script>

<style lang="scss">
$transition-duration:     .420s;
$transition-displacement: 210px;

ons-splitter-mask {
	background-color: rgba(0, 0, 0, 0.5);
}

#sidemenu {
	overflow: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;

	background-color: #4D5250; /* slack's */
	background-color: #4D5050;
	background-color: rgb(48, 62, 77);
	color: #eaeaea;

	header {

		h1 {
			color: #fff;
			text-shadow: 0 2px 2px rgba(0, 0, 0, 0.6);
			align-self: center;
		}

		i.phi-media-right {
			align-self: center;
			color: #fff;
			opacity: 0.4;
		}

		.school {
			h1 {
				padding: 16px 24px 8px 24px;
				font-size: 1.3em;

				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;				
			}
		}

		.user {
			cursor: pointer;

			h1 {
				opacity: 0.8;
				font-size: 1em;
			}

			.phi-media {
				padding: 8px 24px;
			}

			.phi-avatar {
				width: 28px;
				height: 28px;
				min-width: 0;
				min-height: 0;
				margin-right: 12px;
			}

			.phi-drawer {
				padding: 12px 0;
			}
		}

	}

	.collapsable {
		padding: 0 8px;

		.phi-media {
			color: #fff;
		}

		.phi-drawer {
			padding: 12px 0;

			i {
				display: inline-block;
				text-align: left;
				width: 2em;
			}
		}
	}

	.main-options {
		margin-top: 24px;
	}

	hr {
		opacity: 0;
	}



}



.slide-enter-active,
.slide-leave-active {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	width: 100%;

	transition: opacity $transition-duration;

	.phi-page-contents, .phi-page-navigation > * {
		transition: transform $transition-duration;
	}
}

.slide-leave-active {
	opacity: 0;
}


.slide-enter,
.slide-enter-active {
	z-index: 1;
}

.slide-leave,
.slide-leave-active {
	z-index: 2;
}


/* Page cover transition */
.phi-page-cover {
	transition: height $transition-duration, padding $transition-duration;
}

/* Page toolbar transitions */
.slide-enter-active,
.slide-leave-active {
	.phi-page-toolbar {
		transition: transform $transition-duration;
	}
}

.slide-enter {
	.phi-page-toolbar {
		transform: translate3d(0, -100%, 0);
	}
}


.slide-leave-active {
	.phi-page-toolbar {
		transform: translate3d(0, -100%, 0);
	}
}


.move-left {

	.slide-enter {
		.phi-page-contents, .phi-page-navigation > * {
			transform: translate3d($transition-displacement, 0, 0);
		}
	}

	.slide-leave-active {
		.phi-page-contents, .phi-page-navigation > * {
			transform: translate3d(-$transition-displacement, 0, 0);
		}
	}
}

.move-right {

	.slide-enter {
		.phi-page-contents, .phi-page-navigation > * {
			transform: translate3d(-$transition-displacement, 0, 0);
		}
	}

	.slide-leave-active {
		.phi-page-contents, .phi-page-navigation > * {
			transform: translate3d($transition-displacement, 0, 0);
		}
	}

}




/* Toolbar animations */
#main-page .page__content {
	top: 0;
	padding-top: 44px;
}

#main-page .navigation-bar {
	opacity: 1;
	transform: translate3d(0, 0, 0);
	transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

#main-page.hidden-bar .navigation-bar {
	opacity: 0;
	transform: translate3d(0, -44px, 0);
}

/* Android Material Design */
#main-page.hidden-bar .navigation-bar--material {
	opacity: 0;
	transform: translate3d(0, -56px, 0);
}

#main-page .navigation-bar--material + .page__background + .page__content {
	padding-top: 56px;
}

</style>
