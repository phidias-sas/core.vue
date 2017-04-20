<template>
    <div class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
				<h1>{{ $t("Checkpoints") }}</h1>
			</div>
		</div>

        <div class="phi-page-contents">

            <div class="phi-card">

                <router-link v-for="point in checkpoints.items" :to="{name: 'attendance-checkpoint', params: {nodeId: point.id}, query:{title: point.name} }">
                    <div class="phi-media">
                        <div class="phi-media-body">{{ point.name }}</div>
                    </div>
                </router-link>

                <phi-drawer :open="tpl.drawerIsOpen">

                    <fieldset>
                        <phi-input v-model="newNode.name" :label="$t('name')"></phi-input>
                    </fieldset>

                    <footer>
                        <div class="phi-media save" @click="createCheckpoint">
                            <i class="phi-media-figure fa fa-check"></i>
                            <div class="phi-media-body">{{ $t('save') }}</div>
                        </div>

                        <div class="phi-media cancel" @click="tpl.drawerIsOpen = false">
                            <i class="phi-media-figure fa fa-times"></i>
                            <div class="phi-media-body">{{ $t('cancel') }}</div>
                        </div>
                    </footer>

                </phi-drawer>

                <phi-drawer :open="!tpl.drawerIsOpen">
                    <div class="phi-media" @click="tpl.drawerIsOpen = true">
                        <i class="phi-media-figure fa fa-plus"></i>
                        <div class="phi-media-body">{{ $t('add checkpoint') }}</div>
                    </div>
                </phi-drawer>

            </div>

        </div>
    </div>
</template>

<script>
import app from '../../store/app.js';
import PhiDrawer from '../../components/Phi/Drawer.vue';
import PhiInput from '../../components/Phi/Input.vue';

export default {

    components: {PhiDrawer, PhiInput},

    data() {
        return {
            checkpoints: app.api.collection('/attendance/checkpoints'),
            newNode: {
                name: ''
            },
            tpl: {
                drawerIsOpen: false
            }
        }
    },

    methods: {
        createCheckpoint() {
            app.api
                .post('/attendance/checkpoints', this.newNode)
                .then(createdNode => {
                    this.checkpoints.push(createdNode);
                    this.tpl.drawerIsOpen = false;
                });
        }
    },

    mounted() {
        this.checkpoints.fetch();
    }
}
</script>

<style lang="scss" scoped>
footer {
    display: flex;

    .save {
        .phi-media-figure {
            color: green;
        }
    }

    .cancel {
        margin-left: 50px;
        .phi-media-figure {
            color: red;
        }
    }
}

fieldset {
    margin: 0;
    padding: 20px 16px;
    border: 0;

    .phi-input {
        display: block;
    }
}

i.phi-media-figure {
    text-align: center;
    align-self: center;
}
</style>