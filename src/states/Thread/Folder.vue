<template>
	<div class="phi-page scrollable">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar" :class="{_hidden: tpl.toolbarIsHidden}">

				<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>

				<h1 v-text="$route.query.type"></h1>

				<button @click="folder.move('archive')" class="phi-button selection-count" v-show="folder.selectionCount > 0">
					<span v-text="folder.selectionCount"></span>
					<i class="fa fa-archive"></i>
				</button>

				<div class="phi-tooltip">
					<button class="phi-button"> <i class="fa fa-ellipsis-v"></i></button>
					<ul class="phi-menu _texture-paper">
						<li @click="tpl.drawerIsOpen = !tpl.drawerIsOpen">
							<span>seleccionar</span>
							<phi-drawer :open="tpl.drawerIsOpen">
								<ul class="phi-menu">
									<li @click="folder.select('all')">todos</li>
									<li @click="folder.select('read')">leídos</li>
									<li @click="folder.select('unread')">no leídos</li>
									<li @click="folder.select('none')">ninguno</li>
								</ul>
							</phi-drawer>
						</li>
						<li @click="folder.move('archive')" :disabled="!folder.selectionCount">archivar</li>
						<li @click="folder.move('read')" :disabled="!folder.selectionCount">marcar leído</li>
						<li @click="folder.move('unread')" :disabled="!folder.selectionCount">marcar no leído</li>
					</ul>
				</div>
			</div>
		</div>

		<ons-progress-bar indeterminate v-show="folder.isLoading"></ons-progress-bar>

		<div class="phi-page-contents">
			<div class="empty" v-show="folder.isEmpty">
				<p>no hay nada aquí</p>
			</div>

			<div class="phi-card _z-0">
				<div v-for="thread in folder.threads"
					class="thread phi-media"
					:class="{selected: folder.isSelected(thread), read: !!thread.stub.readDate, unread: !thread.stub.readDate}"
				>
					<div class="phi-media-figure phi-avatar" @click="folder.toggle(thread)">
						<img :src="thread.author.avatar" :alt="thread.author.firstName">
						<i class="fa fa-check"></i>
					</div>
					<router-link class="phi-media-body" :to="{name: 'read', params:{threadId: thread.id}}">
						<h1 class="thread-title" v-text="thread.title"></h1>
						<span class="thread-description" v-text="thread.description"></span>
						<span class="thread-author" v-text="thread.author.firstName"></span>
						<span class="thread-date">{{ moment.unix(thread.publishDate).format('h:mm a') }}</span>
					</router-link>
				</div>
			</div>

			<button
				class="loadNext"
				v-show="folder.hasNext"
				@click="folder.next()"
				v-text="folder.isLoading ? 'cargando ...' : 'cargar más'"
			></button>
		</div>

		<div class="phi-toast" :class="{shown: tpl.toastIsShown}">
			<div v-if="folder.lastAction">
				<p class="phi-media-body" v-text="folder.lastAction.text"></p>
				<a @click="folder.undo()">deshacer</a>
			</div>
		</div>

	</div>
</template>

<script>
import PhiDrawer from '../../components/Phi/Drawer.vue';
import Folder from '../../libraries/Folder.js';
import app from '../../store/app.js';
import moment from 'moment';

export default {

	components: {
		PhiDrawer
	},

	data() {
		return {
			moment,
			folder: new Folder(app, this.$route.params.folder),
			tpl: {
				toolbarIsHidden: false,
				drawerIsOpen: false,
				toastIsShown: false
			}
		}
	},

	mounted() {

		this.$watch("folder.lastAction", action => {
			if (!action) {
				this.tpl.toastIsShown = false;
				return;
			}

			this.tpl.toastIsShown = true;
			setTimeout(() => this.tpl.toastIsShown = false, 3000);
		});

		// https://codepen.io/IliaSky/pen/VjgBqQ?editors=0110
		var page        = this.$el;
		var scrollValue = 0;
		var toolbar     = this.$el.querySelector(".phi-page-toolbar");
		['scroll', 'touchmove'].forEach((eventName) => {   // apparently 'touchmove' event is also needed for iOS
			page.addEventListener(eventName, () => {
				var delta = page.scrollTop - scrollValue;
				if (Math.abs(delta) > 8) {
					this.tpl.toolbarIsHidden = delta > 0  && scrollValue > toolbar.clientHeight;
					scrollValue = page.scrollTop;
				}
			});
		});

	},

	beforeRouteEnter(to, from, next) {
		var folder = new Folder(app, to.params.folder);
		folder.fetch({type: to.query.type})
			.then(() => {
				next(vm => {
					vm.folder = folder;
				});
			});
	},

	/* Mark as read in cache */
	beforeRouteLeave(to, from, next) {
		next();

		if (to.name == "read") {
			var thread = this.folder.collection.getItem(to.params.threadId);
			if (!thread.stub.readDate) {
				thread.stub.readDate = Math.floor(Date.now() / 1000);
				this.folder.collection.override();

				// override the cached dashboard count as well
				var dashboardUrl        = `people/${app.user.id}/posts/types`;
				var dashboardCollection = app.api.collection(dashboardUrl);
				dashboardCollection.fetch()
					.then(() => {
						dashboardCollection._items.forEach(type => {
							if (type.singular == thread.type.singular) {
								type.unread = Math.max(parseInt(type.unread) - 1, 0);
							}
						});
						dashboardCollection.override();
					});
			}

		}

	}

}

</script>

<style scoped lang="scss">

.loadNext {
	display: block;
	width: 100%;
	padding: 12px;
	margin: 12px 0;
	background: rgba(0, 0, 0, 0.1);
	color: #333;
	border: 0;
	cursor: pointer;
}

@media (min-width: 823px) {
	.phi-toast {
		left: 314px + 20px;
	}
}

.phi-toast {
	position: fixed;
	bottom: 16px;
	left: 16px;
	max-width: 420px;

	transition: transform 180ms ease-in-out;
	transform: translate3d(0, 200%, 0);

	&.shown {
		transform: translate3d(0, 0, 0);
	}

	& > div {

		display: flex;
		align-items: center;

		border-radius: 6px;
		background-color: #333;
		color: #fff;

		p, a {
			display: block;
			padding: 18px 24px;
			font-weight: 400;
		}

		a {
			color: #b2cfff;
			text-transform: uppercase;
			cursor: pointer;
		}

	}

}


/* This makes for smooth transitions when entering from states with high cover images */
/*.phi-page-cover {
	background-color: #1C89B8;
}*/

.phi-page-toolbar {
	background-color: #f3f3f3;
	img {
		width: 24px;
		height: 24px;
		margin-right: 1em;
	}
}

.empty {
	text-align: center;
	padding-top: 96px;
	background: url('../../assets/cactus.png') no-repeat top center;
	margin-top: 64px;

	p {
		font-size: 1.2em;
		margin: 12px 0;
		color: #666;
	}
}


.selection-count {
	width: auto;
	margin-right: 1em;

	& > * {
		display: inline-block;
	}

	span {
		font-size: 0.8em;
	}
}

.phi-menu li {
	white-space: nowrap;
}


.thread {

	cursor: pointer;

	.phi-media-figure {
		display: flex;
		align-items: center;
		margin-top: 2px;
	}

	.phi-media-figure i {
		display: none;

		font-size: 22px;
		text-align: center;
		color: #1C89B8;
	}

	.thread-title {
		font-weight: 400;
		font-size: 1.1em;
	}

	.thread-author,
	.thread-description {
		font-size: 0.9em;
	}

	.thread-author,
	.thread-date {
		color: #999;
	}

	.thread-date {
		font-size: 0.8em;
		&::before {
			content: ' - ';
		}
	}

	.thread-description {
		color: #555;
		font-size: 0.9em;
		display: block;
	}

	&.unread {
		.thread-title {
			font-weight: bold;
		}

		.thread-author,
		.thread-date {
			// color: #999;
			font-weight: bold;
		}

		.thread-date {
		}

		.thread-description {
			font-weight: bold;
		}
	}

	&.selected {
		background: #ff8;
		.phi-media-figure i {
			display: block;
		}
		.phi-media-figure img {
			display: none;
		}
	}
}
</style>
