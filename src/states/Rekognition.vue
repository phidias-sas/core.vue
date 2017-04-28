<template>
	<div class="phi-page">
		<h1>Por favor mire directo a la camara y asegurese de que todo su rostro sea visible</h1>
		<div id="stream-container">
			<video id="camera-preview" autoplay="true"></video>
			<canvas id="picture-canvas"></canvas>
		</div>
		<h1 id="greeting-text"></h1>	
	</div>
</template>

<script>
import app from '../store/app.js';
import AWS from 'aws-sdk';

export default {
	name: "leo-sandbox-reko",

	components: {},

	data () {
		return {
			app,
			rekognition: null,
			pictureTimer: null,
			processing: false
		}
	},

	methods: {
		getNameByFaceId(faceId){	
			switch(faceId){
				case "082352":
				case "082356":
				case "082400":
					return "Claudia Giraldo"
				break;

				case "082405":
				case "082407":
				case "082411":
					return "Felipe Delgado"
				break;

				case "082417":
				case "082422":
				case "082425":
					return "Jose Valencia (creo)"
				break;

				case "082449":
				case "082454":
				case "082458":
					return "Ivan Lozada"
				break;

				case "082511":
				case "082516":
				case "082520":
					return "Jennifer Agudelo (creo)"
				break;

				case "082528":
				case "082534":
				case "082539":
					return "Mauricio Galeano"
				break;

				case "082607":
				case "082611":
				case "082621":
					return "Santiago Cortes"
				break;

				case "135242":
				case "135158":
				case "135203":
					return "Leonardo Beltrán"
				break;

				default:
					return "Desconocido"
			}
		},

		takePicture(canvas, video){
			this.processing = true;
                
			let ctx = canvas.getContext('2d');
			ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);  

			canvas.toBlob( blob => {
				let arrayBuffer;
				let fileReader = new FileReader();
				
				fileReader.onload = reader => {

						var params = {
						CollectionId: "frtest", 
						FaceMatchThreshold: 95, 
						Image:{
							Bytes: reader.target.result
						}, 
						MaxFaces: 1
					};
					
					this.rekognition.searchFacesByImage(params, (err, data) => {
						if (!err){ 
							if(data.FaceMatches.length > 0){
								this.sayHello(this.getNameByFaceId(data.FaceMatches[0].Face.ExternalImageId));
							}else{
								this.clearHello();
								console.log("no he detectado un rostro conocido");
							}
						}else{
							this.clearHello();
							console.log("no veo ningun rostro");
						}

						this.processing = false;
					});
				};
				fileReader.readAsArrayBuffer(blob);

			},'image/jpeg', 0.95);
		},

		sayHello(name){
			let greetingText = this.$el.querySelector('#greeting-text');   
			greetingText.innerHTML = "Hola " + name; 
		},

		clearHello(){
			let greetingText = this.$el.querySelector('#greeting-text');   
			greetingText.innerHTML = ""; 
		}	
	},
	

	mounted (){
		if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: true })
			.then( localMediaStream => {
				let videoElem = this.$el.querySelector('#camera-preview');
				let pictureElem = this.$el.querySelector('#picture-canvas');
				
				videoElem.src = window.URL.createObjectURL(localMediaStream);
				videoElem.onloadedmetadata = evt => {
					pictureElem.width = evt.target.offsetWidth;
					pictureElem.height = evt.target.offsetHeight;
					
					this.pictureTimer = window.setInterval( () => {
						if(!this.processing){
							this.takePicture(pictureElem, videoElem); 
						}
					}, 200)
				};
			});
		}
	},

	created () {
		this.rekognition = null;

		this.pictureTimer = null;
		this.processing = false;	
    }
}
</script>

<style scoped lang="scss">
#picture-canvas{
	visibility: hidden;
	display: none;
}

#stream-container{
	width: 100%;
	text-align: center;
}
</style>