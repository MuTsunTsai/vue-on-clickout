;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.VueOnClickout = factory();
  }
}(this, function() {
const cout = "clickout";

// Keeps a list of all elements with v-clickout directive, ordered
// from top level element to deeper level elements.
let clickoutList = [];

// List of elements that stops the current propagation of clickout event.
let stopList = [];

let sortNeeded = false;

const dir = {
	bind(el) {
		// Newly added element is likely to be of lower order,
		// so we place it at the end of the array to speed up sorting.
		clickoutList.push(el);
		sortNeeded = true;

		el.addEventListener(cout, (e) => {
			if(e.cancelBubble) stopList.push(el);
		});
	},
	unbind(el) {
		clickoutList.splice(clickoutList.indexOf(el), 1);
	}
};

// For Vue 3, these hooks have new names.
dir.mounted = dir.bind;
dir.unmounted = dir.unbind;

// Sort the elements in the list so that the events will fire in the correct order.
function elSort(e1, e2) {
	if(e2.contains(e1)) return 1;
	if(e1.contains(e2)) return -1;
	return 0;
}

function processClickout(event) {
	if(sortNeeded) {
		clickoutList.sort(elSort);
		sortNeeded = false;
	}

	// Loops from top-down
	for(let el of clickoutList) {
		if(!el.contains(event.target) && !stopList.some(c => c.contains(el)))
			el.dispatchEvent(new Event(cout));
	}

	// Reset stopList
	stopList = [];
}

// Node transform function for Vue 3; it detects "v-on:clickout" and adds "v-clickout".
function transform(node) {
	let props = node.props;
	if(!props) return;
	if(props.some(p => p.type == 7 && p.name == "on" && p.arg && p.arg.content == cout) &&
		!props.some(p => p.type == 7 && p.name == cout)) {
		props.push({
			"type": 7,
			"name": cout,
			"exp": {
				"type": 4,
				"content": "",
				"isStatic": false,
				"isConstant": false,
			},
			"modifiers": [],
		});
	}
}

const VueOnClickout = {
	installed: false,
	install(Vue) {
		if(!VueOnClickout.installed) {
			// Use a central event listener to control the firing of clickout events.
			document.addEventListener('click', processClickout);

			// Wrap event.stopPropagation() method, so that even if a click event is stopped,
			// the clickout event will still fire.
			var sp = Event.prototype.stopPropagation;
			function hack_stopPropagation() {
				sp.apply(this);
				if(this.type == 'click') processClickout(this);
			}
			Event.prototype.stopPropagation = hack_stopPropagation;

			VueOnClickout.installed = true;
		}

		// We still use directive as in many other similar packages,
		// because that's the most convenient way of tracking the construction
		// and destruction of elements. So the question is how to add the "v-clickout"
		// directive to whatever element that has "v-on:clickout" event handler.
		Vue.directive(cout, dir);

		if(typeof (Vue.version) == "string" && Vue.version[0] == "3") {
			// For Vue 3, we wrap the function `isCustomElement` in order to access
			// the compile option (which is `this`) and add custom node transform function to it.
			let orgICE = Vue.config.isCustomElement;
			function wrapICE(tag) {
				let transforms = (this.nodeTransforms = this.nodeTransforms || []);
				if(transforms.indexOf(transform) < 0) transforms.push(transform);
				return orgICE(tag);
			}
			Object.defineProperty(Vue.config, "isCustomElement", {
				get() { return wrapICE; },
				set(v) { orgICE = v; }
			});
		} else {
			// For Vue 2, we hack the element-creating method of Vue,
			// and replace it with a wrapper function to detect "v-on:clickout".
			Vue.mixin({
				beforeCreate() {
					let original_c = this._c;
					function hack_c(tag, data, children, normalizationType) {
						if(data && data.on && data.on[cout]) {
							data.directives = data.directives || [];
							if(!data.directives.some(d => d.name == cout))
								data.directives.push({ name: cout, rawName: "v-" + cout });
						}
						return original_c(tag, data, children, normalizationType);
					}
					this._c = hack_c;
				}
			});
		}
	}
}

// Automatically load the plugin itself for Vue 2.
if(typeof window !== 'undefined' && window.Vue && window.Vue.use) {
	window.Vue.use(VueOnClickout);
}
return VueOnClickout;
}));
