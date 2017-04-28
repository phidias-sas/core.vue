<template>
    <div class="ph-page">
        <div class="ph-page-toolbar" :class="{hidden: toolbar.isHidden}">
            <div class="ph-page-toolbar-bg" :style="{backgroundColor: color}"></div>
            <slot name="toolbar"></slot>
        </div>

        <div class="ph-page-body">
            <div class="ph-page-header">
                <slot name="header"></slot>
            </div>

            <mu-linear-progress :color="color" v-show="loading" />

            <div class="ph-page-contents">
                <slot></slot>
            </div>
        </div>

        <div class="ph-page-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'phi-page',
    props: {
        parallax: {
            type: Number,
            default: 0.1
        },

        loading: {
            type: Boolean,
            default: false
        },

        color: {
            type: String,
            default: "#1C89B8"
        }
    },

    data: () => ({
        toolbar: {
            isHidden: false
        },
        lastScrollPosition: 0
    }),

    mounted() {
        this.$el.querySelector('.ph-page-body').addEventListener('scroll', this.onScroll);
    },

    methods: {
        onScroll(event) {
            /* Background parallax */
            this.$el.style.backgroundPositionY = '-' + event.target.scrollTop*this.parallax + 'px';

            /* Toolbar behavior */
            var delta = event.target.scrollTop - this.lastScrollPosition;
            if (Math.abs(delta) > 23) {
                if (delta < 0) {
                    this.toolbar.isHidden = false;
                } else {
                    this.toolbar.isHidden = event.target.scrollTop > event.target.offsetTop;
                }
                this.lastScrollPosition = event.target.scrollTop;
            }

            /* Toolbar background opacity */
            var opacity = Math.min(event.target.scrollTop / this.$el.querySelector('.ph-page-contents').offsetTop, 1);
            this.$el.querySelector('.ph-page-toolbar-bg').style.opacity = opacity;
        }
    }
}
</script>

<style lang="scss">
$phi-page-toolbar-height: 46px;


.ph-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;

    background-color: #f2f2f2;
    background-size: 100%;
    background-repeat: no-repeat;

    .ph-page-toolbar {
        height: $phi-page-toolbar-height;
        max-height: $phi-page-toolbar-height;
        position: absolute;

        top: 0;
        left: 0;
        right: 0;

        z-index: 2;

        transition: top 200ms ease-out;

        &.hidden {
            top: -$phi-page-toolbar-height;
        }

        .ph-page-toolbar-bg {
            opacity: 0;
        }

        & > * {
            height: $phi-page-toolbar-height;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;

            display: flex;
            align-items: center;

            h1 {
                flex: 1;
                padding: 0 12px;
                font-size: 20px;
            }

            button {
                font-size: 1em;
                background-color: transparent;
                border: none;
                color: inherit;
                padding: 12px 24px;
                cursor: pointer;
            }
        }
    }

    .ph-page-body {
        flex: 1;
        padding-top: $phi-page-toolbar-height;

        overflow: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;

        .ph-page-header {
            overflow: hidden;
        }

        .ph-page-contents {
            min-height: 100%;
            background-color: #f2f2f2;
            padding: 12px;
        }
    }

    .ph-page-footer {
        background-color: #f2f2f2;
    }
}
</style>