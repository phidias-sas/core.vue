<template>
	<component
		class="phi-block"
		:is="'phi-block-' + block.type"
		:post="post"
		:block="block"
		:action="action"
		@change="change()"
		@destroy="destroy()"
		@reset="reset()">
	</component>
</template>

<script>
/* Declare all components */
import Files from './Block/Files.vue';
import Form from './Block/Form.vue';
import Html from './Block/Html.vue';
import Image from './Block/Image.vue';
import V3 from './Block/V3.vue';
import Youtube from './Block/Youtube.vue';

var types = {
	files:   Files,
	form:    Form,
	html:    Html,
	image:   Image,
	v3:      V3,
	youtube: Youtube
}

var components = {};
for (var type in types) {
	components["phi-block-" + type] = types[type];
}

export default {
	name: "phi-block",
	components,
	props: {
		block: {
			type: Object,
			required: true
		},

		post: {
			type: Object
		},

		action: {
			type: String
		}
	},

	methods: {
		change() {
			this.$emit("change", this.block);
		},

		destroy() {
			this.$emit("destroy", this.block);
		},

		reset() {
			this.$emit("reset", this.block);
		}
	},

	getActions(type) {
		if ((typeof types[type] == "undefined") || (typeof types[type]['phi-actions'] == "undefined")) {
			return {};
		}
		return types[type]['phi-actions'];
	}
}
</script>