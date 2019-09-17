# Vue-On-Clickout

> Add `v-on:clickout` event to elements in [Vue.js](https://www.npmjs.com/package/vue).

[![npm version](https://img.shields.io/npm/v/vue-on-clickout.svg?logo=npm)](https://www.npmjs.com/package/vue-on-clickout)
![npm downloads](https://img.shields.io/npm/dt/vue-on-clickout?logo=npm)
[![GitHub package version](https://img.shields.io/github/package-json/v/MuTsunTsai/vue-on-clickout.svg?logo=github&label=Github)](https://github.com/MuTsunTsai/vue-on-clickout)
![license](https://img.shields.io/npm/l/vue-on-clickout.svg)


There are many packages [<sup>1</sup>](#1) that use custom directives to capture and
handle the "click outside" event of an element. They all have the same common problem:
they do not accept directly writing expression in the custom directive, as in the case
of the `v-on` event handlers. This creates inconsistency in the coding style and
is really bothering to me.

Therefore I created Vue-On-Clickout which is different from all of them.
It actually creates the "clickout" event and you simply write `v-on:clickout="..."`
or `@clickout="..."` as in any other events.

<a class="anchor" id="1"><sup>1</sup></a> Such as
[vue-clickaway](https://www.npmjs.com/package/vue-clickaway),
[vue-clickout](vue-clickout),
[vue-directive-clickout](https://github.com/LinusBorg/vue-directive-clickout),
[vue-click-outside](https://www.npmjs.com/package/vue-click-outside),
[v-click-outside](https://www.npmjs.com/package/v-click-outside),
[vue-v-clickoutside](https://www.npmjs.com/package/vue-v-clickoutside),
[vue-on-click-outside](https://www.npmjs.com/package/vue-on-click-outside),
[vue-outside-click](https://www.npmjs.com/package/vue-outside-click),
[vue-outside-events](https://www.npmjs.com/package/vue-outside-events),
to name a few.

## License

MIT License

## Install

You can get Vue-On-Clickout as an NPM package by running:
```bash
npm install vue-on-clickout --save
```
Or, simply download [`vue-on-clickout.js`](https://github.com/MuTsunTsai/vue-on-clickout/raw/master/lib/vue-on-clickout.js).


## Usage

Vue-On-Clickout can be used both with or without modules.

### With modules

```javascript
import VueOnClickout from 'vue-on-clickout';

Vue.use(VueOnClickout);
...
```

### Without modules

```html
<!-- place this after loading vue.js -->
<script src="vue-on-clickout.js"></script>
<!-- no need to call Vue.use(); it does that automatically -->
```

And then in your template, on any element, use `v-on:clickout="..."` or `@clickout="..."` and watch the magic happen.

In version 1.1, the order of firing the `clickout` event has been changed from "bottom-up" to "top-down", that is, the event handler of parent element will fire first, and then those of the child elements. The `.stop` modifier works in the opposite direction, so that the parent element will stop its child elements from firing the clickout event.

The following example demonstrates it all.

```html
<div id="app">
	<div style="padding:20px; background:blue;" v-on:clickout.stop="color='white'">
		<div style="padding:20px; background:red;" @clickout="color='blue'">
			<div style="padding:20px; background:yellow;" v-on:clickout="color='red'" v-on:click="color='yellow'">{{color}}
			</div>
		</div>
	</div>
</div>
<script>
	var app = new Vue({
		el: "#app",
		data: {
			color: 'yellow'
		}
	});
</script>
```
In this example, you would not see the word `blue` showing up, because the clickout event bubbles "downwards" and the word `red` overrides `blue`. However you do see the word `white` because the bubbling stops there.