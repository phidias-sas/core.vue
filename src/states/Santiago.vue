<template>
	<div id="container" :class="'at-page-'+curpage">

		<phi-page class="muh-page" id="page1" :loading="false" color="rgba(0, 0, 0, 0.6)" style="background-image: url('../../static/covers/4.jpg')">
			<div slot="toolbar" class="muh-toolbar">
				<button class="fa fa-bars" @click="curpage = 2"></button>
				<h1>{{ title }}</h1>
				<button class="fa fa-search"></button>
			</div>

			<div slot="header" class="muh-header">
				<h1>Hola</h1>
			</div>

			<div class="muh-contents">
				<h1>Bienvenidos a mi pagina :)</h1>
				<div class="phi-card _padded" v-for="n in 10">
					<p>Lorem akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasdk</p>
				</div>
			</div>

			<div slot="footer" class="muh-footer">
				<phi-drawer :open="!footer.expanded">
					<div class="face" @click="footer.expanded = true">Face</div>
				</phi-drawer>
				<phi-drawer :open="footer.expanded">
					<div class="contents">
						<h1 @click="footer.expanded = false">X</h1>
						<textarea rows="10"></textarea>
					</div>
				</phi-drawer>
			</div>
		</phi-page>

		<phi-page class="muh-page" id="page2" style="background-image: url('../../static/covers/7.jpg')">
			<div slot="toolbar" class="muh-toolbar">
				<button class="fa fa-search" @click="curpage = 1"></button>
				<h1>Otro toolbar distinto</h1>
				<button class="fa fa-ellipsis-v"></button>
			</div>
			<div slot="header" class="muh-header">
				<h1>Yo soy otra pagina</h1>
			</div>
			<div class="muh-contents">
				<h1>Bienvenidos a mi pagina 2 :)</h1>
				<div class="phi-card _padded" v-for="n in 7">
					<p>Lorem akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasd akjahdfkljah dfkasdhf laksjdhf kalsdfh kjashd fkajsdfh ajkh fajksdh fkasjfh kjasdk</p>
				</div>
			</div>
		</phi-page>

	</div>
</template>

<script>
export default {
	data() {
		return {
			title: 'Probando',
			curpage: 1,
			footer: {
				expanded: false
			}
		}
	}
}
</script>

<style lang="scss">
$transition-duration: 0.420s;
$transition-displacement: 320px;

#container {
	position: relative;

	#page1, #page2 {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;

		transition: $transition-duration;
		opacity: 1;

		.ph-page-contents > * {
			transition: $transition-duration;
		}

		.ph-page-header {
			transition: $transition-duration;
			height: 100px;
		}
	}

	&.at-page-1 {
		#page1 {
			opacity: 1;

			.ph-page-contents > * {
				transform: translate3d(0, 0, 0);
			}

			.ph-page-header {
				height: 100px;
				transform: translate3d(0, 0, 0);
			}
		}

		#page2 {
			opacity: 0;

			.ph-page-contents > * {
				transform: translate3d($transition-displacement, 0, 0);
			}

			.ph-page-header {
				height: 100px;
				transform: translate3d($transition-displacement, 0, 0);
			}
		}
	}

	&.at-page-2 {
		#page1 {
			opacity: 0;

			.ph-page-contents > * {
				transform: translate3d(-$transition-displacement, 0, 0);
			}

			.ph-page-header {
				height: 150px;
				transform: translate3d(-$transition-displacement, 0, 0);
			}
		}

		#page2 {
			opacity: 1;

			.ph-page-contents > * {
				transform: translate3d(0, 0, 0);
			}

			.ph-page-header {
				height: 150px;
				transform: translate3d(0, 0, 0);
			}
		}
	}

}

#page2 {
}


.muh-page {
	.muh-toolbar {
		color: #fff;
	}

	.muh-header {
		padding: 12px;
		color: #fff;
	}

	.muh-contents {
		padding: 12px;
	}

	.muh-footer {
		padding: 12px;

		.contents {
			textarea {
				width: 100%;
			}
		}
	}
}
</style>