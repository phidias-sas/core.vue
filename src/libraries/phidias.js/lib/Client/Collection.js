export default class Collection {

    constructor(client, url, parameters = {}) {
        this.client     = client;
        this.url        = url;
        this.parameters = parameters;
        this._items     = [];

        this.dummy = false;
        this.reset();
    }

    reset() {
        this.meta       = {};
        this.countCache = {};
        this.total      = null;
        this.pagination = {
            page: 1,
            limit: 20,
            hasNext: false
        };
    }

    fetch(parameters = this.parameters, append = false) {
        !append && this.reset();
        this.parameters = parameters;
        return this.client
            .fetch(this.url, {
                method: "get",
                body: Object.assign({}, parameters, this.pagination)
            })
            .then(response => {
                this.total = response.headers.get("x-phidias-collection-total");
                return response.json();
            })
            .then(items => {
                if (this.total == -1) {
                    this.pagination.hasNext = items.length == this.pagination.limit;
                } else {
                    this.pagination.hasNext = this.pagination.page < Math.ceil(this.total/this.pagination.limit); // Match.ceil(...) is the total number of pages
                }

                !append && (this._items = []);
                return this.appendItems(items);
            });
    }

    next() {
        this.pagination.page++;
        return this.fetch(this.parameters, true);
    }

    appendItems(items) {
        items.forEach(item => this.append(item));
        return items;
    }

    append(incomingItem) {
        for (var i = 0; i < this._items.length; i++) {
            if (Collection.areEqual(incomingItem, this._items[i])) {
                this._items[i] = Collection.merge(this._items[i], incomingItem);
                return this._items[i];
            }
        }

        this._items.push(incomingItem);
        return incomingItem;
    }

    splice(outgoing) {
        this._items.splice(this.indexOf(outgoing), 1);
    }

    indexOf(item) {
        for (var i = 0; i < this._items.length; i++) {
            if (Collection.areEqual(item, this._items[i])) {
                return i;
            }
        }
        return -1;
    }


    /* Meta-data handling */
    setMeta(item, key, value) {
        if (Array.isArray(item)) return item.forEach(subitem => this.setMeta(subitem, key, value));

        var itemId = this.constructor.getId(item);
        if (this.meta[itemId] == undefined) {
            this.meta[itemId] = {};
        }
        this.meta[itemId][key] = value;

        this.dummy = !this.dummy; //VUE will notice this change and trigger updates in all functions that contain this.dummy
    }

    getMeta(item, key, defaultValue = null) {
        var itemId = this.constructor.getId(item);
        return this.meta[itemId] && this.meta[itemId][key] ? this.meta[itemId][key] : defaultValue;
    }

    show(item) {
        this.setMeta(item, 'hidden', false);
        this.countCache = {};
    }

    hide(item) {
        this.setMeta(item, 'hidden', true);
        this.countCache = {};
    }

    isHidden(item) {
        return this.getMeta(item, 'hidden', false);
    }

    toggle(item) {
        this.isHidden(item) ? this.show(item) : this.hide(item);
    }

    /* Tagging */
    tag(item, tag) {
        if (Array.isArray(item)) return item.forEach(subitem => this.tag(subitem, tag));

        var tags = this.getMeta(item, 'tags', []);
        if (tags.indexOf(tag) == -1) {
            tags.push(tag);
            this.setMeta(item, 'tags', tags);
        }

        delete this.countCache[tag];
    }

    untag(item, tag) {
        if (Array.isArray(item)) return item.forEach(subitem => this.untag(subitem, tag));

        var tags = this.getMeta(item, 'tags', []);
        var index = tags.indexOf(tag);
        if (index != -1) {
            tags.splice(index, 1);
            this.setMeta(item, 'tags', tags);
        }

        delete this.countCache[tag];
    }

    hasTag(item, tag) {
        var tags = this.getMeta(item, 'tags', []);
        return tags.indexOf(tag) != -1;
    }

    toggleTag(item, tag) {
        if (Array.isArray(item)) return item.forEach(subitem => this.toggleTag(subitem, tag));
        this.hasTag(item, tag) ? this.untag(item, tag) : this.tag(item, tag);
    }

    tagged(tag) {
        return this.items.filter(item => this.hasTag(item, tag));
    }

    count(tag) {
        if (this.countCache[tag] != undefined) return this.countCache[tag];

        var count = 0;
        for (var id in this.meta) {
            if (!this.meta[id].hidden && this.meta[id].tags && this.meta[id].tags.indexOf(tag) != -1) count++;
        }

        this.countCache[tag] = count;
        return count;
    }

    //  Adds new properties from incomingObject into targetObject. Keeps all targetObject properties intact.
    static merge(targetObject, incomingObject) {
        return Object.assign(incomingObject, targetObject);
    }

    static areEqual(itemA, itemB) {
        return Collection.getId(itemA) == Collection.getId(itemB);
    }

    static getId(item) {
        if (typeof item != "object") return item;
        return item.id ? item.id : JSON.stringify(item);
    }


    /* Pseudo properties */
    get items() {
        this.dummy; // VUE will assume this function must be refreshed when dummy changes
        return this._items.filter(item => !this.isHidden(item));
    }

    get isLoading() {
        return this.client.isLoading;
    }

    get hasNext() {
        return this.pagination.hasNext;
    }

}