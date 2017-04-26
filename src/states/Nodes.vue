<template>
	<div class="phi-page">
		<mu-linear-progress color="#1c89b8" v-show="app.api.isLoading" />
		<div class="phi-page-toolbar">
			<h1>{{ $t("Groups") }}</h1>
		</div>
		<div class="phi-page-cover" style="background: transparent"></div>
		<div class="phi-page-contents">
			<div class="phi-card">
                <router-link class="node phi-media" v-for="node in nodes.items" :to="{name: 'node', params:{nodeId: node.id}}">
                    <div class="phi-media-body">
                        <small v-text="node.type"></small>
                        <h1 v-text="node.name"></h1>
                    </div>
                </router-link>
			</div>
		</div>
	</div>
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