<template>
	<div class="post-audience">

		<div v-for="stub in audience.items" class="phi-media person"  @click="toggleUserInfo(stub)">

			<div class="phi-media-figure phi-avatar">
				<img :src="stub.person.avatar" :alt="stub.person.firstName">
			</div>

			<div class="phi-media-body">
				<h1>{{stub.person.lastName}}, {{stub.person.firstName}}</h1>
				<div class="read-date">
					<span v-if="stub.readDate">{{ moment.unix(stub.readDate).format('h:mm a') }}</span>
					<span v-if="!stub.readDate">no leído</span>
				</div>

				<phi-drawer :open="audience.hasTag(stub, 'expanded')">
					<phi-person-inscriptions
						v-if="audience.hasTag(stub, 'hasInfo')"
						:person="stub.person"
						@ready="audience.tag(stub, 'expanded')">
					</phi-person-inscriptions>
				</phi-drawer>
			</div>

		</div>

	</div>
</template>

<script>
import PhiDrawer from '../../components/Phi/Drawer.vue';
import PhiPersonInscriptions from '../../components/Phi/Person/Inscriptions.vue';
import moment from 'moment';

import app from '../../store/app.js';

export default {
	name: "post-audience",
	components: {PhiDrawer, PhiPersonInscriptions},

	data() {
		return {
			audience: app.api.collection(`/posts/${this.$route.params.postId}/stubs`),
			moment
		}
	},

	methods: {
		toggleUserInfo(stub) {
			if (!this.audience.hasTag(stub, 'hasInfo')) {
				this.audience.tag(stub, 'hasInfo');
				return;
			}
			this.audience.toggleTag(stub, 'expanded');
		}
	},

	beforeRouteEnter(to, from, next) {
		var audience = app.api.collection(`/posts/${to.params.postId}/stubs`);
		audience.fetch()
			.then(() => {
				next(vm => {
					vm.audience = audience;
				});
			});
	}

}
</script>

<style scoped lang="scss">
$phi-avatar-size: 32px;

.post-audience {
	max-width: 768px;
}

.person {

	cursor: pointer;

	.phi-media {
		padding: 0;
	}

	// .phi-media-body {
	// 	max-width: 100%;
	// }

	h1 {
		font-size: 16px;
	}

	.phi-avatar {
		width: $phi-avatar-size;
		max-width: $phi-avatar-size;
		min-width: $phi-avatar-size;

		height: $phi-avatar-size;
		max-height: $phi-avatar-size;
		min-height: $phi-avatar-size;
	}

	.read-date {
		color: #000;
		opacity: 0.4;
		font-size: 0.8em;
	}

}

.phi-person-inscriptions {
	margin-top: 4px;
	padding: 6px 12px;
	font-size: 0.8em;
	border-radius: 4px;
	background-color: #fff;
}

</style>