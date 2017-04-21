<script>
import app from '../store/app.js';
import deepstream from 'deepstream.io-client-js';

var client = deepstream('wss://deepstream.phidias.co:6020/deepstream').login();

export default {
	data() {
		return {
			app,
			parameters: {
				q: ""
			},
			people: app.api.collection('/people'),
			timer: null,
			selected: null,

			record: client.record.getRecord("testrecord"),
			text: '',

			listPointers: client.record.getList("pointers"),
			pointers: {},
			timer: null,
			position: {x: null, y: null}
		}
	},

	mounted() {
		this.people.fetch(this.parameters);
		this.record.subscribe('text', this.incomingText);

		this.listPointers.removeEntry(`pointer/${app.user.id}`);
		this.listPointers.addEntry(`pointer/${app.user.id}`);

		this.listPointers.subscribe(this.pointersChanged);

		this.listPointers.on('entry-added', entry => this.addPointer(entry));


		document.addEventListener('mousemove', event => this.movePointer(event.clientX, event.clientY));
	},

	beforeDestroy() {
		this.listPointers.removeEntry(`pointer/${app.user.id}`);
		this.listPointers.discard();
	},

	methods: {
		debounce() {
			clearTimeout(this.timer);
			this.timer = setTimeout(() => this.people.fetch(this.parameters), this.parameters.q.trim().length ? 650 : 0);
		},

		hide() {
			this.selected = this.people.tagged('selected');
			this.people.hide(this.selected);
		},

		restore() {
			this.people.show(this.selected);
			this.selected = null;
		},

		incomingText(value) {
			this.text = value;
		},

		pointersChanged(entries) {
			entries.forEach(this.addPointer);
		},

		addPointer(pointerName) {
			if (typeof this.pointers[pointerName] != 'undefined') {
				return;
			}

			this.$set(this.pointers, pointerName, {
				name: pointerName,
				position: {
					x: null,
					y: null
				}
			});

			client.record.getRecord(pointerName).subscribe('position', position => {
				this.$set(this.pointers[pointerName], 'position',  position);
			});
		},

		movePointer(x, y) {

			this.position = {x,y};

			if (this.timer) {
				return;
			}

			this.timer = true;
			setTimeout(() => {
				client.record.getRecord(`pointer/${app.user.id}`).set('position', this.position);
				this.timer = false;
			}, 150);

		}
	},

	watch: {
		text(newValue) {
			this.record.set("text", newValue);
		}
	}
}
</script>

<template>
	<div class="phi-page">

		<ul>
			<li v-for="pointer in pointers">
				<span>{{ pointer.name }}  {{ pointer.position }}</span>
				<div style="position:fixed; border: 2px solid red; z-index: 999; transition: top 150ms ease-out, left 150ms ease-out" :style="{top: pointer.position.y + 16 + 'px', left: pointer.position.x + 16 + 'px'}">{{ pointer.name }}</div>
			</li>
		</ul>

		<div class="_padded">
			<textarea style="width: 100%; min-height: 200px;" v-model="text"></textarea>
		</div>

		<input v-model="parameters.q" @input="debounce()" />
		<span v-show="people.isLoading">Looking for {{parameters.q}}</span>

		<ul>
			<li v-for="person in people.items"
				:class="{selected: people.hasTag(person,'selected')}"
				@click="people.toggleTag(person, 'selected')"
			>
				{{person.id}}: {{person.firstName}}
			</li>
		</ul>

		<button v-if="people.hasNext" @click="people.next()">next page</button>

		<div v-if="people.count('selected')">
			Selection: ({{ people.count('selected') }})
			<ul>
				<li v-for="person in people.tagged('selected')"
					@click="people.untag(person, 'selected')"
				>
					{{person.id}}: {{person.firstName}}
				</li>
			</ul>
			<button @click="hide()">Hide</button>
		</div>
		<button v-if="selected" @click="restore()">restore</button>
	</div>
</template>

<style lang="scss" scoped>
.selected {
	background: #ff8;
}
</style>