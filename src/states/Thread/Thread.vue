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

                <div v-if="posts.items[0].event" class="phi-post-event">
                    <i class="fa fa-calendar-o"></i>
                    <span v-if="posts.items[0].event.allDay == '1'">
                        {{ moment.unix(posts.items[0].event.startDate).format('LL') }}
                    </span>
                    <span v-if="posts.items[0].event.allDay != '1'">
                        <span>{{ moment.unix(posts.items[0].event.startDate).format('LL h:mm a') }}</span>
                        <span v-if="posts.items[0].event.startDate != posts.items[0].event.endDate"> - {{ moment.unix(posts.items[0].event.endDate).format('h:mm a') }}</span>
                    </span>
                </div>
            </div>

        </div>



        <div class="phi-page-contents">

            <div v-for="post in posts.items.reverse()"
                class="post"
                :class="{expanded: posts.hasTag(post, 'expanded'), collapsed: !posts.hasTag(post, 'expanded'), read: !isUnread(post), unread: isUnread(post)}"
                @click="!posts.hasTag(post, 'expanded') && posts.tag(post, 'expanded')"
            >

                <div class="post-face phi-media">

                    <div class="phi-media-figure phi-avatar" @click="posts.hasTag(post, 'expanded') && togglePersonDetails(post.author)">
                        <img :src="post.author.avatar" :alt="post.author.firstName">
                        <i class="fa fa-check"></i>
                    </div>

                    <div class="phi-media-body">
                        <div class="post-author" v-text="post.author.firstName" @click.stop="posts.toggleTag(post, 'expanded')"></div>
                        <div class="post-date">{{ moment.unix(post.publishDate).calendar(null, {sameElse: 'MMM D h:mm a'}) }}</div>
                        <div class="post-audience" v-if="allowed(post, 'audience')" v-text="$t('to {n} people', {n: post.audienceCount})" @click="toggleAudience(post)"></div>
                        <div class="post-preview" v-text="post.description"></div>
                        <div class="post-attachment-count" v-show="post.blocks.length > 0">
                            <i class="fa fa-paperclip"></i>
                        </div>
                    </div>

                </div>

                <div class="post-contents">
                    <div class="post-audience-people" v-show="post.audienceIsShown">
                        <div class="phi-chip phi-media" v-for="person in post.people" @click="post.author.id == app.user.id && togglePersonDetails(person)">
                            <div class="phi-media-figure phi-avatar">
                                <img :src="person.avatar" alt="person.firstName">
                            </div>
                            <div class="phi-media-body">{{person.firstName}} {{person.lastName}}</div>
                        </div>
                    </div>

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

                    <div v-if="allowed(post, 'trail')">
                        <button class="post-trail-handle" @click="toggleTrail(post)">···</button>
                        <post-trail v-show="post.trailIsShown" :post="post.objTrail"></post-trail>
                    </div>

                    <div class="post-blocks">
                        <phi-block
                            v-for="block in post.blocks"
                            :block="block"
                        ></phi-block>
                    </div>

                    <div class="post-actions">
                        <button v-if="allowed(post, 'reply')"    class="post-reply"        @click="openReply(post)">{{ $t('reply') }}</button>
                        <button v-if="allowed(post, 'replyAll')" class="post-reply-all"    @click="openReply(post, true)">{{ $t('reply to all') }}</button>
                    </div>

                </div>

            </div>

            <div class="reply post expanded" v-show="tpl.replyIsOpen">

                <div class="post-contents">

                    <!-- lista de destinatarios -->
                    <label>Para:</label>
                    <div class="post-audience-people">
                        <div class="phi-chip phi-media" v-for="person in sanitizedAudience">
                            <div class="phi-media-figure phi-avatar">
                                <img :src="person.avatar" alt="person.firstName">
                            </div>
                            <div class="phi-media-body">{{person.firstName}} {{person.lastName}}</div>
                            <i class="phi-media-right fa fa-times" @click="audience.splice(audience.indexOf(person), 1)"></i>
                        </div>

                        <phi-person-relevance-picker
                            v-if="reply.replyTo && allowed(posts.getItem(reply.replyTo), 'invites')"
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

                    <textarea v-model="reply.description" @input="saveReply"></textarea>

                    <!-- reply trail -->
                    <button class="post-trail-handle" @click="toggleTrail(reply)">···</button>
                    <post-trail v-show="reply.trailIsShown" :post="reply.objTrail"></post-trail>

                    <!-- reply blocks -->
                    <div class="post-blocks">
                        <div v-for="block in reply.blocks" class="phi-media">
                            <div class="phi-media-body">
                                <phi-block :block="block" :action="block.type == 'files' ? 'edit' : null"></phi-block>
                            </div>
                        </div>
                    </div>

                    <footer>
                        <button class="cancel" @click="tpl.replyIsOpen = false">
                            <i class="fa fa-trash"></i>
                        </button>
                        <button class="attach" @click="addFilesBlock">
                            <i class="fa fa-paperclip"></i>
                        </button>
                        <button class="send phi-button" @click="sendReply">
                            {{ $t('send') }}
                        </button>
                    </footer>
                </div>
            </div>
        </div>


        <phi-slider-panel side="right" :open="currentPerson != null" @closed="currentPerson = null">
            <div class="authorinfo" v-if="currentPerson != null">
                <div class="cover">
                    <div class="avatar">
                        <img :src="currentPerson.avatar" :alt="currentPerson.firstName">
                    </div>
                    <h1>{{currentPerson.firstName}} {{currentPerson.lastName}}</h1>
                </div>
                <div class="contents">
                    <div class="roles">
                        <div class="role" v-for="role in currentPerson.roles">

                            <div v-if="role.role">
                                <label>{{ $t(role.role.singular) }}</label>
                                <ul>
                                    <li v-for="node in role.nodes">{{ node.name }}</li>
                                </ul>
                            </div>

                            <div v-if="role.relation">
                                <label>{{ $t(role.relation) }}</label>
                                <ul>
                                    <li v-for="relative in role.relatives">
                                        <span>{{ relative.person.firstname }} {{ relative.person.lastname }}</span>
                                        <span v-if="relative.node">({{ relative.node.name }})</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </phi-slider-panel>

    </div>
</template>

<script>
import Vue from 'vue';
import app from '../../store/app.js';
import moment from 'moment';

import PhiDrawer from '../../components/Phi/Drawer.vue';
import PhiBlock from '../../components/Phi/Block.vue';
import PhiPersonRelevancePicker from '../../components/Phi/Person/Relevance/Picker.vue';
import PhiSliderPanel from '../../components/Phi/SliderPannel.vue';

import StayDown from '../../libraries/staydown.js';

var destroyListener;
var stayDownScroller;

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


/* Recursive equivalent of Object.assign */
var deepObjectAssign = function(target, source) {
	if (typeof target != 'object' || target == null) {   // JavaScript typeof null returns "object" :(
		return source;
	}

	for (var prop in source) {
		if (source.hasOwnProperty(prop)) {
			if (typeof source[prop] === 'object') {
				target[prop] = deepObjectAssign(target[prop], source[prop]);
			} else {
				target[prop] = source[prop];
			}
		}
	};

	return target;
};

export default {

    components: {PhiDrawer, PhiBlock, PhiPersonRelevancePicker, PhiSliderPanel},

    mounted() {
		/* stayDown */
		stayDownScroller = new StayDown({
			target: this.$el
		});

		destroyListener = app.on("notification", stub => {
			if (stub.post.thread2 == this.$route.params.threadId) {
                var incomingPost = stub.post;
                incomingPost.stub = {
                    readDate: stub.readDate
                };

                this.posts.untag(this.posts.items, 'expanded'); // collapse all posts
				this.posts.unshift(incomingPost);
                this.posts.tag(incomingPost, 'expanded');
			}
		});
    },

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

	beforeRouteLeave(to, from, next) {
		stayDownScroller.destroy();
		destroyListener();
		next();
	},

    data() {
        return {
            app,
            moment,
            posts: app.api.collection(`/people/${app.user.id}/threads/feed/${this.$route.params.threadId}`),
            reply: {
                replyTo:     null,
                description: null,
                settings:    null
            },
            audience: [],
            replyTimer: null,
            tpl: {
                replyIsOpen:       false,
                replyTrailIsOpen:  false
            },
            authors: [],
            currentPerson: null
        }
    },

    computed: {
        replyTo() {
            return this.reply.replyTo ? this.posts.getItem(this.reply.replyTo) : null;
        },

        sanitizedAudience() {
            return this.audience.map(person => {
                if (typeof person.firstname != 'undefined') {
                    this.$set(person, 'firstName', person.firstname);
                    this.$set(person, 'lastName', person.lastname);
                }
                return person;
            });
        },
    },

    methods: {
        allowed(post, action) {

            if (post == null) {
                return false;
            }

            var defaultSettings = {
                allowed: {
                    "reply":    false,
                    "replyAll": false,
                    "audience": false,
                    "trail":    true,
                    "invites":  true
                }
            };

            var settings = post.settings == null ? defaultSettings : Object.assign({}, post.settings);
            settings = deepObjectAssign(defaultSettings, settings);

            switch (action) {
                case 'reply':
                    return post.author.id != app.user.id && settings.allowed.reply;

                case 'replyAll':
                    return post.author.id != app.user.id && post.audienceCount > 1 && settings.allowed.replyAll;

                case 'audience':
                    return (post.author.id == app.user.id) || (post.audienceCount > 0 && settings.allowed.audience);

                case 'trail':
                    return post.replyTo != null && settings.allowed.trail;

                case 'invites':
                    return settings.allowed.invites;

                default:
                    return true;
            }

        },

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

        togglePersonDetails(person) {
            if (!this.currentPerson || this.currentPerson.id != person.id) {
                this.setCurrentPerson(person);
            } else {
                this.currentPerson = null;
            }
        },

        setCurrentPerson(person) {
            for (var i = 0; i < this.authors.length; i++) {
                if (this.authors[i].id == person.id) {
                    this.currentPerson = this.authors[i];
                    return;
                }
            }

            app.api
                .get(`/v3/people/${person.id}/roles`)
                .then(roles => {
                    person.roles = roles;
                    this.authors.push(person);
                    this.currentPerson = person;
                });
        },

        openReply(post, toAll) {

            this.audience = [];

            // Fetch a fresh draft
            app.api
                .get(`/people/${app.user.id}/posts/drafts`, {
                    type: "mensaje",
                    replyTo: post.id,
                    create: 1
                })
                .then(drafts => {
                    this.reply = drafts[0];
                })
                .then(() => {
                    if (toAll) {
                        return this.fetchAudience(post)
                            .then(people => this.audience = this.audience.concat(people));
                    }
                })
                .then(() => {

                    /* Append the author if not present */
                    var found = false;
                    for (var i = 0; i < this.audience.length; i++) {
                        if (this.audience[i].id == post.author.id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        this.audience.unshift(post.author);
                    }

                    setTimeout(() => {
                        this.posts.untag(this.posts.items, 'expanded'); // collapse all posts
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
                    return;
                }
            }

            var filesBlock = {
                url,
                type: "files"
            };

            app.api
                .post(`/posts/${this.reply.id}/blocks`, filesBlock)
                .then(() => this.reply.blocks.push(filesBlock));
        },

        sendReply() {
            this.reply.audience = {
                to: {
                    people: this.audience.map(person => String(person.id))
                }
            };

            if (this.audience.indexOf(String(this.replyTo.author.id)) == -1) {
                this.reply.audience.to.people.push(String(this.replyTo.author.id));
            }

            this.reply.settings = {
                allowed: {
                    reply: true,
                    replyAll: true
                }
            };

            app.api
                .post(`/people/${app.user.id}/threads/feed/${this.$route.params.threadId}`, this.reply)
                .then(post => {

                    post.stub = {};
                    this.posts.unshift(post);
                    this.posts.tag(post, 'expanded');

                    this.reply = {
                        replyTo: null,
                        description: null,
                        settings: null
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
.modal-mask {
    z-index: 2;
}

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

.post-blocks {
    margin-top: 6px;
    padding-top: 12px;
    border-top: 1px solid #eee;
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
    min-height: 32px;

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

    .post-trail-handle {
        font-weight: bold;
        border: none;
        color: #333;
        border-radius: 3px;
        background-color: #f8f8f8;
        padding: 6px 12px;
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
    position: relative;
    padding: 36px 0;

    label {
        font-size: 14px;
        color: #666;
    }

    textarea {
        width: 100%;
        min-height: 150px;
        font-size: 1em;
    }

    footer {
        margin: 16px 0 8px 0;
    }

    button {
        padding: 8px 16px;
        border: none;
        font-size: 16px;
        border-radius: 4px;
    }

    .send {
        float: right;
    }

    .cancel {
        background: transparent;
        position: absolute;
        top: 0;
        right: 0;
        color: #777;
    }
}


.authorinfo {

    .cover {
        text-align: center;
        background-color: #1C89B8;
        padding-top: 56px;

        h1 {
            color: #fff;
            padding: 12px 0;
        }
    }

    .avatar {
        margin: auto;
        width: 96px;
        height: 96px;
        overflow: hidden;

        border-radius: 12px;
        border: 5px solid #fff;

        img {
            width: 100%;
        }
    }

    .contents {
        padding: 12px;
    }

    .role {
        margin-bottom: 24px;

        label {
            display: block;
            font-size: 14px;
            color: #666;
            margin-bottom: 6px;
        }

        ul {
            list-style: none;
            margin: 0;
            padding: 0;

            li {
                display: block;
                margin-bottom: 6px;
            }
        }
    }
}

</style>