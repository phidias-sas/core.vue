<template>
	<div class="phi-drawer" :class="{open: open, closed: !open}">
        <slot></slot>
	</div>
</template>

<script>
import Velocity from 'velocity-animate';

export default {
    name: "phi-drawer",

	props: {
		open: Boolean,
		slideDown: {
			default: {
				duration: 640,
				easing: [500, 20]
			}
		},

		slideUp: {
			default: {
				duration: 420,
				easing: [.42, 0, 0.2, 1]
			}
		}
	},

	methods: {
		toggle(isVisible) {
			if (isVisible) {
				Velocity(this.$el, "slideDown", this.slideDown);
			} else {
				Velocity(this.$el, "slideUp", this.slideUp);
			}
		}
	},

    mounted() {
        this.$el.style.display = this.open ? "block" : "none";
    },

    watch: {
        open() {
            this.toggle(this.open);
        }
    }
}

</script>

<style scoped lang="scss">
.phi-drawer {

}
</style>