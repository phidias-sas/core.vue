<template>
	<div class="phi-slider-pannel">
		<div class="modal-mask" @click="closePannel()"></div>
		<div class="slider-pannel"
			v-bind:style="styleConfiguration"
			v-bind:class="{ open: open }"
		>
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
    name: "phi-slider-pannel",

	data() {
        return {
			panel: null,
			modalMask: null,
			portraitW: "85vw",
			landscapeW: "40vw"
		}
    },

	props: {
		open: {
			type: Boolean,
			required: false,
			default: false
		},

		side: {
			type: String,
			required: false,
			default: "left",
			validator: value => ["left", "right"].indexOf(value) >= 0
		},

		backgroundColor: {
			type: String,
			required: false,
			default: "#F3F3F3"
		}
	},

	computed:{
		styleConfiguration: function () {
			return {
				width: this.width,
				left: this.side === "left" ? "-"+this.width : "100vw",
				backgroundColor: this.backgroundColor
			}
		},

		width: function () {
			let w = this.portraitW;
			if(window.screen.width > window.screen.height){
				w = this.landscapeW;
			}

			return w;
		}
	},

	watch: {
		open: function(isOpen) {
			isOpen ? this.openPannel() : this.closePannel();
		}
	},

	methods: {
		openPannel(){
			this.pannel.classList.add("open");
			this.modalMask.classList.add("open");

			if(this.side === "left"){
				this.pannel.style.setProperty('--width-to-hide', this.width);
			}else{
				this.pannel.style.setProperty('--width-to-hide', "-" + this.width);
			}

			this.pannel.scrollTop = 0;

			this.$emit("opened", true);
		},

		closePannel(){
			this.pannel.classList.remove("open");
			this.modalMask.classList.remove("open");

			if(this.side === "left"){
				this.pannel.style.setProperty('--width-to-hide', this.width);
			}else{
				this.pannel.style.setProperty('--width-to-hide', "-" + this.width);
			}

			this.$emit("closed", true);
		},

		addGlobalEvents(){
			//lets try to deal with screen orientation :s
			window.addEventListener("resize", (e) => {
				let pannel = this.$el.querySelector(".slider-pannel");
				let newW = null;

				if(window.screen.width > window.screen.height){
					newW = this.landscapeW;
				}else{
					newW = this.portraitW;
				}

				pannel.style.setProperty("width", newW);

				if(this.side === "left"){
					pannel.style.setProperty('--width-to-hide', newW);
				}else{
					pannel.style.setProperty('--width-to-hide', "-" + newW);
				}
			});
		}
	},

    mounted () {
		this.pannel = this.$el.querySelector(".slider-pannel");
		this.modalMask = this.$el.querySelector(".modal-mask");

		this.addGlobalEvents();
    }
}

</script>

<style scoped>
.modal-mask{
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	/* background-color: rgba(0,0,0,0.6); */
	visibility:hidden;
	display: none;
}

.modal-mask.open{
	visibility: visible;
	display: block;
}

.slider-pannel {
	height: 100vh;
    position: fixed;
    z-index: 9;
    top: 0;
    overflow-x: hidden;
    transition: 0.5s;
    padding-top: 30px;
}

.slider-pannel.open{
	--width-to-hide: 0vw;
	transform: translateX(var(--width-to-hide));
}
</style>