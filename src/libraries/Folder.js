/*
Encapsulation of Thread folder logic.

var inbox = new Folder(app, 'inbox');
inbox.fetch()
    .then(threads => {
        // threads contains all fetched threads,
        // at the sime time the fetched threads are appended to the inbox.threads collection
    });

inbox.select('read');
inbox.move('archive');  // archive, trash, read or unread
inbox.undo();

*/

export default class Folder {

    constructor(app, folder) {
        this.app        = app;
        this.folder     = folder;
        this.url        = this.getFolderUrl(folder);
        this.collection = app.api.collection(this.url);
        this.lastAction = null;
    }

    getFolderUrl(folder) {
        return `/people/${this.app.user.id}/threads/${folder}`;
    }

    get isLoading() {
        return this.collection.isLoading;
    }

    get hasNext() {
        return this.collection.hasNext;
    }

    get threads() {
        return this.collection.items;
    }

    get selectionCount() {
        return this.collection.count('selected');
    }

    get isEmpty() {
        return !this.threads.length && !this.isLoading;
    }

    fetch(parameters) {
        return this.collection.fetch(parameters);
    }

    next() {
        return this.collection.next();
    }

    select(query) {

        this.collection.untag(this.collection.tagged('selected'), 'selected');
        if (query == "none") return;

        var selection = [];
        this.threads.forEach(thread => {
            switch (query) {
                case "all":
                    selection.push(thread.id);
                break;

                case "read":
                    !!thread.stub.readDate && selection.push(thread.id);
                break;

                case "unread":
                    !thread.stub.readDate && selection.push(thread.id);
                break;
            }
        });

        this.collection.tag(selection, 'selected');
    }

    toggle(thread) {
        return this.collection.toggleTag(thread, 'selected');
    }

    isSelected(thread) {
        return this.collection.hasTag(thread, 'selected');
    }

    move(target) {

        var threads     = this.collection.tagged('selected')
        var selectedIds = threads.filter(item => item.id);

        this.lastAction = {
            target,
            threads,
            text: this.redact(target, threads)
        };

        if (target != "read" && target != "unread") {
            this.collection.hide(threads);
        } else {
            this.collection.untag(threads, 'selected');
        }

        return this.app.api.post(this.getFolderUrl(target), selectedIds)
            .catch(err => {
                this.collection.show(threads);
                return err;
            });
    }

    undo() {

        if (!this.lastAction) return;

        var targetFolder = this.folder;
        if (this.lastAction.target == "read") {
            targetFolder = "unread";
        } else if (this.lastAction.target == "unread") {
            targetFolder = "read";
        }

        var selectedIds = this.lastAction.threads.filter(item => item.id);

        if (targetFolder != "read" && targetFolder != "unread") {
            this.collection.show(this.lastAction.threads);
        } else {
            this.collection.tag(this.lastAction.threads, 'selected');
        }

        return this.app.api.post(this.getFolderUrl(targetFolder), selectedIds)
            .then(response => {
                this.lastAction = null;
                return response;
            });
    }


    redact(target, threads) {
        var plural    = threads.length > 1;
        var redaction = threads.length + ' ';

        switch (target) {
            case 'inbox':
                redaction = redaction + (plural ? 'restaurados' : 'restaurado');
            break;

            case 'archive':
                redaction = redaction + (plural ? 'archivados' : 'archivado');
            break;

            case 'trash':
                redaction = redaction + (plural ? 'eliminados' : 'eliminado');
            break;

            case 'read':
                redaction = redaction + (plural ? 'marcados como leído' : 'marcado como leído');
            break;

            case 'unread':
                redaction = redaction + (plural ? 'marcados como no leído' : 'marcado como no leído');
            break;
        }

        return redaction;
    }

}