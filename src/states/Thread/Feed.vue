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
						<li @click="tpl.menuIsOpen = !tpl.menuIsOpen">
							<span>{{ $t("select") }}</span>
							<phi-drawer :open="tpl.menuIsOpen">
								<ul class="phi-menu">
									<li @click="select('all')">{{ $t("all") }}</li>
									<li @click="select('read')">{{ $t("read") }}</li>
									<li @click="select('unread')">{{ $t("unread") }}</li>
									<li @click="select('none')">{{ $t("none") }}</li>
								</ul>
							</phi-drawer>
						</li>
						<li @click="move('archive')" :disabled="!feed.count('selected')">{{ $t("archive") }}</li>
						<li @click="move('read')" :disabled="!feed.count('selected')">{{ $t("mark read") }}</li>
						<li @click="move('unread')" :disabled="!feed.count('selected')">{{ $t("mark unread") }}</li>
					</ul>
				</div>
			</div>
		</div>

		<mu-linear-progress color="#1c89b8" v-show="feed.isLoading" />

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
					<router-link :to="{name: 'thread', params:{threadId: post.thread.thread}}" class="phi-media-body">
						<h1 class="post-title" v-text="post.title"></h1>

						<div class="post-author" v-text="post.author.firstName"></div>
						<div class="post-count" v-text="post.thread.nTotal" v-show="post.thread.nTotal > 1"></div>
						<div class="post-preview" v-text="post.description"></div>

						<span class="post-date">{{ moment.unix(post.publishDate).calendar(null, {sameElse: 'MMM D'}) }}</span>
					</router-link>
				</div>

			</div>

		</div>

	</div>
</template>

<script>
import app from '../../store/app.js';
import moment from 'moment';
import PhiDrawer from '../../components/Phi/Drawer.vue';

export default {

	components: {
		PhiDrawer
	},

	beforeRouteEnter(to, from, next) {
		var feed = app.api.collection(`/people/${app.user.id}/threads/feed`);
		feed.fetch({type: to.query.type})
			.then(() => next(vm => vm.feed = feed));
	},

	data() {
		return {
			feed: app.api.collection(`/people/${app.user.id}/threads/feed`),
			moment,
			tpl: {
				menuIsOpen: false,
				toolbarIsHidden: false
			}
		}
	},

	methods: {
		isUnread(post) {
			// return post.thread.nUnread > 0;
			return !post.stub.readDate;
		},

		select(query) {
			if (query == "all") {
				this.feed.tag(this.feed.items, "selected");
				return;
			}

			this.feed.untag(this.feed.items, "selected");
			if (query == "none") {
				return;
			}

			this.feed.items.forEach(post => {
				switch (query) {
					case "read":
						if (post.stub.readDate) {
							this.feed.tag(post.id, "selected");
						}
					break;

					case "unread":
						if (!post.stub.readDate) {
							this.feed.tag(post.id, "selected");
						}
					break;
				}
			});
		},

		move(target) {
			var selection = this.feed.tagged("selected");
			if (!selection.length) {
				return;
			}

			var threadIds = selection.map(post => post.thread.thread);

			app.api
				.post(`/people/${app.user.id}/threads/` + target, threadIds)
				.then(() => {
					if (target != "read" && target != "unread") {
						this.feed.hide(selection);
					} else {
						this.feed.untag(selection, "selected");
						selection.forEach(post => {
							post.stub.readDate = target == "unread" ? null : 111;
						});
					}
				});

		}
	},

	mounted() {
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
	}
}

</script>

<style scoped lang="scss">
.phi-page-toolbar {
	background-color: #f3f3f3;
}

.phi-menu li {
	white-space: nowrap;
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

.post {
	cursor: pointer;

	.phi-media-figure {
		display: flex;
		align-items: center;
		margin-top: 2px;
	}

	/* check mark */
	.phi-media-figure i {
		font-size: 1.4em;
		text-align: center;
		color: #1C89B8;

		display: none;
	}

	.post-title {
		font-weight: 400;
		font-size: 1.1em;
		margin: 0;
		padding: 0;
	}

	.post-count {
		position: relative;
		top: -1px;

		display: inline-block;
		color: #999;
		font-size: 11px;

		&::before {
			content: '(';
		}
		&::after {
			content: ')';
		}
	}

	.post-author {
		display: inline-block;
	}

	.post-preview {
		color: #777;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.post-date {
		display: none;
		font-size: 0.8em;
		color: #999;
	}

	.post-author,
	.post-preview {
		font-size: 14px;
	}


	&.unread {

		.post-title {

			font-weight: bold;

			/* Unread indicator - green dot */
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

		.post-preview {
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
