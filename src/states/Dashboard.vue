<template>
	<phi-page :loading="isLoading" color="#f3f3f3">

		<div slot="toolbar">
			<button @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
			<h1>{{ $t("Inbox") }}</h1>
		</div>

		<div>
			<section v-if="!!billboard">
				<div class="billboard phi-card _z-0">
					<router-link class="phi-card" :to="{name: 'thread', params:{threadId: billboard.thread2}}">
						<h1 v-text="billboard.title"></h1>
						<div v-text="billboard.description"></div>
					</router-link>

					<div class="blocks" v-if="billboard.blocks.length">
						<phi-block :block="billboard.blocks[0]"></phi-block>
					</div>
				</div>
			</section>
			<section v-show="!!types">
				<div class="types phi-card _z-0">
					<router-link
						v-for="type in types.items"
						:to="{name: 'feed', query:{type: type.singular}}"
						class="phi-media"
					>
						<img class="phi-media-figure" :src="type.icon || defaultIcon" :alt="type.plural"  >
						<h1 class="phi-media-body" v-text="type.plural"></h1>
						<p v-show="type.unread > 0" class="phi-media-right" v-text="type.unread"></p>
					</router-link>
				</div>
			</section>

			<mu-float-button icon="add" class="compose-button" @click="compose" />

		</div>
	</phi-page>
</template>

<script>
import PhiBlock from '../components/Phi/Block.vue';
import app from '../store/app.js';

export default {
	name: "dashboard",
	components: {PhiBlock},

	data() {
		return {
			app,
			types: app.api.collection(`/people/${app.user.id}/posts/types`),
			billboard: null,
			error: null,
			isLoading: false,
			defaultIcon: app.api.host + "/icons/fa-file-text.png?color=2196F3&size=42"
		}
	},

	methods: {
		compose() {
			app.api
				.post(`nodes/6dd7e15a/posts/drafts`, {type: 'mensaje'})
				.then(draft => this.$router.push({name: 'node-compose', params:{nodeId: '6dd7e15a', postId: draft.id}}));
		}
	},

	created() {
		this.isLoading = true;
		this.types
			.fetch()
			.then(() => this.isLoading = false);

		/* Fetch billboard */
		this.app.api
			.get(`/people/${app.user.id}/posts/inbox?tags=highlight&limit=1`)
			.then(response => this.billboard = response.length && !response[0].stub.readDate ? response[0] : null);
	},

	beforeRouteLeave(to, from, next) {
		this.isLoading = true;
		next();
	}
}
</script>


<style lang="scss" scoped>

.compose-button {
	position: absolute;
	bottom: 20px;
	right: 20px;

	background-color: #1C89B8;
}

section {
	margin-bottom: 24px;
}

.billboard {
	padding: 16px;

	h1 {
		font-size: 1.6em;
	}

	.blocks {
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid #ddd;
	}
}

.phi-media-body {
	align-self: center;

	font-size: 1.4em;
	font-weight: 400;
	text-transform: capitalize;
}

.phi-media-right {
	align-self: center;

	font-size: 12px;
	font-weight: bold;
	border-radius: 4px;
	padding: 4px 8px;

	background-color: #4c9689;
	color: #fff;
}
</style>