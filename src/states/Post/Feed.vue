<template>
	<div class="phi-page scrollable">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar" :class="{_hidden: tpl.toolbarIsHidden}">

				<button class="phi-button" @click="$router.go(-1)">
					<i class="fa fa-arrow-left"></i>
				</button>

				<h1 v-text="$route.query.type"></h1>

				<button
					v-show="feed.count('selected') > 0"
					class="phi-button selection-count"
					@click="move('archive')"
				>
					<span v-text="feed.count('selected')"></span>
					<i class="fa fa-archive"></i>
				</button>

				<div class="phi-tooltip">
					<button class="phi-button"> <i class="fa fa-ellipsis-v"></i></button>
					<ul class="phi-menu _texture-paper">
						<li @click="tpl.drawerIsOpen = !tpl.drawerIsOpen">
							<span>seleccionar</span>
							<phi-drawer :open="tpl.drawerIsOpen">
								<ul class="phi-menu">
									<li @click="select('all')">todos</li>
									<li @click="select('read')">leídos</li>
									<li @click="select('unread')">no leídos</li>
									<li @click="select('none')">ninguno</li>
								</ul>
							</phi-drawer>
						</li>
						<li @click="move('archive')" :disabled="!feed.count('selected')">archivar</li>
						<li @click="move('read')" :disabled="!feed.count('selected')">marcar leído</li>
						<li @click="move('unread')" :disabled="!feed.count('selected')">marcar no leído</li>
					</ul>
				</div>
			</div>
		</div>

		<ons-progress-bar indeterminate v-show="feed.isLoading"></ons-progress-bar>

		<div class="phi-page-contents">
			<div class="empty" v-show="feed.isEmpty">
				<p>no hay nada aquí</p>
			</div>

			<div class="phi-card _z-0">

				<div v-for="post in feed.items"
					class="post phi-media"
					:class="{selected: feed.hasTag(post, 'selected'), read: !isUnread(post), unread: isUnread(post)}"
				>
					<div class="phi-media-figure phi-avatar" @click="feed.toggleTag(post, 'selected')">
						<img :src="post.author.avatar" :alt="post.author.firstName">
						<i class="fa fa-check"></i>
					</div>
					<router-link :to="{name: 'post', params:{postId: post.id}}" class="phi-media-body">
						<h1 class="post-title" v-text="post.title"></h1>

						<div v-if="!post.stub.lastReply">
							<span class="post-author" v-text="post.author.firstName"></span>
							<span class="post-description" v-text="post.description"></span>
							<span class="post-date">{{ moment.unix(post.publishDate).calendar(null, {sameElse: 'MMM D'}) }}</span>
						</div>

						<div v-if="post.stub.lastReply">
							<span class="post-author" v-text="post.stub.lastReply.author.firstName"></span>
							<span class="post-description" v-text="post.stub.lastReply.description"></span>
							<span class="post-date">{{ moment.unix(post.stub.lastReply.publishDate).calendar(null, {sameElse: 'MMM D'}) }}</span>
						</div>

					</router-link>
				</div>

			</div>

			<button
				class="loadNext"
				v-show="feed.hasNext"
				@click="feed.next()"
				v-text="feed.isLoading ? 'cargando ...' : 'cargar más'"
			></button>
		</div>

		<div class="phi-toast" :class="{shown: tpl.toastIsShown}">
			<div v-if="lastAction">
				<p class="phi-media-body" v-text="lastAction.text"></p>
				<a @click="undo()">deshacer</a>
			</div>
		</div>

	</div>
</template>

<script>
import PhiDrawer from '../../components/Phi/Drawer.vue';
import app from '../../store/app.js';
import moment from 'moment';

export default {

	components: {
		PhiDrawer
	},

	data() {
		return {
			moment,
			feed: app.api.collection(`/people/${app.user.id}/posts/feed`),
			lastAction: {},
			tpl: {
				toolbarIsHidden: false,
				drawerIsOpen: false,
				toastIsShown: false
			}
		}
	},

	mounted() {

		this.$watch("lastAction", action => {
			if (!action) {
				this.tpl.toastIsShown = false;
				return;
			}

			this.tpl.toastIsShown = true;
			setTimeout(() => this.tpl.toastIsShown = false, 3000);
		});

		// Hide toolbar on scroll
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

	methods: {

		isUnread(post) {
			if (!post.stub.readDate) {
				return true;
			}

			for (var i = 0; i < post.meta.replies.length; i++) {
				if ( parseInt(post.meta.replies[i].count.unread) > 0 ) {
					return true;
				}
			}

			return false;
		},

		select(query) {
			if (query == "all") {
				this.feed.tag(this.feed.items, "selected");
				return;
			}

			// Clear selection
			this.feed.untag(this.feed.items, "selected");

			if (query == "none") {
				return;
			}

			this.feed.items.forEach(post => {
				switch (query) {
					case "read":
						!!post.stub.readDate && this.feed.tag(post.id, "selected");
					break;

					case "unread":
						!post.stub.readDate && this.feed.tag(post.id, "selected");
					break;
				}
			});
		},

		move(target) {
			var posts = this.feed.tagged("selected");
			var targetUrl = `/people/${app.user.id}/posts/${target}`;

			this.lastAction = {
				target,
				posts,
				text: this.redact(target, posts)
			};

			if (target != "read" && target != "unread") {
				this.feed.hide(posts);
			} else {
				this.feed.untag(posts, "selected");
				posts.forEach(post => {
					post.stub.readDate = target == "unread" ? null : 123;
				});
			}

			return app.api.post(targetUrl, posts.filter(item => item.id))
				.catch(err => {
					this.feed.show(posts);
					return err;
				});
		},

		undo() {
			if (!this.lastAction) return;

			var target = "feed";
			if (this.lastAction.target == "read") {
				target = "unread";
			} else if (this.lastAction.target == "unread") {
				target = "read";
			}

			var targetUrl = `/people/${app.user.id}/posts/${target}`;

			if (target != "read" && target != "unread") {
				this.feed.show(this.lastAction.posts);
			} else {
				this.feed.tag(this.lastAction.posts, "selected");
				this.lastAction.posts.forEach(thread => {
					thread.stub.readDate = target == "unread" ? null : 123;
				});
			}

			return app.api.post(targetUrl, this.lastAction.posts.filter(item => item.id))
				.then(response => {
					this.lastAction = null;
					return response;
				});
		},

		redact(target, posts) {
			var plural    = posts.length > 1;
			var redaction = posts.length + ' ';
			switch (target) {
				case 'feed':
					redaction = redaction + (plural ? 'restaurados' : 'restaurado');
				break;
				case 'archive':
					redaction = redaction + (plural ? 'archivados' : 'archivado');
				break;
				case 'trash':
					redaction = redaction + (plural ? 'eliminados' : 'eliminado');
				break;
				case 'read':
					redaction = redaction + (plural ? 'marcados como leído' : 'marcado como leído');
				break;
				case 'unread':
					redaction = redaction + (plural ? 'marcados como no leído' : 'marcado como no leído');
				break;
			}

			return redaction;
		}
	},

	beforeRouteEnter(to, from, next) {
		var feed = app.api.collection(`/people/${app.user.id}/posts/feed`);
		feed.fetch({type: to.query.type})
			.then(() => {
				next(vm => {
					vm.feed = feed;
				});
			});
	},

	/* Mark as read in cache */
	beforeRouteLeave(to, from, next) {

		next();

		if (to.name == "read") {
			var post = this.feed.getItem(to.params.postId);
			if (!post.stub.readDate) {
				post.stub.readDate = Math.floor(Date.now() / 1000);
				this.feed.override();

				// override the cached dashboard count as well
				var dashboard = app.api.collection(`people/${app.user.id}/posts/types`);
				dashboard.fetch()
					.then(() => {
						dashboard._items.forEach(type => {
							if (type.singular == post.type.singular) {
								type.unread = Math.max(parseInt(type.unread) - 1, 0);
							}
						});
						dashboard.override();
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


.post {

	cursor: pointer;

	.phi-media-figure {
		display: flex;
		align-items: center;
		margin-top: 2px;
	}

	// check mark
	.phi-media-figure i {
		display: none;

		font-size: 1.4em;
		text-align: center;
		color: #1C89B8;
	}

	.post-title {
		font-weight: 400;
		font-size: 1.1em;
	}

	.post-author {
		font-size: 0.9em;
		&::after {
			content: ' - ';
		}
	}

	.post-description {
		font-size: 0.9em;
		color: #777;
	}

	.post-date {
		display: block;
		font-size: 0.8em;
		color: #999;
	}


	&.unread {

		.post-title {

			/* Unread indicator - but green dot */
			&::before {
				display: inline-block;
				content: "";
				background-color: #60ca8c;
				width: 10px;
				height: 10px;
				border-radius: 50%;

				vertical-align: top;
				margin: 5px 6px 0 0;
			}
		}

		.post-author,
		.post-date {
			// color: #999;
			font-weight: bold;
		}

		.post-date {
		}

		.post-description {
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
