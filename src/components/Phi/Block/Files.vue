<template>
    <div class="phi-block-files">

        <a v-for="file in files" class="phi-card file" :href="file.url" target="_blank" rel="noopener" :title="file.title">
            <div class="preview">
                <img v-if="file.thumbnail" :src="file.thumbnail" :alt="file.title">
                <audio v-if="file.mimetype == 'audio/x-m4a'" controls preload="none">
                    <source :src="file.url" type="audio/mp4" />
                </audio>
            </div>

            <div class="description">
                <h1 v-text="file.title"></h1>
                <p>{{ file.size | bytes}}</p>
            </div>

            <div class="actions" v-if="action == 'edit'">
                <a @click.prevent="remove(file)">
                    <i class="fa fa-trash"></i>
                </a>
            </div>
        </a>

        <template v-if="action == 'edit' && fullUrl">
            <dropzone :url="fullUrl" @success="success(arguments[0], arguments[1])" class="dropzone">
                <h1>Toca aqui para subir archivos</h1>
                <!--
				<p class="dz-message-idle">Arrastra archivos aquí o haz click</p>
				<p class="dz-message-hover">Sueltalos aquí</p>
                -->
            </dropzone>
        </template>
    </div>
</template>

<script>
import Dropzone from '../../Dropzone/Dropzone.vue';
import app from '../../../store/app.js';

export default {
    name: "phi-block-files",
    components: {Dropzone},
    props: ["post", "block", "action"],

    'phi-actions': {
        default: {
            title: "ver archivos"
        },

        edit: {
            title: "modificar archivos"
        }
    },

    data() {
        return {
			files:   [],
			fullUrl: null
        }
    },

    methods: {

		/* The response from the API is an array of uploaded files */
		success(file, response) {
			this.files = response.concat(this.files);
		},

        reload() {
			app.api.get(this.block.url)
				.then(files => this.files = files);
        },

        remove(file) {
            this.files.splice(this.files.indexOf(file), 1);
            app.api.delete(file.endpoint + "/" + file.path)
                .then(() => {
                    this.$emit("change");
                });
        }
    },

    created() {
        if (!this.block.url) {
            var random     = Math.floor((Math.random() * 100000) + 1);
            this.block.url = `posts/${this.post.id}/resources/files/block-` + random;
            this.$emit("change");
        }

        this.fullUrl = app.api.host + "/" + this.block.url;

        this.reload();
    }
}
</script>

<style scoped lang="scss">


.phi-block-files {

    display: flex;
    flex-wrap: wrap;

    .file {
        background-color: #f6f6f6;
        margin: 0 1em 1em 0;
        padding: 8px;

        .preview {
            width: 100px;
            height: 100px;
            overflow: hidden;
            margin: auto;

            & > * {
                width: 100%;
            }
        }

        .description {
            margin-top: 12px;

            h1 {
                font-size: 1em;
                max-width: 120px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            p {
                font-size: 12px;
                color: #666;
            }
        }

        .actions {
            color: #777;
            margin-top: 6px;
            text-align: right;
            padding: 3px 6px;
        }

    }

    .phi-media-figure {
        white-space: nowrap;
        width: 80px;

        p {
            margin: 0;
            padding-top: 5px;
            text-align: center;
            font-size: 0.8em;
            font-weight: 300;
        }
    }

    .dropzone {
        border: 3px dotted #ccc;
        width: 100%;
    }

}
</style>