 <template>
 	<div id="Sanchez">
 		<h1 @click="changeFuntion()">Hello world</h1>
 		<span>{{titulo}}</span>
 		<button @click="changeFunction()">change function</button>
 	</div>
 </template>
 <script>
 	export default{
 		data(){
 			return {
 				titulo: "it is a tittle"
 			}
 		},

 		methods: {
 			changeFunction(){
 				this.titulo= "other tittle"
 			}
 		}
 	}
 </script>

<style lang="scss">
 	#sanchez {
 		border: 3px solid red;
 		padding: 20px;
 	}
</style>