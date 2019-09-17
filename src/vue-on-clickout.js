
const VueOnClickout = {
	install(Vue) {
		const cout = "clickout";

		// Keeps a list of all elements with v-clickout directive, ordered
		// from top level element to deeper level elements.
		let clickoutList = [];

		// List of elements that stops the current propagation of clickout event.
		let stopList = [];

		let sortNeeded = false;

		Vue.directive(cout, {
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
		});

		// Sort the elements in the list so that the events will fire in the correct order.
		function elSort(e1, e2) {
			if(e2.contains(e1)) return 1;
			if(e1.contains(e2)) return -1;
			return 0;
		}

		// Use a central event listener to control the firing of clickout events.
		document.addEventListener('click', (event) => {
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
		});

		// The trick is that we hack the element-creating method of Vue,
		// and replace it with a wrapper function that detects the existence
		// of the "v-on:clickout" event. If the event exists, then add the
		// "v-clickout" directive to it.
		// We still use directive as in many other similar packages,
		// because that's the most convenient way of tracking the construction
		// and destruction of elements.
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
		})
	}
}

// Automatically load the plugin itself.
if(typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(VueOnClickout);
}