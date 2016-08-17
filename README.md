# radioGroupify

Converts custom radio group to accessible, keyboard friendly radio group.

## Installation
```bash
$ bower install radio-groupify
```

## Options

* `radioSelector`: _{String}_ The selector of the child elements which represent the custom radio button.
	* defaults to `'.radio-item'`
* `circular`: _{Boolean}_ Whether or not to make the keyboard logic circular (traverse from last to first and first to last when arrowing through radios).
  * defaults to `true`
* `checkedClass`: _{String}_ The class to be added to the "checked" (selected) radio button.
  * defaults to `null` (meaning no class will be added by default)
* `label`: _{Function|String}_
  * `{String}`: A string that will be added as the `aria-label` of the radiogroup OR a function that returns the label element.
  * `{Function}`: A function that returns the label element. `radioGroupify` will associate that element with the radiogroup via `aria-labelledby`.
  * defaults to `null` (meaning no accessible label will be added by default)
* `defaultChecked`: _{Function|Boolean}_
  * `{Function}`: A function that receives the radio elements (the collection based on `options.radioSelector`) which expects a single element to be returned (the item to be rendered as the initially checked radio button).
  * `{Boolean}`:
    * `true` will treat the first element in the radio collection as the initially checked radio button.
    * `false` will NOT have a initially selected element
  * defaults to `false` (meaning there will NOT be an initially checked radio button)

## Example usage

Given the following html...
```html
<h2 class="group-label">Quack</h2>
<div class="radio-container">
  <div class="radio-item">Foo</div>
  <div class="radio-item">Bar</div>
  <div class="radio-item">Baz</div>
</div>
```

```js
jQuery('.radio-container').radioGroupify({
  checkedClass: 'radio-item-checked',
  initialSelected: true, // "Foo" will be initially checked
  label: function ($container, $items) {
    return jQuery('h2.group-label');
  }
});
```

## Running tests
```bash
$ gulp test
```

## Building locally
```bash
$ npm install
```

```bash
$ gulp
```
