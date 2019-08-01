;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.VueOnClickout = factory();
  }
}(this, function() {

const VueOnClickout = {
	install(Vue) {
		const cout = "clickout";
		
		// Keeps a list of all elements with v-clickout directive.
		let clickoutList = [];

		Vue.directive(cout, {
			bind(el) {
				clickoutList.push(el);
				el.__clickoutFlag = false;
				let add = el.addEventListener.bind(el);
				add('click', () => el.__clickoutFlag = true);
				add(cout, (e) => {
					// In case of stopPropagation, prevent any ancestor element
					// from firing the clickout event.
					if(e.cancelBubble) clickoutList.forEach(p => {
						if(p.contains(el)) p.__clickoutFlag = true;
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
			clickoutList.sort(elSort);
			for(let el of clickoutList) {
				if(!el.__clickoutFlag) el.dispatchEvent(new Event(cout));
				el.__clickoutFlag = false;
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
return VueOnClickout;
}));
