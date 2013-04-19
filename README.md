store.js - Bindable & persistent storage
========================================

Store.js provides persistent storage with a bindable interface, convenient for updating views or triggering events based on data.

Since persistence is optional, Store.js is at its best when it is used at the global interface for local data. A general work flow is having a synchronisation layer with an external data source and then using Store.js as a centralised data layer for all client-side code.


Links
-----

[Download script (v2.0.0 minified)](http://cdn.kik.com/store/2.0.0/store.js)


Usage
-----

### Basic usage

```js
// Store data
Store.set('animal', 'dog');

// Retrieve data
Store.get('animal'); // 'dog'

// Test for key existence
Store.has('animal'); // true

// Delete data
Store.del('animal');
```


### Store any JSON object

```js
Store.set('animals', [ 'dog', 'cat' ]);
Store.get('animals'); // [ 'dog', 'cat' ]
```


### Bind to data changes

```js
function handler (key, value) {
	// key was updated to value
}

Store.on(handler);         // bind to all updates
Store.on('key', handler);  // listen to single key

Store.off(handler);        // unbind handler globally
Store.off('key', handler); // unbind handler from key
Store.off();               // unbind all handlers
Store.off('key');          // unbind all from key
```


### Memory pressures

```js
Store.maxKeys = 20;
// max items in cache will be capped at 20 (LRU)

Store.maxSize = 1024 * 1024;
// max bytes in cache will be capped at 1MB (LRU)

Store.peek('key');
// same as Store.get except wont effect LRU-ness

Store.set('key', 'value', true);
// this key is now immune to memory pressures

Store.set('key', 'value', false);
// this will be stored in memory (not persistent)
```
