<template>
	<div class="phi-person-inscriptions">

		<div v-for="role in roles" class="role">
			<div v-if="role.role">
				<label>{{role.role.singular}} en</label>
				<ul>
					<li v-for="node in role.nodes">{{ node.name }}</li>
				</ul>
			</div>

			<div v-if="role.relation">
				<label>{{role.relation}} de</label>
				<ul>
					<li v-for="relative in role.relatives">
						{{relative.person.firstname}} {{relative.person.lastname}}
						<span v-if="relative.node">{{relative.node.name}}</span>
					</li>
				</ul>
			</div>
		</div>

		<span v-show="!roles.length">No hay informacion disponible</span>

	</div>
</template>

<script>
import app from '../../../store/app.js';

export default {
	name: "phi-person-inscriptions",
	props: ["person", "node"],

	data() {
		return {
			roles: []
		}
	},

	methods: {
		fetch() {
			// app.api.get(`nodes/${this.node}/people/${this.person.id}/roles`)
			app.api.get(`v3/people/${this.person.id}/roles`)
				.then(roles => {
					this.roles = roles;
					setTimeout(() => this.$emit("ready"), 100); // give the dom time to update :(
				});
		}
	},

	mounted() {
		this.fetch();
	}

}

</script>

<style scoped lang="scss">
.phi-person-inscriptions {

	.role > div {
		margin: 0.5em 0;
	}

	label {
		display: block;
		font-size: 11px;
		color: #777;
		margin-bottom: 3px;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;

		li {
			display: inline-block;
			margin: 3px;
			padding: 4px 8px;
			border-radius: 4px;
			background: rgba(0, 0, 0, 0.06);
		}
	}

}
</style>