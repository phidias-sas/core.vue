<template>
    <div class="phi-page scrollable">
        <div class="phi-page-cover">

			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$router.go(-1)">
					<i class="fa fa-arrow-left"></i>
				</button>
				<h1></h1>
				<a v-if="posts.items[0] && posts.items[0].event"
					:href="`${app.api.host}/calendar/events/${posts.items[0].event.id}/ics`"
				><i class="fa fa-calendar-plus-o"></i></a>
			</div>

            <div class="phi-page-header" v-if="posts.items[0]">
                <h1 v-text="posts.items[0].title"></h1>
            </div>

        </div>

        <div class="phi-page-contents">

            <div v-for="post in posts.items.reverse()"
                class="post"
                :class="{expanded: posts.hasTag(post, 'expanded'), collapsed: !posts.hasTag(post, 'expanded'), read: !isUnread(post), unread: isUnread(post)}"
                @click="!posts.hasTag(post, 'expanded') && posts.tag(post, 'expanded')"
            >

                <div class="post-face phi-media">

                    <div class="phi-media-figure phi-avatar" @click="posts.hasTag(post, 'expanded') && toggleAuthorDetails(post)">
                        <img :src="post.author.avatar" :alt="post.author.firstName">
                        <i class="fa fa-check"></i>
                    </div>

                    <div class="phi-media-body">
                        <div class="post-author" v-text="post.author.firstName" @click.stop="posts.toggleTag(post, 'expanded')"></div>
                        <div class="post-date">{{ moment.unix(post.publishDate).calendar(null, {sameElse: 'MMM D h:mm a'}) }}</div>

                        <div class="post-audience" v-text="$t('to {n} people', {n: post.audienceCount})" @click="toggleAudience(post)"></div>
                        <div class="post-audience-people" v-show="post.audienceIsShown">
                            <div class="phi-chip phi-media" v-for="person in post.people">
                                <div class="phi-media-figure phi-avatar">
                                    <img :src="person.avatar" alt="person.firstName">
                                </div>
                                <div class="phi-media-body">{{person.firstName}} {{person.lastName}}</div>
                            </div>
                        </div>

                        <div class="post-preview" v-text="post.description"></div>
                        <div class="post-attachment-count" v-show="post.blocks.length > 0">
                            <i class="fa fa-paperclip"></i>
                            <span v-text="post.blocks.length"></span>
                        </div>
                    </div>

                </div>

                <div class="post-contents">
                    <div class="post-description" v-text="post.description"></div>

                    <div class="post-quotes" v-if="post.quotes">
                        <div class="post quote phi-media" v-for="quote in post.quotes">
                            <div class="phi-media-figure phi-avatar">
                                <img :src="quote.author.avatar" alt="quote.author.firstName">
                            </div>
                            <div class="phi-media-body">
                                <div class="post-author">{{quote.author.firstName}} {{quote.author.lastName}}</div>
                                <div class="post-date">{{ moment.unix(quote.publishDate).calendar(null, {sameElse: 'MMM D h:mm a'}) }}</div>
                                <div class="post-description">{{quote.description}}</div>
                            </div>
                        </div>
                    </div>

                    <div class="post-blocks">
                        <phi-block
                            v-for="block in post.blocks"
                            :block="block"
                        ></phi-block>
                    </div>

                    <div class="post-actions">
                        <button class="post-trail-handle" @click="toggleTrail(post)" v-if="post.replyTo">···</button>
                        <button class="post-reply-all" @click="openReply(post, true)">Responder a todos</button>
                        <button class="post-reply" @click="openReply(post)">Responder</button>
                    </div>

                    <post-trail v-show="post.trailIsShown" :post="post.objTrail"></post-trail>
                </div>

            </div>

            <div class="reply post expanded" v-show="tpl.replyIsOpen">

				<phi-person-relevance-picker
					:api="app.api"
					:person-id="app.user.id"
					v-model="audience"
				>
				</phi-person-relevance-picker>

                <div class="post-contents">
                    <div class="post-audience-people">
                        <div class="phi-chip phi-media" v-for="person in audience">
                            <div class="phi-media-figure phi-avatar">
                                <img :src="person.avatar" alt="person.firstName">
                            </div>
                            <div class="phi-media-body">{{person.firstname}} {{person.lastname}}</div>
                            <i class="phi-media-right fa fa-times" @click="audience.splice(audience.indexOf(person), 1)"></i>
                        </div>
                    </div>

                    <textarea v-model="reply.description" placeholder="Escribe aqui tu respuesta" @input="saveReply"></textarea>

                    <div class="replyTo post phi-media" v-if="replyTo">
                        <div class="phi-media-figure phi-avatar">
                            <img :src="replyTo.author.avatar" alt="replyTo.author.firstName">
                        </div>
                        <div class="phi-media-body">
                            <div class="post-author">{{ replyTo.author.firstName }}</div>
                            <div class="post-date">{{ moment.unix(replyTo.publishDate).calendar(null, {sameElse: 'MMM D h:mm a'}) }}</div>
                            <div class="post-description">{{ replyTo.description }}</div>
                        </div>
                    </div>

                    <div class="post-blocks">
                        <div v-for="block in reply.blocks" class="phi-media">
                            <div class="phi-media-body">
                                <phi-block :block="block" :action="block.action"></phi-block>
                            </div>
                            <div class="phi-media-right">
                                <i class="fa fa-times" @click="deleteBlock(block)"></i>
                                <i class="fa fa-pencil" @click="$set(block, 'action', 'edit')"></i>
                            </div>
                        </div>
                    </div>

                    <footer>
                        <button class="send" @click="sendReply">{{ $t('send') }}</button>
                        <button class="attach" @click="addFilesBlock">
                            <i class="fa fa-paperclip"></i>
                        </button>
                        <button class="cancel" @click="tpl.replyIsOpen = false">{{ $t('discard') }}</button>
                    </footer>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import app from '../../store/app.js';
import moment from 'moment';

import PhiDrawer from '../../components/Phi/Drawer.vue';
import PhiBlock from '../../components/Phi/Block.vue';
import PhiPersonRelevancePicker from '../../components/Phi/Person/Relevance/Picker.vue';


Vue.component('post-trail', {
    props: ['post'],
    data() {
        return {moment}
    },
    template: `<div class="post post-trail" v-if="post">
                  <div class="post-author">{{ post.author.firstName }} {{ post.author.lastName }}</div>
                  <div class="post-date">{{ moment.unix(post.publishDate).calendar(null, {sameElse: 'MMM D h:mm a'}) }}</div>
                  <div class="post-description">{{ post.description }}</div>
                  <post-trail v-if="post.replyTo" :post="post.replyTo"></post-trail>
              </div>`
});


export default {

    components: {PhiDrawer, PhiBlock, PhiPersonRelevancePicker},

	beforeRouteEnter(to, from, next) {
		var posts = app.api.collection(`/people/${app.user.id}/threads/feed/${to.params.threadId}`)
		posts.fetch()
			.then(() => next(vm => vm.posts = posts))
			.then(() => {
                /* Expand all unread posts and the last post */
                posts.items.forEach(post => !post.stub.readDate && posts.tag(post, 'expanded'));
                posts.tag(posts.items[0], 'expanded');
            });
	},

    data() {
        return {
            app,
            moment,
            posts: app.api.collection(`/people/${app.user.id}/threads/feed/${this.$route.params.threadId}`),
            audience: [],

            reply: {
                replyTo: null,
                description: null
            },
            replyTimer: null,

            tpl: {
                replyIsOpen: false
            }
        }
    },

    mounted() {
        this.scrollToBottom(500);
    },

    computed: {
        replyTo() {
            return this.reply.replyTo ? this.posts.getItem(this.reply.replyTo) : null;
        }
    },

    methods: {
        isUnread(post) {
            return !post.stub.readDate;
        },

        fetchAudience(post) {
            return app.api
                .get(`/posts/${post.id}/stubs`)
                .then(stubs => stubs.map(stub => stub.person));
        },

        toggleAudience(post) {
            if (!post.people) {
                this.fetchAudience(post)
                    .then(people => {
                        this.$set(post, 'people', people);
                        this.$set(post, 'audienceIsShown', true);
                    });
            } else {
                post.audienceIsShown = !post.audienceIsShown;
            }
        },

        toggleTrail(post) {
            if (!post.objTrail) {
                app.api.get(`/posts/${post.id}/trail`)
                    .then(trail => {
                        this.$set(post, 'objTrail', trail);
                        this.$set(post, 'trailIsShown', true);
                    });
            } else {
                post.trailIsShown = !post.trailIsShown;
            }
        },

        toggleAuthorDetails(post) {
            alert("author!");
        },

        openReply(post) {
            // Fetch a fresh draft
            app.api
                .get(`/people/${app.user.id}/posts/drafts`, {
                    type: "mensaje",
                    replyTo: post.id,
                    create: 1
                })
                .then(drafts => {
                    this.reply = drafts[0];

                    setTimeout(() => {
                        this.tpl.replyIsOpen = true;
                        this.$el.querySelector('textarea').focus();
                        this.scrollToBottom(400);
                    }, 0);
                });
        },

        saveReply() {
            if (!this.reply.id) {
                return;
            }

            clearTimeout(this.replyTimer);
            this.replyTimer = setTimeout(() => {
                app.api
                    .put(`/posts/${this.reply.id}`, this.reply)
                    .then(post => this.reply = post);
            }, 600);
        },

        deleteBlock(block) {
            return app.api
                .delete(`/posts/${this.reply.id}/blocks/${block.id}`)
                .then(() => {
                    this.reply.blocks.splice(this.reply.blocks.indexOf(block), 1);
                })
        },

        addFilesBlock() {
            var url = "/posts/" + this.reply.id + "/resources/files/attachments";

            for (var c = 0; c < this.reply.blocks.length; c++) {
                if (this.reply.blocks[c].url == url) {
                    this.$set(this.reply.blocks[c], 'action', 'edit');
                    return;
                }
            }

            this.reply.blocks.push({
                url,
                type: "files",
                action: "edit"
            });
        },

        sendReply() {
            this.reply.audience = {
                to: {
                    people: this.audience.map(person => person.id)
                }
            };

            this.reply.audience.to.people.push(this.replyTo.author.id);

            app.api
                .post(`/people/${app.user.id}/threads/feed/${this.$route.params.threadId}`, this.reply)
                .then(post => {

                    post.stub = {};
                    this.posts.unshift(post);
                    this.posts.tag(post, 'expanded');

                    this.reply = {
                        replyTo: null,
                        description: null
                    }
                    this.tpl.replyIsOpen = false;
                });
        },

        scrollToBottom(delay) {
            if (delay == undefined) {
                delay = 200;
            }

            setTimeout(() => {
                this.$el.scrollTop = this.$el.scrollHeight + this.$el.clientHeight;
            }, delay);
        }
    }
}
</script>



<style lang="scss">
.post-trail {
    font-size: 14px;
    border-left: 2px solid rgba(0, 42, 167, 0.25);
    padding-left: 4px;
    margin-top: 12px;

    .post-author {
        font-weight: bold;
    }

    .post-date {
        font-size: 12px;
        color: #888;
    }

    .post-description {
        white-space: pre-wrap;
    }
}
</style>


<style lang="scss" scoped>

.post-quotes {
    margin: 12px 6px;
    font-size: 0.8em;
    border-left: 2px solid dodgerblue;
    background-color: #f6f6f6;

    .phi-media-figure {
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        max-width: 32px;
        max-height: 32px;
    }
}

.phi-page-cover {
    color: #fff;
	background: #1C89B8 !important;
	background-size: cover;

	.phi-menu {
		color: #333;
	}
}

.phi-page-toolbar {
    background-color: #1C89B8;
}

.post-audience-people {
    display: flex;
    flex-wrap: wrap;
    max-height: 350px;
    overflow-y: auto;
    margin-bottom: 12px;
}

.phi-chip {
    border-radius: 4px;
    background-color: #f2f2f2;
    align-items: center;
    padding: 4px !important;
    margin: 0 5px 5px 0;

    .phi-media-figure {
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        min-height: 24px !important;
    }

    .phi-media-body {
        font-size: 0.9em;
    }

    .phi-media-right {
        cursor: pointer;
        font-weight: bold;
        padding: 0 12px;
        margin-left: 12px;
    }

    .phi-media-right:hover {
        color: darkred;
    }
}

.post {
    position: relative;

    .post-author {
        display: inline;
        font-weight: bold;
    }

    .post-date {
        display: inline;
        color: #999;
        font-size: 13px;
    }

    .post-audience {
        margin-top: 3px;
        color: #777;
        font-size: 0.8em;
    }

    .post-attachment-count {
        color: #777;
        font-size: 0.8em;
    }

    .post-description {
        white-space: pre-wrap;
    }

    .post-preview {
        font-size: 0.9em;
    }

    .post-contents {
        padding: 12px;
        padding-top: 0;
    }

    .post-actions {
        margin-top: 24px;
        text-align: right;

        button {
            border: none;
            color: #333;
            border-radius: 3px;
            background-color: #f0f0f0;
            padding: 6px 12px;
        }

        .post-trail-handle {
            float: left;
            background-color: #f8f8f8;
            font-weight: bold;
        }
    }

    &.expanded {
        background: #fff;
        border-bottom: 1px solid #f3f3f3;

        .post-preview,
        .post-attachment-count {
            display: none;
        }
    }

    &.collapsed {
        opacity: 0.85;

        .post-audience,
        .post-audience-people,
        .post-date,
        .post-contents {
            display: none;
        }
    }

}

.reply {
    .replyTo {
        font-size: 0.8em;
        border-left: 3px solid dodgerblue;
    }

    textarea {
        width: 100%;
        min-height: 80px;
        font-size: 1em;
    }

    footer {
        margin: 16px 0 8px 0;
    }

    .cancel {
        float: right;
    }
}

</style>