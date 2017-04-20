<template>
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()">
					<i class="fa fa-bars"></i>
				</button>
			</div>
			<div class="phi-page-header">
				<h1 class="phi-media-body">{{app.user.firstName}} {{app.user.lastName}}</h1>
			</div>
		</div>

		<div class="phi-page-contents">
			<div class="avatar">
				<img :src="app.user.avatar" />
			</div>
            <qrc-generator :size="256" :value="qrdata"></qrc-generator>
		</div>

	</div>
</template>

<script>
import app from '../store/app.js';
import PhiDrawer from '../components/Phi/Drawer.vue';
import qrcGenerator from '../components/Phi/QRCode/Generator.vue';

export default {
	name: "settings",
	components: {PhiDrawer, qrcGenerator},
	data() {
		return {
			app
		}
	},

	computed: {
		qrdata() {
			return JSON.stringify({
				id:        this.app.user.id,
				gender:    this.app.user.gender,
				firstName: this.app.user.firstName,
				lastName:  this.app.user.lastName,
				avatar:    this.app.user.avatar
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.phi-page-cover {
	background: url('../assets/cover.jpg') no-repeat 0 0;
	background-size: cover;
}

.phi-page-header {
	text-align: center;
	padding-bottom: 48px;
}

.phi-page-toolbar .phi-button {
	color: #fff;
	text-shadow: 0 1px 6px #000, 0 1px 3px #000;
}

.avatar {
	margin: auto;
	border: 3px solid #f2f2f2;
	border-radius: 14px;

	overflow: hidden;
	width: 112px;
	height: 112px;

	position: relative;
	top: -36px;

	& > img {
		width: 100%;
	}
}
</style>