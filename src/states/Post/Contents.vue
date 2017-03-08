<template>
	<div class="post-contents">

		<div class="main post" v-if="$parent.post.author">
			<div class="phi-media post-header" :is="$parent.isAllowed('audience') ? 'router-link' : 'div'" :to="{name: 'post-audience'}">
				<div class="phi-media-figure phi-avatar">
					<img :src="$parent.post.author.avatar" :alt="$parent.post.author.firstName">
				</div>

				<div class="phi-media-body">
					<h1 class="post-author" v-text="$parent.post.author.firstName + ' ' + $parent.post.author.lastName"></h1>
					<div class="post-date">{{ moment.unix($parent.post.publishDate).calendar(null, {sameElse: 'MMM D, h:mm a'}) }}</div>
					<div class="post-audience" v-if="$parent.isAllowed('audience')">enviado a {{ $parent.post.audienceCount }} {{ $parent.post.audienceCount == 1 ? 'persona' : 'personas' }}</div>
				</div>
			</div>

			<div class="post-description" v-text="$parent.post.description"></div>

			<div class="post-blocks">
				<phi-block
					v-for="block in $parent.post.blocks"
					:block="block"
				></phi-block>
			</div>

			<div class="post-forwards" v-if="$parent.post.forwards.length > 0">
				<label>Mensaje reenviado</label>
				<div class="forwarded post" v-for="forwardedPost in $parent.post.forwards">
					<div class="phi-media post-header">
						<div class="phi-media-figure phi-avatar">
							<img :src="forwardedPost.author.avatar" :alt="forwardedPost.author.firstName">
						</div>
						<div class="phi-media-body">
							<h1 class="post-author" v-text="forwardedPost.author.firstName + ' ' + forwardedPost.author.lastName"></h1>
							<div class="post-date">{{ moment.unix(forwardedPost.publishDate).calendar(null, {sameElse: 'MMM D, h:mm a'}) }}</div>
							<div class="post-subject" v-text="forwardedPost.title"></div>
						</div>
					</div>
					<div class="post-description" v-text="forwardedPost.description"></div>
					<div class="post-blocks">
						<phi-block
							v-for="block in forwardedPost.blocks"
							:block="block"
						></phi-block>
					</div>
				</div>
			</div>

		</div>

		<div class="post-threads">

			<router-link v-for="thread in threads.items"
				class="thread phi-card _z-0"
				:to="{name: 'post-thread', params: {thread: thread.id}, query: {cn: thread.countPeople}}"
				:class="{read: thread.countUnread == 0, unread: thread.countUnread > 0, empty: !thread.lastPost}"
			>
				<div class="thread-header _padded">
					<div class="thread-title" v-if="thread.lastPost">conversación con</div>
					<div class="thread-title" v-if="!thread.lastPost">Escribir a</div>
					<div class="thread-people">
						<div v-if="thread.id != $parent.post.thread" class="person" v-for="person in thread.people">{{person.firstName}} {{person.lastName}}</div>
						<div v-if="thread.id == $parent.post.thread" class="person">todos</div>
					</div>
				</div>

				<div class="phi-media post" v-if="thread.highlightPost">
					<div class="phi-media-figure phi-avatar">
						<img :src="thread.highlightPost.author.avatar" :alt="thread.highlightPost.author.firstName">
					</div>
					<div class="phi-media-body">
						<h1 class="post-author" v-text="thread.highlightPost.author.firstName + ' ' + thread.highlightPost.author.lastName"></h1>
						<div class="post-date">{{ moment.unix(thread.highlightPost.publishDate).calendar(null, {sameElse: 'MMM D, h:mm a'}) }}</div>
						<div class="post-description" v-text="thread.highlightPost.description"></div>
					</div>
				</div>

				<div class="thread-count-unread _padded" v-show="thread.countUnread > 1"> ... y {{thread.countUnread - 1}} más</div>

			</router-link>

		</div>
	</div>
</template>

<script>
import PhiDrawer from '../../components/Phi/Drawer.vue';
import PhiBlock from '../../components/Phi/Block.vue';
import moment from 'moment';

import app from '../../store/app.js';

export default {
	name: "post-contents",
	components: {PhiDrawer, PhiBlock},

	data() {
		return {
			app,
			moment,
			threads: app.api.collection(`/people/${app.user.id}/posts/feed/${this.$route.params.postId}/threads`)
		}
	},

	mounted() {
		this.threads.fetch()

			// Create dummy threads for main thread (replies to all) and personal thread (replies to author) if they don't exist yet
			.then(() => {

				this.threads._items.forEach(thread => {
					this.$set(thread, 'highlightPost', thread.firstUnreadPost ? thread.firstUnreadPost : thread.lastPost);
				});

				if (this.$parent.post.settings && this.$parent.post.settings.replies) {
					var authorThreadId = 'to-' + app.user.id;
					var authorThread   = this.threads.getItem(authorThreadId);
					var mainThread     = this.threads.getItem(this.$parent.post.thread);

					this.$parent.post.settings.replies.forEach(replyDefinition => {
						if (replyDefinition.audience == "author" && !authorThread && app.user.id != this.$parent.post.author.id) {
							this.threads.push({
								id: authorThreadId,
								people: [this.$parent.post.author],
								countPeople: 2
							});
						}
                        if (replyDefinition.audience == "all" && !mainThread && this.$parent.post.audienceCount > 2) {
							this.threads.push({
								id: this.$parent.post.thread,
								countPeople: this.$parent.post.audienceCount
							});
                        }
					});
				}

			});
	}

}
</script>

<style scoped lang="scss">

.post-contents {
	max-width: 768px;
	padding: 8px;
}

.post {

	.phi-media {
		padding: 0;
	}

	.phi-media-body {
		max-width: 100%;
	}

	&.main {
		margin-bottom: 22px;

		.post-description {
			margin: 24px 0;
			font-size: 1em;
		}
	}

	.post-audience {
		font-size: 12px;
		color: #666;
	}

	h1 {
		margin-bottom: 8px;
	}

	.phi-avatar {
		margin-top: 3px;
	}

	.post-author, .post-date {
		display: inline-block;
		margin: 0 0 3px 0;
	}

	.post-author {
		font-size: 16px;
		color: #444;
		font-weight: bold;
		margin: 0 0 3px 0;
	}

	.post-date {
		color: #000;
		opacity: 0.4;
		font-size: 0.9em;
		margin-left: 6px;
	}

	.post-description {
		margin: 0;
		max-width: 100%;
		overflow-x: hidden;
		font-size: 15px;

		white-space: pre-wrap;
	}


	.post-blocks {
		margin-top: 24px;
	}

	.phi-block {
		margin: 6px 0;
	}


	.post-forwards {
		font-size: 0.9em;
		border-left: 2px solid #ccc;
		padding: 4px 0 4px 16px;

		& > label {
			display: block;
			font-size: 12px;
			padding: 0;
			margin: 0 0 16px 0;
		}
	}
}


.thread {
	display: block;
	margin-bottom: 18px;

	&.empty {
		padding: 8px 16px;

		.thread-header {
			font-size: 1.6em;
			padding: 0;
		}
	}

	.thread-header {
		padding-bottom: 0;

		.thread-title,
		.thread-people {
			display: inline-block;
			font-size: 0.8em;
			color: #666;
		}

		.thread-people {
			color: #333;
			font-weight: bold;
		}
	}

	.thread-count-unread {
		display: inline-block;
		font-size: 12px;
		font-weight: bold;
		border-radius: 5px;
		// color: #fff;
		// background-color: #1C89B8;
		color: #1C89B8;
	}

	.post {
		font-size: 0.8em;

		.post-author {
			font-size: 1em;
		}

		.post-date {
			font-size: 0.7em;
		}

		.post-description {
			font-size: 1em;
		}

		.phi-avatar {
			margin: 0 8px 0 0;

			width: 32px;
			max-width: 32px;
			min-width: 32px;

			height: 32px;
			max-height: 32px;
			min-height: 32px;
		}
	}

	&.unread {
		.post {
			.post-author {
				font-weight: bold;
			}
		}
	}
}
</style>