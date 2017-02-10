<template>
	<div class="post-thread">
		<div
			v-for="post in thread.items.reverse()"
			class="post"
		>
			<div class="phi-media">
				<div class="phi-media-figure phi-avatar" @click="toggleUserInfo(post)">
					<img :src="post.author.avatar" :alt="post.author.firstName">
				</div>

				<div class="phi-media-body">
					<h1 class="post-author" v-text="post.author.firstName + ' ' + post.author.lastName"></h1>
					<div class="post-date">
						<span v-if="post.publishDate">{{ moment.unix(post.publishDate).format('h:mm a') }}</span>
						<span v-if="!post.publishDate">enviando ...</span>
					</div>

					<phi-drawer :open="post.isExpanded" v-if="post.node">
						<phi-person-inscriptions
							v-if="post.isInfoLoaded"
							:person="post.author"
							:node="post.node"
							@ready="post.isExpanded = true">
						</phi-person-inscriptions>
					</phi-drawer>

					<div class="post-description" v-text="post.description"></div>
				</div>
			</div>

			<div class="post-blocks">
				<phi-block
					v-for="block in post.blocks"
					:block="block"
				></phi-block>
			</div>
		</div>

		<footer class="phi-page-footer">
			<div class="reply">
				<textarea v-model="replyBody" @keydown.enter.prevent="sendReply()"></textarea>
				<button class="phi-button" :disabled="!replyBody.trim()" @click="sendReply()">enviar</button>
			</div>
			<!-- $route.query.cn is the number of all audience members including "me", hence the -1 -->
			<p v-if="$route.query.cn">Escribiendo a {{$route.query.cn - 1}} {{$route.query.cn == 2 ? 'destinatario' : 'destinatarios'}}</p>
		</footer>

	</div>
</template>

<script>
import moment from 'moment';
import StayDown from '../../libraries/staydown.js';

import PhiDrawer from '../../components/Phi/Drawer.vue';
import PhiBlock from '../../components/Phi/Block.vue';
import app from '../../store/app.js';

var destroyListener;
var stayDownScroller;

export default {
	name: "post-contents",
	components: {PhiDrawer, PhiBlock},

	data() {
		return {
			thread: app.api.collection(`/people/${app.user.id}/posts/feed/${this.$route.params.postId}/threads/${this.$route.params.thread}`),
			replyBody: "",
			moment
		}
	},

	methods: {

		sendReply() {
			// Retain textarea focus
			this.$el.querySelector('textarea').focus();

			if (!this.replyBody.trim().length) {
				return;
			}

			var outgoing = {
				author: app.user,
				description: this.replyBody
			};

			this.replyBody = "";
			this.thread.unshift(outgoing);

			app.api.post(`/people/${app.user.id}/posts/feed/${this.$route.params.postId}/threads/${this.$route.params.thread}`, outgoing)
				.then(post => {
					this.thread.splice(outgoing);
					this.thread.unshift(post);
					app.api.clear(`/people/${app.user.id}/posts/feed`);
				});
		},

		toggleUserInfo(post) {
			if (!post.isInfoLoaded) {
				post.isInfoLoaded = true;
				return;
			}
			post.isExpanded = !post.isExpanded;
		}
	},

	mounted() {
		/* stayDown */
		stayDownScroller = new StayDown({
			target: this.$parent.$el
		});

		destroyListener = app.on("notification", stub => {
			this.thread.unshift(stub.post);
		});
	},

	beforeRouteLeave(to, from, next) {
		stayDownScroller.destroy();
		destroyListener();
		next();
	},

	beforeRouteEnter(to, from, next) {
		var thread = app.api.collection(`/people/${app.user.id}/posts/feed/${to.params.postId}/threads/${to.params.thread}`);
		thread.fetch({type: to.query.type})
			.then(() => {
				next(vm => {
					vm.thread = thread;
				});
			});
	}

}
</script>

<style scoped lang="scss">
$phi-avatar-size: 32px;

.post-thread {
	padding: 8px;
	padding-bottom: 80px; //make room for the fixed footer
}

.post {
	margin-bottom: 22px;
	max-width: 768px;

	.phi-media {
		padding: 0;
	}

	.phi-media-body {
		max-width: 100%;
	}

	h1 {
		margin-bottom: 8px;
	}

	.phi-avatar {
		margin-top: 3px;
		cursor: pointer;

		width: $phi-avatar-size;
		max-width: $phi-avatar-size;
		min-width: $phi-avatar-size;

		height: $phi-avatar-size;
		max-height: $phi-avatar-size;
		min-height: $phi-avatar-size;
	}

	.post-author,
	.post-date {
		font-size: 0.9em;
		display: inline-block;
		margin: 0 0 3px 0;
	}

	.post-author {
		color: #444;
		font-weight: bold;
		margin: 0 0 3px 0;
	}

	.post-date {
		color: #000;
		opacity: 0.4;
		font-size: 0.8em;
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
}

.phi-person-inscriptions {
	padding: 4px 0 12px 0;
	font-size: 0.8em;
}


footer {
	position: fixed;
	bottom: 0;
	right: 0;
	padding: 12px;
	background-color: #f3f3f3;

	p {
		font-size: 12px;
		color: #666;
		padding: 4px 0;
	}

	.reply {
		display: flex;

		textarea {
			flex: 1;
			height: 48px;
			margin-right: 12px;
			font-size: 1.1em;
		}
	}
}

</style>