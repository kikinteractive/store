var Store = function (window, document, Zepto, jQuery) {
	var VALUE_PREFIX    = '__STORE_VALUE__',
		INDEX_PREFIX    = '__STORE_INDEX__',
		PERSISTENT_FLAG = 'p';

	var cache          = {},
		keys           = [],
		persistentKeys = [],
		handlers       = {},
		allHandlers    = [],
		currentSize    = 0,
		maxKeys        = 256 * 1024,
		maxSize        = 2 * 1024 * 1024;

	loadFromStorage();

	var Store = {
		set  : setValue         ,
		get  : getValue         ,
		peek : peekValue        ,
		has  : hasValue         ,
		del  : deleteValue      ,
		on   : bindListener     ,
		off  : unbindListener   ,
		get maxKeys () {
			return maxKeys;
		},
		set maxKeys (val) {
			setMaxKeys(val);
		},
		get maxSize () {
			return maxSize;
		},
		set maxSize (val) {
			setMaxSize(val);
		}
	};

	if (Zepto) {
		Zepto.store = Store;
	}
	if (jQuery) {
		jQuery.store = Store;
	}

	return Store;



	/* Persistent storage */

	function loadFromStorage () {
		var prefixLength = VALUE_PREFIX.length;

		for (var key in localStorage) {
			if (key.substr(0, prefixLength) !== VALUE_PREFIX) {
				loadItemFromStorage( key.substr(prefixLength) );
			}
		}

		var badIndex = -1;

		for (var i=keys.length; i--;) {
			if (typeof keys[i] !== 'string') {
				badIndex = i;
				keys.splice(i, 1);
			}
		}

		if (badIndex !== -1) {
			updateIndexes(badIndex);
		}

		enforceMaximums(true);
	}

	function loadItemFromStorage (key) {
		var raw = localStorage[VALUE_PREFIX+key],
			data;

		if ( !raw ) {
			return;
		}

		try {
			data = JSON.parse( localStorage[VALUE_PREFIX+key] );
		}
		catch (err) {
			return;
		}

		var index = localStorage[INDEX_PREFIX+key];
		if (index !== PERSISTENT_FLAG) {
			index = parseInt(index);
			if ( isNaN(index) ) {
				return;
			}
		}

		cache[key] = data;
		if (index === PERSISTENT_FLAG) {
			persistentKeys.push(key);
		}
		else {
			keys[index] = key;
		}

		currentSize += raw.length;
	}

	function updateIndexes (index) {
		for (var i=(index||0), l=keys.length; i<l; i++) {
			localStorage[INDEX_PREFIX+keys[i]] = i+'';
		}
	}



	/* Storage APIs */

	function setValue (key, value, isPersistent) {
		if (typeof key !== 'string') {
			throw TypeError('key must be a string, got ' + key);
		}

		if (typeof value === 'undefined') {
			deleteValue(key);
			return;
		}

		switch (typeof isPersistent) {
			case 'undefined':
			case 'boolean':
				break;
			default:
				throw TypeError('persistence flag must be a boolean if defined, got ' + isPersistent);
		}

		var raw;
		try {
			raw = JSON.stringify(value);
		}
		catch (err) {
			throw TypeError('value must be JSON stringifiable, got ' + value);
		}

		currentSize -= (localStorage[VALUE_PREFIX+key]||'').length;
		delete localStorage[VALUE_PREFIX+key];

		var index;

		index = keys.indexOf(key);
		if (index !== -1) {
			keys.splice(index, 1);
		}

		index = persistentKeys.indexOf(key);
		if (index !== -1) {
			persistentKeys.splice(index, 1);
		}

		cache[key] = value;

		if (isPersistent !== false) {
			localStorage[VALUE_PREFIX+key] = raw;
			currentSize += raw.length;

			if (isPersistent === true) {
				persistentKeys.push(key);
				localStorage[INDEX_PREFIX+key] = PERSISTENT_FLAG;
			}
			else {
				keys.unshift(key);
			}
		}

		updateIndexes();

		triggerEvent(key, value);

		enforceMaximums();
	}

	function getValue (key) {
		if (typeof key !== 'string') {
			throw TypeError('key must be a string, got ' + key);
		}

		var index = keys.indexOf(key);
		if (index > 0) {
			keys.splice(index, 1);
			keys.unshift(key);
			updateIndexes();
		}

		return cache[key];
	}

	function peekValue (key) {
		if (typeof key !== 'string') {
			throw TypeError('key must be a string, got ' + key);
		}

		return cache[key];
	}

	function hasValue (key) {
		if (typeof key !== 'string') {
			throw TypeError('key must be a string, got ' + key);
		}

		return (key in cache);
	}

	function deleteValue (key, noUpdate) {
		if (typeof key !== 'string') {
			throw TypeError('key must be a string, got ' + key);
		}

		var index;

		if ( !noUpdate ) {
			index = keys.indexOf(key);
			if (index !== -1) {
				keys.splice(index, 1);
			}

			index = persistentKeys.indexOf(key);
			if (index !== -1) {
				persistentKeys.splice(index, 1);
			}
		}

		currentSize -= (localStorage[VALUE_PREFIX+key] || '').length;

		delete cache[key];
		delete localStorage[VALUE_PREFIX+key];
		delete localStorage[INDEX_PREFIX+key];

		if ( !noUpdate ) {
			triggerEvent(key);
		}
	}



	/* Cache invalidation */

	function setMaxKeys (val) {
		if ((typeof val !== 'number') || (val <= 0)) {
			throw TypeError('max keys must be a positive number, got ' + val);
		}

		maxKeys = val;
		enforceMaximums();
	}

	function setMaxSize (val) {
		if ((typeof val !== 'number') || (val <= 0)) {
			throw TypeError('max size must be a positive number, got ' + val);
		}

		maxSize = val;
		enforceMaximums();
	}

	function enforceMaximums (noUpdate) {
		var numPersistent = persistentKeys.length,
			numKeys       = keys.length,
			deletes       = [];

		if (numPersistent + numKeys > maxKeys) {
			var spill = maxKeys-numPersistent;
			if (spill > 0) {
				var keySpill = keys.splice(-spill);
				deletes = deletes.concat(keySpill);
				for (var i=0, l=keySpill.length; i<l; i++) {
					deleteValue(keySpill[i], true);
				}
			}
		}

		while ((currentSize > maxSize) && keys.length) {
			var key = keys.pop();
			deletes.push(key);
			deleteValue(key, true);
		}

		if ( !noUpdate ) {
			for (var i=0, l=deletes.length; i<l; i++) {
				triggerEvent( deletes[i] );
			}
		}
	}



	/* Eventing */

	function bindListener (key, handler) {
		switch (typeof key) {
			case 'function':
				handler = key;
				key     = undefined;
			case 'string':
			case 'undefined':
				break;
			default:
				throw TypeError('bound key must be a string if defined, got ' + key);
		}
		if (typeof handler !== 'function') {
			throw TypeError('bound handler must be a function, got ' + handler);
		}

		removeFunction(allHandlers, handler);

		if ( !key ) {
			allHandlers.push(handler);
		}
		else if (key in handlers) {
			removeFunction(handlers[key], handler);
			handlers[key].push(handler);
		}
		else {
			handlers[key] = [handler];
		}
	}

	function unbindListener (key, handler) {
		switch (typeof key) {
			case 'function':
				handler = key;
				key     = undefined;
			case 'undefined':
			case 'string':
				break;
			default:
				throw TypeError('unbound key must be a string if defined, got ' + key);
		}
		switch (typeof handler) {
			case 'undefined':
			case 'function':
				break;
			default:
				throw TypeError('unbound handler must be a function if defined, got ' + handler);
		}

		if (key) {
			if ( !handler ) {
				delete handlers[key];
			}
			else if (key in handlers) {
				removeFunction(handlers[key], handler);
				if (handlers[key].length === 0) {
					delete handlers[key];
				}
			}
		}
		else {
			if (handler) {
				removeFunction(allHandlers, handler);
				for (var key in handlers) {
					removeFunction(handlers[key], handler);
					if (handlers[key].length === 0) {
						delete handlers[key];
					}
				}
			}
			else {
				allHandlers = [];
				for (var key in handlers) {
					delete handlers[key];
				}
			}
		}
	}

	function removeFunction (list, func) {
		for (var i=list.length; i--;) {
			if (list[i] === func) {
				list.splice(i, 1);
			}
		}
	}

	function triggerEvent (key, value) {
		allHandlers.forEach(function (func) {
			func(key, value);
		});

		(handlers[key] || []).forEach(function (func) {
			func(key, value);
		});
	}
}(window, document, window.Zepto, window.jQuery);
