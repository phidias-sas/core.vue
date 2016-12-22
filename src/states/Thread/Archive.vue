<template>
	<div class="phi-page scrollable">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar" :class="{_hidden: tpl.toolbarIsHidden}">
				<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
				<h1>archivados</h1>
				<button @click="folder.move('inbox')" class="phi-button selection-count" v-show="folder.selectionCount > 0">
					<span v-text="folder.selectionCount"></span>
					<i class="fa fa-inbox"></i>
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
						<li @click="folder.move('inbox')" :disabled="!folder.selectionCount">restaurar</li>
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

			<div class="phi-card">
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
						<span class="thread-author" v-text="thread.author.firstName + ' ' + thread.author.lastName"></span>
						<span class="thread-description" v-text="thread.description"></span>
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

export default {

	components: {
		PhiDrawer
	},

	data() {
		return {
			folder: new Folder(app, 'archive'),
			tpl: {
				toolbarIsHidden: false,
				drawerIsOpen: false,
				toastIsShown: false
			}
		}
	},

	mounted() {

		this.folder.fetch();

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

.phi-toast {

	position: fixed;
	bottom: 16px;
	left: 16px;

	max-width: 420px;

	/* !!! */
	left: 280px;

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

	& > * {
		display: inline-block;
		margin-right: 0.5em;
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

	.thread-author {
		display: block;
		font-size: 0.85em;
		font-weight: 300;
	}

	.thread-description {
		display: block;
		font-weight: 300;
		color: #222;
	}

	&.unread {
		h1, p {
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
