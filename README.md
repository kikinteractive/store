store.js - Bindable & persistent storage
========================================

Store.js provides namespaced persistent storage units that provide a bindable interface, convenient for updating views or triggering events based on data.

store.js also provides convenient bindings for ZeptoJS and jQuery to make the development process as seamless as possible.


Links
-----

[Download script (v1.0 minified)](http://code.kik.com/store/1.0.min.js)

[View demo](http://code.kik.com/store/demos/basic.html)


Usage with ZeptoJS or jQuery
----------------------------

### Basic usage

```js
// Store data
$.store.set('animal', 'dog');

// Retrieve data
$.store.get('animal'); // 'dog'

// Test for key existence
$.store.has('animal'); // true

// Delete data
$.store.del('animal');
```


### Store any JSON object

```js
$.store.set('animals', [ 'dog', 'cat' ]);
$.store.get('animals'); // [ 'dog', 'cat' ]
```


### Bind to data changes

```js
$.store.bind('animal', function (key, value) {
	// key   === 'animal'
	// value === 'cat'
});
$.store.set('animal', 'cat');
```


### Create a namespaced storage unit

```js
var animals = $.store('animals');
animals.set('doggie', { type: 'dog', age: 5 });
animals.set('catty' , { type: 'cat', age: 7 });

var temp = $.store();
// storage in temp will not be persistent
```


### Bind directly to DOM elements

```js
// elem is some DOM element
$(elem).storeBind('animal');
$.store.set('animal', 'cow');
// elem now contains a single textnode with the text 'cow'

$(elem).storeBind('animals', function (key, value) {
	return 'Animals: ' + value.join(', ');
});
$.store.set('animals', [ 'dog', 'cat' ]);
// elem now contains a single textnode with the text 'Animals: dog, cat'

// Bind to data in specific storage units
var animals = $.store('animals');
$(elem).storeBind(animals, 'wally');
```


### Take a snapshot of stored data

```js
var snapshot = $.store.snapshot();
$.store.set('animal', 'walrus');
snapshot; // { animal: 'cat', animals: ['dog', 'cat'] }
```


Standalone Usage
----------------

store.js has no external dependencies and will work perfectly fine as a standalone library.


### Make elements scrollable

```js
$.store === Store; // true

var animals = Store('animals');
animals.bind('wally', function (key, value) {
	return name + ' is ' + value.age + ' years old';
});
animals.set('wally', { type: 'walrus', age: 10 });
```
