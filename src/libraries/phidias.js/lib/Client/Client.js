import 'whatwg-fetch';
import Cache from './Cache.js';
import Collection from './Collection.js';

export default class Client {

	constructor(host) {
		this.host           = host;
		this.token          = null;
		this.cache          = new Cache;
		this.isLoading      = false;
		this.cacheIsEnabled = true;
	}

	collection(url, parameters) {
		return new Collection(this, url, parameters);
	}

	setCaching(value) {
		this.cacheIsEnabled = !!value;
	}

	/* Bearer token */
	setToken(tokenString) {
		this.token = tokenString;
	}

	buildRequest(url, options) {
		url        = this.host + "/" + url;
		var method = options.method ? options.method.toLowerCase(): "get";

		/* Convert body into URL params for get requests */
		if (method == "get" && options.body) {
			url += "?" + Client.serialize(options.body);
			options.body = null;
		}

		if (options.body && typeof options.body != "string" && !(options.body instanceof FormData)) {
			options.body = JSON.stringify(options.body);
		}

		var request = new Request(url, options);

		/* Send token in a Authorization header (unless request specifies its own Authorization header) */
		if (this.token && (!options || !options.headers || !options.headers.Authorization)) {
			request.headers.set("Authorization", "Bearer " + this.token);
		}

		return request;
	}

	fetch(url, options) {

		var request = this.buildRequest(url, options);
		var promise;

		if (request.method == "GET" && this.cacheIsEnabled) {
			promise = this.cache.fetch(request)
				.then(response => response != undefined ? response : fetch(request))
				.then(response => this.cache.store(request, response));
		} else {
			this.cache.clear(url);
			promise = fetch(request);
		}

		var timer = setTimeout(() => {
			this.isLoading = true;
		}, 100);

		return promise
			.then(response => {
				clearTimeout(timer);
				this.isLoading = false;
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response;
			});
	}

	/* Clear the cache for the given URL */
	clear(url) {
		url = this.host + "/" + url;
		return this.cache.clear(url);
	}

	get(url, data) {
		return this.fetch(url, {
			method: "GET",
			body:   data
		})
		.then(response => response.json());
	}

	post(url, data) {
		return this.fetch(url, {
			method: "POST",
			body:   data
		})
		.then(response => response.json());
	}

	put(url, data) {
		return this.fetch(url, {
			method: "PUT",
			body:   data
		})
		.then(response => response.json());
	}

	delete(url, data) {
		return this.fetch(url, {
			method: "DELETE",
			body:   data
		})
		.then(response => response.json());
	}

	patch(url, data) {
		return this.fetch(url, {
			method: "PATCH",
			body:   data
		})
		.then(response => response.json());
	}

	options(url, data) {
		return this.fetch(url, {
			method: "OPTIONS",
			body:   data
		})
		.then(response => response.json());
	}

	static serialize(obj, prefix) {
		var str = [];
		for(var p in obj) {
			if (obj.hasOwnProperty(p)) {
				var k = prefix ? prefix + '[' + p + ']' : p;
				var v = obj[p];

				if (v == null) {
					continue;
				}

				if (typeof v == 'object') {
					str.push(serialize(v, k));
				} else if (typeof v == 'number' || v.length > 0) {
					str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
				}
			}
		}

		return str.join('&');
	}

}


/*

For the future:
fetch doesn't support progress events, so we need to implement an upload method using XMLHttpRequest

var xhr = new XMLHttpRequest()
xhr.open('POST', '/uploads')
xhr.onload = function() {
}
xhr.onerror = function() {}
xhr.upload.onprogress = function (event) {
  if (event.lengthComputable) {
    var percent = Math.round((event.loaded / event.total) * 100)
  }
}

*/