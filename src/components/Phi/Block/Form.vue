<template>
    <div class="phi-block-form">
        <template v-if="!action">

            <div class="entity phi-card _z-0 _padded">
                <h3 v-text="form.description"></h3>

                <div class="records" v-if="records.length">
                    <div class="record" v-for="record in records">

                        <div class="fields">
                            <div class="field" v-for="field in form.fields">
                                <label v-text="field.title"></label>

                                <div v-if="field.type == 'checkbox'" class="value" v-text="record.values[field.name] ? 'Si' : 'No'"></div>
                                <div v-if="field.type != 'checkbox'" class="value" v-text="record.values[field.name]"></div>

                            </div>
                        </div>

                    </div>
                </div>

                <div class="form" v-if="!records.length">

                    <div class="fields">
                        <div class="field" v-for="field in form.fields">
                            <div v-if="field.type == 'text'">
                                <label v-text="field.title"></label>
                                <input type="text" v-model="newRecord[field.name]">
                            </div>
                            <div v-if="field.type == 'textarea'">
                                <label v-text="field.title"></label>
                                <textarea v-model="newRecord[field.name]"></textarea>
                            </div>
                            <div v-if="field.type == 'select'">
                                <label v-text="field.title"></label>
                                <select v-model="newRecord[field.name]">
                                    <option v-for="option in getOptions(field)" v-text="option"></option>
                                </select>
                            </div>
                            <div v-if="field.type == 'checkbox'">
                                <label :for="'chbox-' + field.id" v-text="field.title"></label>
                                <input :id="'chbox-' + field.id" type="checkbox" v-model="newRecord[field.name]">
                            </div>
                            <span class="description" v-text="field.description"></span>
                        </div>
                    </div>

                    <button class="phi-button" @click="saveRecord()">Guardar</button>

                </div>

            </div>


        </template>

        <template v-if="action == 'edit'">
            <!-- !!! 2DO: Editor de formularios -->
        </template>

        <template v-if="action == 'delete'">
            <h1>Eliminar este formulario ?</h1>
            <button class="phi-button danger" @click="destroy()">Eliminar</button>
            <button class="phi-button cancel" @click="$emit('reset')">Cancelar</button>
        </template>
    </div>
</template>

<script>
import app from '../../../store/app.js';

export default {
    name: "phi-block-form",

    props: ["block", "action"],

    'phi-actions': {
        edit: {
            title: "editar"
        },
        delete: {
            title: "eliminar"
        }
    },

    data() {
        return {
            user: app.user,
            form: {},
            records: [],
            newRecord: {},
            recordsUrl: null
        }
    },

    created() {
        if (this.block.url) {
            this.reload();
        }
    },

    methods: {
        reload() {
            app.api.get(this.block.url)
                .then(response => {
                    this.form = response;
                    this.resetNewRecord();

                    /* Get existing records */
                    if (this.user && this.user.id) {
                        this.recordsUrl = `people/${this.user.id}/data/entities/${this.form.id}/records`;
                        app.api.get(this.recordsUrl)
                            .then(records => this.records = records);
                    }
                });
        },

        destroy() {
            app.api.delete(this.block.url);
            this.$emit("destroy"); // don't wait for api response. just destroy the block
        },

        getOptions(field) {
            return field.options.split("\n");
        },

        saveRecord() {
            if (!this.recordsUrl) {
                return;
            }

            app.api.post(this.recordsUrl, this.newRecord)
                .then(createdRecord => {
                    this.records.push(createdRecord);
                    this.resetNewRecord();
                });
        },

        /* Set newRecord properties for VUE to track */
        resetNewRecord() {
            this.newRecord = {};
            this.form.fields.forEach(field => this.$set(this.newRecord, field.name, null));
        }
    }
}
</script>

<style lang="scss" scoped>

.entity {

    & > h3 {
        color: #333;
        margin-bottom: 1em;
    }


    .field {
        margin: 0 0 1em 0;

        .description {
            font-size: 0.7em;
            color: #666;
        }

        label {
            display: block;
            font-size: 0.9em;
            color: #444;
        }
    }


    .form .field {
        margin: 0 0 48px 0;
    }
}

</style>