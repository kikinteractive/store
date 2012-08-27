/**
 * store.js v1.0
 * Bindable & persistent storage
 * Copyright (c) 2012 Kik Interactive, http://kik.com
 * Released under the MIT license
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */



/* http://www.JSON.org/json2.js */
this.JSON||(this.JSON={});(function(){function c(a){return a<10?"0"+a:a}function a(a){n.lastIndex=0;return n.test(a)?'"'+a.replace(n,function(a){var b=q[a];return typeof b==="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function m(b,c){var g,i,e,d,p=j,h,f=c[b];f&&(typeof f==="object"&&typeof f.toJSON==="function")&&(f=f.toJSON(b));typeof k==="function"&&(f=k.call(c,b,f));switch(typeof f){case "string":return a(f);case "number":return isFinite(f)?String(f):"null";case "boolean":case "null":return String(f);
case "object":if(!f)return"null";j=j+l;h=[];if(Object.prototype.toString.apply(f)==="[object Array]"){d=f.length;for(g=0;g<d;g=g+1)h[g]=m(g,f)||"null";e=h.length===0?"[]":j?"[\n"+j+h.join(",\n"+j)+"\n"+p+"]":"["+h.join(",")+"]";j=p;return e}if(k&&typeof k==="object"){d=k.length;for(g=0;g<d;g=g+1){i=k[g];if(typeof i==="string")(e=m(i,f))&&h.push(a(i)+(j?": ":":")+e)}}else for(i in f)if(Object.hasOwnProperty.call(f,i))(e=m(i,f))&&h.push(a(i)+(j?": ":":")+e);e=h.length===0?"{}":j?"{\n"+j+h.join(",\n"+
j)+"\n"+p+"}":"{"+h.join(",")+"}";j=p;return e}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+c(this.getUTCMonth()+1)+"-"+c(this.getUTCDate())+"T"+c(this.getUTCHours())+":"+c(this.getUTCMinutes())+":"+c(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var b=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
n=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,j,l,q={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},k;if(typeof JSON.stringify!=="function")JSON.stringify=function(a,b,c){var i;l=j="";if(typeof c==="number")for(i=0;i<c;i=i+1)l=l+" ";else typeof c==="string"&&(l=c);if((k=b)&&typeof b!=="function"&&(typeof b!=="object"||typeof b.length!=="number"))throw Error("JSON.stringify");return m("",{"":a})};
if(typeof JSON.parse!=="function")JSON.parse=function(a,c){function g(a,d){var b,h,f=a[d];if(f&&typeof f==="object")for(b in f)if(Object.hasOwnProperty.call(f,b)){h=g(f,b);h!==void 0?f[b]=h:delete f[b]}return c.call(a,d,f)}var i,a=String(a);b.lastIndex=0;b.test(a)&&(a=a.replace(b,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){i=eval("("+a+")");return typeof c==="function"?g({"":i},""):i}throw new SyntaxError("JSON.parse");}})();



(function (window, document, Zepto, jQuery) {
	var KEY_PREFIX = '__STORE__';



	/* Copyright (c) 2010-2012 Marcus Westin */
	var persistentStorage=function(c){var a={},m=c.document,b;a.disabled=false;a.set=function(){};a.get=function(){};a.remove=function(){};a.clear=function(){};a.transact=function(e,d,b){var c=a.get(e);null==b&&(b=d,d=null);"undefined"==typeof c&&(c=d||{});b(c);a.set(e,c)};a.getAll=function(){};a.serialize=function(a){return JSON.stringify(a)};a.deserialize=function(a){return"string"!=typeof a?void 0:JSON.parse(a)};var n;try{n="localStorage"in c&&c.localStorage}catch(j){n=false}if(n){b=c.localStorage;a.set=function(e,
	d){if(void 0===d)return a.remove(e);b.setItem(e,a.serialize(d))};a.get=function(e){return a.deserialize(b.getItem(e))};a.remove=function(a){b.removeItem(a)};a.clear=function(){b.clear()};a.getAll=function(){for(var e={},d=0;d<b.length;++d){var c=b.key(d);e[c]=a.get(c)}return e}}else{var l;try{l="globalStorage"in c&&c.globalStorage&&c.globalStorage[c.location.hostname]}catch(q){l=false}if(l){b=c.globalStorage[c.location.hostname];a.set=function(e,d){if(void 0===d)return a.remove(e);b[e]=a.serialize(d)};
	a.get=function(e){return a.deserialize(b[e]&&b[e].value)};a.remove=function(a){delete b[a]};a.clear=function(){for(var a in b)delete b[a]};a.getAll=function(){for(var e={},d=0;d<b.length;++d){var c=b.key(d);e[c]=a.get(c)}return e}}else if(m.documentElement.addBehavior){var k,o;try{o=new ActiveXObject("htmlfile");o.open();o.write('<script>document.w=window<\/script><iframe src="/favicon.ico"></frame>');o.close();k=o.w.frames[0].document;b=k.createElement("div")}catch(r){b=m.createElement("div");k=
	m.body}var c=function(e){return function(){var d=Array.prototype.slice.call(arguments,0);d.unshift(b);k.appendChild(b);b.addBehavior("#default#userData");b.load("localStorage");d=e.apply(a,d);k.removeChild(b);return d}},g=RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g");a.set=c(function(b,d,c){d=d.replace(g,"___");if(void 0===c)return a.remove(d);b.setAttribute(d,a.serialize(c));b.save("localStorage")});a.get=c(function(b,c){c=c.replace(g,"___");return a.deserialize(b.getAttribute(c))});a.remove=
	c(function(a,b){b=b.replace(g,"___");a.removeAttribute(b);a.save("localStorage")});a.clear=c(function(a){var b=a.XMLDocument.documentElement.attributes;a.load("localStorage");for(var c=0,h;h=b[c];c++)a.removeAttribute(h.name);a.save("localStorage")});a.getAll=c(function(b){var c=b.XMLDocument.documentElement.attributes;b.load("localStorage");for(var b={},g=0,h;h=c[g];++g)b[h]=a.get(h);return b})}}try{a.set("__storejs__","__storejs__");"__storejs__"!=a.get("__storejs__")&&(a.disabled=true);a.remove("__storejs__")}catch(i){a.disabled=
	true}a.enabled=!a.disabled;return a}(window);



	function isDOMNode (elem) {
		if ( !elem ) {
			return false;
		}

		try {
			return (elem instanceof Node) || (elem instanceof HTMLElement);
		} catch (err) {}

		if (typeof elem !== 'object') {
			return false;
		}

		if (typeof elem.nodeType !== 'number') {
			return false;
		}

		if (typeof elem.nodeName !== 'string') {
			return false;
		}

		return true;
	}



	function validateKey (key) {
		if (typeof key !== 'string') {
			throw TypeError('key must be a string, got ' + key);
		}
	}

	function validateTransform (transform) {
		switch (typeof transform) {
			case 'undefined':
			case 'function':
				break;

			default:
				throw TypeError('transform must be a function, got ' + transform);
		}
	}



	function Store (obj, namespace) {
		switch (typeof obj) {
			case 'string':
				namespace = obj;
				// fall through

			case 'undefined':
				obj = {};
				// fall through

			case 'function':
			case 'object':
				break;

			default:
				throw TypeError('store must be an object, got ' + obj);
		}

		switch (typeof namespace) {
			case 'string':
				if ( !namespace ) {
					throw TypeError('namespace may not be the empty string');
				}
				if ( !persistentStorage.enabled ) {
					namespace = null;
				}
				// fall through

			case 'undefined':
				break;

			default:
				throw TypeError('namespace must be a string if defined, got ' + namespace);
		}



		var cache     = {},
			listeners = {};



		function bind (key, listener, transform) {
			validateKey(key);
			validateTransform(transform);

			var data = { listener : listener };

			if (typeof listener === 'function') {
				data.type = 'function';
			}
			else if ( isDOMNode(listener) ) {
				if (transform) {
					data.type      = 'transform';
					data.transform = transform;
				}
				else {
					data.type = 'node';
				}
			}
			else {
				throw TypeError('listener must be a function or DOM node, got ' + listener);
			}

			if ( !listeners[key] ) {
				listeners[key] = [ data ];
			}
			else {
				listeners[key].push(data);
			}
		}



		function unbind (key, listener) {
			validateKey(key);

			var keyListeners = listeners[key];

			if ( !keyListeners ) {
				return;
			}

			for (var i=keyListeners.length; i--;) {
				if (keyListeners[i].listener === listener) {
					keyListeners.splice(i, 1);
				}
			}
		}


		var triggers = {
			'function'  : triggerFunction  ,
			'node'      : triggerElement   ,
			'transform' : triggerTransform
		};

		function trigger (key) {
			validateKey(key);

			var keyListeners = listeners[key],
				data;

			if ( !keyListeners ) {
				return;
			}

			for (var i=0, len=keyListeners.length; i<len; i++) {
				data = keyListeners[i];
				triggers[data.type](key, data.listener, data.transform);
			}
		}

		function triggerFunction (key, func) {
			try {
				func(key, cache[key]);
			}
			catch (err) {
				if (window.console && window.console.error) {
					window.console.error(err + '');
				}
			}
		}

		function triggerElement (key, elem) {
			var value = cache[key] + '';

			if (typeof elem.innerText !== 'undefined') {
				elem.innerText = value;
			}
			else if (typeof elem.textContent !== 'undefined') {
				elem.textContent = value;
			}
		}

		function triggerTransform (key, elem, transform) {
			var value = '';

			try {
				value = transform(key, cache[key]);
			}
			catch (err) {
				if (window.console && window.console.error) {
					window.console.error(err + '');
				}
				return;
			}

			elem.innerHTML = value;
		}



		function getValue (key) {
			validateKey(key);

			return cache[key];
		}



		function hasValue (key) {
			validateKey(key);

			return (typeof cache[key] !== 'undefined');
		}



		function setValue (key, value) {
			validateKey(key);

			cache[key] = value;

			if (namespace) {
				setPersistentStore(key, value);
			}

			trigger(key);
		}



		function delValue (key) {
			validateKey(key);

			delete cache[key];

			if (namespace) {
				delPersistentStore();
			}

			trigger(key);
		}



		function takeSnapshot () {
			var snapshot = {};

			for (var key in cache) {
				snapshot[key] = cache[key];
			}

			return snapshot;
		}



		function persistentStorePrefix () {
			return KEY_PREFIX + namespace + '__';
		}


		function populateFromPersistentStore () {
			var prefix       = persistentStorePrefix(),
				prefixLength = prefix.length;

			try {
				var snapshot = persistentStorage.getAll();

				for (var fullKey in snapshot) {
					if (fullKey.substr(0, prefixLength) === prefix) {
						cache[ fullKey.substr(prefixLength) ] = snapshot[fullKey];
					}
				}
			}
			catch (err) {}
		}



		function setPersistentStore (key, value) {
			try {
				persistentStorage.set(persistentStorePrefix() + key, value);
			}
			catch (err) {}
		}



		function delPersistentStore (key) {
			try {
				persistentStorage.remove(persistentStorePrefix() + key);
			}
			catch (err) {}
		}



		if (namespace) {
			populateFromPersistentStore();
		}



		obj.bind     = bind;
		obj.unbind   = unbind;
		obj.get      = getValue;
		obj.has      = hasValue;
		obj.set      = setValue;
		obj.del      = delValue;
		obj.snapshot = takeSnapshot;
		return obj;
	}

	Store(Store, KEY_PREFIX);



	if (Zepto) {
		Zepto.store = Store;

		Zepto.extend(Zepto.fn, {
			storeBind : function (store, key, transform) {
				if (typeof store === 'string') {
					transform = key;
					key       = store;
					store     = Store;
				}

				this.forEach(function (elem) {
					store.bind(key, elem, transform);
				});
			},

			storeUnbind : function (store, key) {
				if (typeof store === 'string') {
					key   = store;
					store = Store;
				}

				this.forEach(function (elem) {
					store.unbind(key, elem);
				});
			}
		});
	}

	if (jQuery) {
		jQuery.store = Store;

		jQuery.fn.storeBind = function (store, key, transform) {
			if (typeof store === 'string') {
				transform = key;
				key       = store;
				store     = Store;
			}

			this.each(function () {
				store.bind(key, this, transform);
			});
		};

		jQuery.fn.storeUnbind = function (store, key) {
			if (typeof store === 'string') {
				key   = store;
				store = Store;
			}

			this.each(function () {
				store.unbind(key, this);
			});
		};
	}

	window.Store = Store;
})(window, document, window.Zepto, window.jQuery);
