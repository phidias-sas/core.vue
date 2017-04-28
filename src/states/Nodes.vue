<template>
	<phi-page :loading="app.api.isLoading">
		<div slot="toolbar">
			<h1>{{ $t("Groups") }}</h1>
		</div>

		<div>
			<div class="phi-card">
                <router-link class="node phi-media" v-for="node in nodes.items" :to="{name: 'node', params:{nodeId: node.id}}">
                    <div class="phi-media-body">
                        <small v-text="node.type"></small>
                        <h1 v-text="node.name"></h1>
                    </div>
                </router-link>
			</div>
		</div>
	</phi-page>
</template>

<script>
import app from '../store/app.js'

export default {
	name: "nodes",

	data() {
		return {
			app,
            nodes: app.api.collection(`/people/${app.user.id}/nodes`)
		}
	},

	created() {
        this.nodes.fetch();
	}
}
</script>

<style lang="scss" scoped>
.node {
	small {
		color: #777;
	}
}
</style>