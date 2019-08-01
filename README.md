# Vue-On-Clickout

There are many packages that uses custom derivatives to capture and
handles the "click outside" event of an element. Their common problem,
however, is that by the design of Vue.js, one must pass a function to
the derivative and cannot directly write code for execution, as in the
case of the v-on event handlers. This creates inconsistency in
the coding style and is really bothering to me.

Therefore I created Vue-On-Clickout. It is different; it actually creates the "clickout" event
and you simply write `v-on:clickout="..."` or `@clickout="..."` as in
any other events.

## License

MIT License

## Install

You can get Vue-On-Clickout as an NPM package by running:
```bash
npm install vue-on-clickout --save
```
Or, simply download `vue-on-clickout.js`.


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

And then in your template, on any element, use `v-on:clickout="..."` or `@clickout="..."` and watch the magic happen. You can also use the `.stop` modifier as well. The following example demonstrates it all.

```html
<div id="app">
	<div style="padding:20px; background:red;" @clickout="color='white'">
		<div style="padding:20px; background:yellow;" v-on:clickout.stop="color='red'" v-on:click="color='yellow'">{{color}}
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