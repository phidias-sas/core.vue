<template>
	<div class="phi-page" id="compose">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$router.go(-1)"> <i class="fa fa-arrow-left"></i></button>
				<h1>{{ $t('Compose {type}', {type: post.type.singular}) }}</h1>
				<button class="phi-button" @click="send"> <i class="fa fa-paper-plane"></i></button>
			</div>
			<div class="phi-page-header">
				<phi-input label="Título" v-model="post.title" @input="save()"></phi-input>
			</div>
		</div>
		<div class="phi-page-contents">
			<div v-if="post.id" class="post">

                <!-- lista de destinatarios -->
				<div class="audience">
                    <label>{{ $t('To') }}:</label>
                    <div class="post-audience-people">
                        <div class="phi-chip phi-media" v-for="person in sanitizedAudience">
                            <div class="phi-media-figure phi-avatar">
                                <img :src="person.avatar" alt="person.firstName">
                            </div>
                            <div class="phi-media-body">{{person.firstName}} {{person.lastName}}</div>
                            <i class="phi-media-right fa fa-times" @click="audience.splice(audience.indexOf(person), 1)"></i>
                        </div>

                        <phi-person-relevance-picker
                            :api="app.api"
                            :person-id="app.user.id"
                            v-model="audience"
                        >
                            <div class="phi-chip phi-media adder">
                                <div class="phi-media-body">...</div>
                                <i class="phi-media-right fa fa-plus"></i>
                            </div>
                        </phi-person-relevance-picker>
                    </div>
				</div>

				<textarea v-model="post.description" @input="save()"></textarea>
				<phi-post-editor :post="post"></phi-post-editor>
			</div>
		</div>
	</div>
</template>

<script>
import app from '../../store/app.js';
import PhiInput from '../../components/Phi/Input.vue';
import PhiPostEditor from '../../components/Phi/Post/Editor.vue';
import PhiPersonRelevancePicker from '../../components/Phi/Person/Relevance/Picker.vue';

export default {
	components: {PhiInput, PhiPostEditor, PhiPersonRelevancePicker},
	data() {
		return {
			app,
			nodeId: this.$route.params.nodeId,
			postId: this.$route.params.postId,

			post: {
				title: null,
				description: null
			},

			audience: []
		}
	},

	methods: {
		fetch() {
			return app.api.get(`posts/${this.postId}`)
				.then(post => this.post = post);
		},

		save() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
				app.api.put(`posts/${this.postId}`, this.post);
            }, 500);
		},

		send() {
			if (!this.audience.length) {
				return alert(this.$t('no people seleted'));
			}

			this.post.audience = {
				to: {
					people: this.audience.map(person => String(person.id))
				}
			};

			app.api
				.post(`people/${app.user.id}/posts/sent`, this.post)
				.then(() => this.$router.go(-1));
		}
	},

	mounted() {
		this.fetch()
			.then(() => {
				if (!this.post.title) {
					this.$el.querySelector("input").focus();
				}
			});
	},

    computed: {
        sanitizedAudience() {
            return this.audience.map(person => {
                if (typeof person.firstname != 'undefined') {
                    this.$set(person, 'firstName', person.firstname);
                    this.$set(person, 'lastName', person.lastname);
                }
                return person;
            });
        }
    }
}
</script>

<style scoped lang="scss">
textarea {
	border: 0;
	margin-bottom: 24px;
}
</style>

<style lang="scss">
#compose {

	.post {
		max-width: 768px;
	}

	.phi-page-toolbar {
		color: #fff;
	}

	.phi-page-cover {
		background-color: #1C89B8;

		.phi-page-header {
			padding-top: 48px;
		}

		.phi-input {
			font-size: 1.8em;
			font-weight: 300;

			display: block;
			width: 100%;
			color: #fff;

			/* Highlight colors (label and underline) */
			&::after {
				border-color: rgba(255, 255, 255, 0.3);
			}
			&._dirty label,
			&._focused label {
				color: #fff;
			}
		}

	}

	textarea {
		display: block;

		width: 100%;
		min-height: 130px;

		font-size: 1.2em;
		font-weight: 300;
	}

	.audience {
		label {
			font-size: 14px;
			color: #666;
		}
	}
}
</style>