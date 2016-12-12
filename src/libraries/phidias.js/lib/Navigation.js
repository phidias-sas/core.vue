export default class Navigation {

	constructor() {
		this.breadcrumbs = [];		
	}

	clear () {
		this.breadcrumbs = [];
	}

	push (node) {
		for (var i = 0; i < this.breadcrumbs.length; i++) {
			if (node.id == this.breadcrumbs[i].id) {
				this.breadcrumbs.splice(i+1);
				return;
			}
		}
		this.breadcrumbs.push(node);
	}	
}