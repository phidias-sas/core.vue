<template>
	<div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()">
					<i class="fa fa-bars"></i>
				</button>
				<h1>Relevance test</h1>
			</div>
		</div>

		<div class="phi-page-contents">
			<ons-progress-bar v-show="isLoading" indeterminate ></ons-progress-bar>


			<picker2
				:api="app.api"
				:person-id="app.user.id"
				v-model="audience1"
			>
				<h1>Hola, soy picker2!</h1>
			</picker2>


			<button @click="tpl.isFlipped = !tpl.isFlipped">Alternar</button>

			<div class="box" :class="{flipped: tpl.isFlipped}">
				<div class="front">
					<label>Cara 1</label>
					<div class="group phi-card" v-for="group in groups" @click="openGroup(group)">
						{{ group.name }}
					</div>
				</div>

				<div class="back">
					<label>Cara 2</label>
					<button @click="tpl.isFlipped = false">Regresar</button>

					<div v-if="activeGroup">
						<h1>{{ activeGroup.name }}</h1>
						<pre>{{ activeGroup.members }}</pre>
					</div>
					<div v-else>
						<h1>No hay grupo</h1>
					</div>
				</div>
			</div>


			<div style="max-width: 768px">
				<phi-person-relevance-picker
					:api="app.api"
					v-model="audience1"
					person-id="1405"
				>
					 <!-- sample slot content -->
					 <div>
						<div class="person phi-media">
							<div class="phi-media-figure phi-avatar">
								<img src="http://www.extramedia1.com/wp-content/uploads/2016/05/02.jpg" alt="Jon">
							</div>
							<div class="phi-media-body">
								Jon Snow
								<br>
								<span class="person-info">knows nothing ({{audience1.length}})</span>
							</div>
							<div class="phi-media-actions"><i class="fa fa-snowflake-o"></i></div>
						</div>
					</div>
				</phi-person-relevance-picker>

				<phi-person-relevance-picker
					:api="app.api"
					v-model="audience2"
					person-id="627"
				>
					<!-- if no content, then fallback to default block -->
				</phi-person-relevance-picker>

				<div class="selected-people">
					<div class="phi-media person" v-for="person in audience1">
						<div class="phi-media-figure phi-avatar">
							<img :src="person.avatar" alt="person.firstname">
						</div>
						<h3 class="phi-media-body">{{ person.firstname }} {{ person.lastname }}</h3>
						<div class="phi-media-right fa fa-times" @click="audience1.splice(audience1.indexOf(person), 1)"></div>
					</div>
				</div>
			</div>


		</div>
	</div>
</template>

<script>
import app from '../store/app.js';
import PhiPersonRelevancePicker from '../components/Phi/Person/Relevance/Picker.vue';
import Picker2 from '../components/Phi/Person/Relevance/Picker2.vue';

export default {
	name: "leo-sandbox",

	components: {
		Picker2,
		PhiPersonRelevancePicker
	},

	data () {
		return {
			app,
			audience1: [],
			audience2: [],
			isLoading: false,

			tpl: {
				isFlipped: false
			},

			activeGroup: null,

			groups: [
				{
					"id": "r0",
					"type": "relatives",
					"name": "Relatives",
					"people": []
				},
				{
					"id": "e1",
					"type": "employee group",
					"name": "Desarrollo",
					"people": []
				},
				{
					"id": "e2",
					"type": "employee group",
					"name": "Comercial",
					"people": []
				},
				{
					"id": "e4",
					"type": "employee group",
					"name": "Administraci\u00f3n",
					"people": []
				},
				{
					"id": "e5",
					"type": "employee group",
					"name": "Consultores Phidias",
					"people": []
				},
				{
					"id": "e6",
					"type": "employee group",
					"name": "PhiPages",
					"people": []
				}
			]
		}
	},

	methods: {
		openGroup(group) {

			/* Dummy de accion asincrona.  Como hacer un fetch de datos  */
			setTimeout(() => {
				this.activeGroup = group;
				this.$set(this.activeGroup, 'members', [1,2,3]);
				this.tpl.isFlipped = true;
			}, 200);

		}
	}
}
</script>

<style scoped lang="scss">
.box {
	position: relative;

	width: 300px;
	height: 400px;
	overflow: hidden;
	overflow-y: auto;

	.front,
	.back {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		overflow-y: auto;

		transition: 0.5s;

		padding: 4px;
	}

	.front {
		border: 2px solid green;
		transform: translateX(0);
	}

	.back {
		border: 2px solid blue;
		transform: translateX(100%);
	}


	/* Caja "volteada" */
	&.flipped {
		.front {
			transform: translateX(-100%);
		}
		.back {
			transform: translateX(0);
		}
	}


	/* Estilos de prueba */
	label {
		display: block;
		font-size: 12px;
		font-weight: bold;
		margin-bottom: 6px;
	}

	.phi-card {
		padding: 6px;
		margin-bottom: 6px;
	}

}
</style>