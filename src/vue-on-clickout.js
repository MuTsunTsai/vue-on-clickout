
const VueOnClickout = {
	install(Vue) {
		const cout = "clickout";

		// Keeps a list of all elements with v-clickout directive, ordered
		// from deeper elements to top level elements.
		let clickoutList = [];

		let sortNeeded = false;

		Vue.directive(cout, {
			bind(el) {
				// Newly added element is likely to be of lower order,
				// so we place it at the beginning of the array to speed up sorting.
				clickoutList.unshift(el);
				sortNeeded = true;

				el.__clicked = false;
				el.addEventListener('click', () => el.__clicked = true);
				el.addEventListener(cout, (e) => {
					// In case of stopPropagation, prevent any ancestor element
					// from firing the clickout event.
					if(e.cancelBubble) clickoutList.forEach(p => {
						if(p.contains(el)) p.__clicked = true;
					});
				});
			},
			unbind(el) {
				clickoutList.splice(clickoutList.indexOf(el), 1);
			}
		});

		// Sort the elements in the list so that the events will fire in the correct order.
		function elSort(e1, e2) {
			if(e2.contains(e1)) return -1;
			if(e1.contains(e2)) return 1;
			return 0;
		}

		// Use a central event listener to control the firing of clickout events.
		document.addEventListener('click', () => {
			if(sortNeeded) {
				clickoutList.sort(elSort);
				sortNeeded = false;
			}
			for(let el of clickoutList) {
				if(!el.__clicked) el.dispatchEvent(new Event(cout));
				el.__clicked = false;
			}
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
				function hack_c(a, b, c, d) {
					if(b && b.on && b.on[cout]) {
						b.directives = b.directives || [];
						if(!b.directives.some(d => d.name == cout))
							b.directives.push({ name: cout, rawName: "v-" + cout });
					}
					return original_c(a, b, c, d);
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